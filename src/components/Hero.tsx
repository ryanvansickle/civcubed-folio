import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const BiosphereParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    originalVx: number;
    originalVy: number;
    originalVz: number;
    size: number;
    opacity: number;
    baseOpacity: number;
    targetX?: number;
    targetY?: number;
    isAligning: boolean;
    trailParticles?: Array<{x: number; y: number; opacity: number; life: number}>;
  }>>([]);
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas setup
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Advanced mouse tracking with velocity
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newMouseX = e.clientX - rect.left;
      const newMouseY = e.clientY - rect.top;
      
      // Calculate mouse velocity for generative effects
      mouseVelocityRef.current = {
        x: newMouseX - lastMouseRef.current.x,
        y: newMouseY - lastMouseRef.current.y
      };
      
      lastMouseRef.current = { x: newMouseX, y: newMouseY };
      mouseX = newMouseX;
      mouseY = newMouseY;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 8000));
      
      for (let i = 0; i < particleCount; i++) {
        const vx = (Math.random() - 0.5) * 1.2;
        const vy = (Math.random() - 0.5) * 1.2;
        const vz = (Math.random() - 0.5) * 0.5;
        
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 100 + 50, // Depth for 3D effect
          vx,
          vy,
          vz,
          originalVx: vx,
          originalVy: vy,
          originalVz: vz,
          size: Math.random() * 2 + 1.5,
          opacity: Math.random() * 0.3 + 0.2,
          baseOpacity: Math.random() * 0.3 + 0.2,
          isAligning: false,
          trailParticles: []
        });
      }
    };

    initParticles();

    // Animation loop
    const animate = () => {
      // Clear canvas with slight trail effect
      ctx.fillStyle = 'rgba(253, 251, 248, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scrollProgress = Math.min(scrollY / 200, 1);
      const isScrolling = scrollProgress > 0.1;

      particlesRef.current.forEach((particle, index) => {
        // Advanced scroll alignment with helix formation
        if (isScrolling && !particle.isAligning) {
          particle.isAligning = true;
          // Create DNA helix-like structures
          const helixIndex = index % 6;
          const helixRadius = 80;
          const helixCenterX = canvas.width / 2 + (helixIndex - 3) * 120;
          const angle = (index * 0.3) + (Date.now() * 0.001);
          particle.targetX = helixCenterX + Math.cos(angle) * helixRadius;
          particle.targetY = canvas.height + 100;
          
          // Add lateral oscillation on mouse movement
          const mouseOffsetX = mouseX - canvas.width / 2;
          const oscillation = Math.sin(angle + mouseOffsetX * 0.01) * (Math.abs(mouseOffsetX) * 0.1);
          particle.targetX += oscillation;
        } else if (!isScrolling) {
          particle.isAligning = false;
          particle.targetX = undefined;
          particle.targetY = undefined;
        }

        // Update position based on state with enhanced physics
        if (particle.isAligning && particle.targetX && particle.targetY) {
          // Smooth gravitational acceleration to target
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          particle.vx = dx * 0.02;
          particle.vy = dy * 0.02 + 1 + (scrollProgress * 2); // Acceleration increases with scroll
        } else {
          // Enhanced organic drifting with 3D movement
          particle.vx = particle.originalVx + Math.sin(Date.now() * 0.001 + index) * 0.2;
          particle.vy = particle.originalVy + Math.cos(Date.now() * 0.001 + index) * 0.2;
          particle.vz = particle.originalVz + Math.sin(Date.now() * 0.0015 + index) * 0.1;

          // Generative acceleration on mouse movement
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repulseRadius = 120;

          if (distance < repulseRadius && distance > 0) {
            const force = (repulseRadius - distance) / repulseRadius;
            const angle = Math.atan2(dy, dx);
            const acceleration = force * 1.2;
            
            particle.vx -= Math.cos(angle) * acceleration;
            particle.vy -= Math.sin(angle) * acceleration;
            
            // Generate trail particles in wake
            const velocity = Math.sqrt(mouseVelocityRef.current.x ** 2 + mouseVelocityRef.current.y ** 2);
            if (velocity > 2 && Math.random() < 0.3) {
              if (!particle.trailParticles) particle.trailParticles = [];
              particle.trailParticles.push({
                x: particle.x,
                y: particle.y,
                opacity: 0.6,
                life: 30
              });
            }
          }
        }

        // Apply movement with 3D depth
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Boundary wrapping
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Velocity damping
        if (!particle.isAligning) {
          particle.vx *= 0.98;
          particle.vy *= 0.98;
        }

        // Enhanced opacity with depth
        const depthFactor = (particle.z + 50) / 150; // Normalize depth
        particle.opacity = (particle.baseOpacity + Math.sin(Date.now() * 0.002 + index) * 0.1) * depthFactor;

        // Update and draw trail particles
        if (particle.trailParticles) {
          particle.trailParticles.forEach((trail, trailIndex) => {
            trail.life--;
            trail.opacity *= 0.95;
            
            if (trail.life > 0) {
              ctx.beginPath();
              ctx.arc(trail.x, trail.y, 1, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(212, 175, 55, ${trail.opacity * 0.4})`;
              ctx.fill();
            }
          });
          particle.trailParticles = particle.trailParticles.filter(trail => trail.life > 0);
        }

        // Mouse proximity detection for color enhancement
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isNearMouse = distance < 120;

        // Draw main particle with 3D-influenced size and dynamic color
        const scaledSize = particle.size * depthFactor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, scaledSize, 0, Math.PI * 2);
        
        if (isNearMouse) {
          // Enhanced gold accent with glow when near mouse
          const intensity = 1 - (distance / 120);
          ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity * (0.5 + intensity * 0.5)})`;
          ctx.shadowBlur = intensity * 8;
          ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
        } else {
          // Default dark gray with depth
          ctx.fillStyle = `rgba(85, 85, 85, ${particle.opacity})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();

        // Draw connections with enhanced interactions
        if (scrollProgress > 0.2) {
          // Enhanced connections during scroll - turquoise accent
          particlesRef.current.slice(index + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 160;

            if (distance < maxDistance) {
              const lineOpacity = (1 - distance / maxDistance) * 0.4 * scrollProgress;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              // Turquoise accent for organized flow
              ctx.strokeStyle = `rgba(0, 160, 160, ${lineOpacity})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          });
        } else {
          // Subtle connections in default state
          particlesRef.current.slice(index + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 120;

            if (distance < maxDistance) {
              const lineOpacity = (1 - distance / maxDistance) * 0.2;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(136, 136, 136, ${lineOpacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Biosphere Particle Animation */}
      <BiosphereParticles />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-12 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-normal text-foreground mb-8 tracking-tight leading-[1.1] animate-fade-in">
            Ryan Van Sickle
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl lg:text-4xl text-foreground/80 mb-8 tracking-wide animate-fade-in font-light" style={{ animationDelay: '0.002s' }}>
            Futurist | Strategist | Author
          </p>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-foreground/70 mb-20 max-w-4xl mx-auto leading-relaxed italic animate-fade-in" style={{ animationDelay: '0.004s', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            The Industrial Age is over. What comes next?
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.006s' }}>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-foreground/30 text-foreground hover:bg-foreground/5 hover:border-foreground/50 font-normal tracking-wide transition-all duration-300 px-8 py-4"
            >
              Explore More
              <ArrowRight size={16} strokeWidth={1.5} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};