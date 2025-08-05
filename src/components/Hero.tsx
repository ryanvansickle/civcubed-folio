import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const BiosphereParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    originalVx: number;
    originalVy: number;
    size: number;
    opacity: number;
    baseOpacity: number;
    targetX?: number;
    targetY?: number;
    isAligning: boolean;
  }>>([]);

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

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
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
        
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx,
          vy,
          originalVx: vx,
          originalVy: vy,
          size: Math.random() * 2 + 1.5,
          opacity: Math.random() * 0.3 + 0.2,
          baseOpacity: Math.random() * 0.3 + 0.2,
          isAligning: false
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
        // Handle scroll alignment
        if (isScrolling && !particle.isAligning) {
          particle.isAligning = true;
          // Create target position for flowing lines
          const lineIndex = index % 8;
          const lineSpacing = canvas.width / 9;
          particle.targetX = lineSpacing * (lineIndex + 1);
          particle.targetY = canvas.height + 100;
        } else if (!isScrolling) {
          particle.isAligning = false;
          particle.targetX = undefined;
          particle.targetY = undefined;
        }

        // Update position based on state
        if (particle.isAligning && particle.targetX && particle.targetY) {
          // Smooth transition to target position
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          particle.vx = dx * 0.02;
          particle.vy = dy * 0.02 + 1;
        } else {
          // Organic drifting movement
          particle.vx = particle.originalVx + Math.sin(Date.now() * 0.001 + index) * 0.2;
          particle.vy = particle.originalVy + Math.cos(Date.now() * 0.001 + index) * 0.2;

          // Mouse repulsion effect
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repulseRadius = 120;

          if (distance < repulseRadius && distance > 0) {
            const force = (repulseRadius - distance) / repulseRadius;
            const angle = Math.atan2(dy, dx);
            particle.vx -= Math.cos(angle) * force * 0.8;
            particle.vy -= Math.sin(angle) * force * 0.8;
          }
        }

        // Apply movement
        particle.x += particle.vx;
        particle.y += particle.vy;

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

        // Opacity animation
        particle.opacity = particle.baseOpacity + Math.sin(Date.now() * 0.002 + index) * 0.1;

        // Mouse repulsion detection for color enhancement
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isNearMouse = distance < 120;

        // Draw particle with dynamic color
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        if (isNearMouse) {
          // Gold accent when near mouse
          const intensity = 1 - (distance / 120);
          ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity * (0.5 + intensity * 0.5)})`;
        } else {
          // Default dark gray
          ctx.fillStyle = `rgba(85, 85, 85, ${particle.opacity})`;
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
            Futurist | Strategist | Advisor | Author of the forthcoming book, Civilization³
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
              onClick={() => {
                const nextSection = document.getElementById('new-substrate');
                if (nextSection) {
                  nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
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