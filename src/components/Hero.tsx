import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

class GenerativeHeroAnimation {
  private container: HTMLElement | null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private points: THREE.Points | null;
  private particleData: Array<{
    velocity: THREE.Vector3;
    basePosition: THREE.Vector3;
  }>;
  private mouse: THREE.Vector2;
  private scrollForce: number;
  private clock: THREE.Clock;
  private hasInteracted: boolean;
  private noise: any;
  private params: {
    particleCount: number;
    hoverRadius: number;
    repulsionStrength: number;
    spawnChance: number;
    scrollGravity: number;
    oscillationFreq: number;
    oscillationAmp: number;
    noiseStrength: number;
    accentGold: number;
    accentTurquoise: number;
  };

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error("Animation container not found!");
      return;
    }

    // Core Parameters
    this.params = {
      particleCount: 15000,
      hoverRadius: 0.2,
      repulsionStrength: 0.15,
      spawnChance: 0.05,
      scrollGravity: 0.03,
      oscillationFreq: 8.0,
      oscillationAmp: 0.05,
      noiseStrength: 0.01,
      accentGold: 0xFFD700,
      accentTurquoise: 0x40E0D0
    };

    // Setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 2);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // State
    this.mouse = new THREE.Vector2(999, 999);
    this.scrollForce = 0;
    this.clock = new THREE.Clock();
    this.hasInteracted = true;
    this.points = null;
    this.particleData = [];
    
    // Simple noise function
    this.noise = {
      noise3D: (x: number, y: number, z: number) => {
        return Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
      }
    };

    this.initParticles();
    this.addEventListeners();
    this.animate();
  }

  initParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < this.params.particleCount; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      );
      
      positions.push(position.x, position.y, position.z);
      colors.push(0.2, 0.2, 0.2); // Base gray color
      
      this.particleData.push({
        velocity: new THREE.Vector3(),
        basePosition: position.clone()
      });
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Create particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d')!;
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(canvas);
    
    const material = new THREE.PointsMaterial({
      size: 0.015,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true // ADD THIS LINE as requested
    });
    
    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
  }

  addEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const scrollPercent = Math.min(scrollY / (window.innerHeight * 0.5), 1);
      this.scrollForce = scrollPercent * this.params.scrollGravity;
    });
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate = () => {
    if (!this.hasInteracted) {
      requestAnimationFrame(this.animate);
      return;
    }

    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = this.clock.getDelta();
    
    if (!this.points) return;
    
    // Get attribute arrays from geometry
    const positions = this.points.geometry.attributes.position.array;
    const colors = this.points.geometry.attributes.color.array;

    const mouseWorldPos = new THREE.Vector3(this.mouse.x * this.camera.aspect, this.mouse.y, 0).unproject(this.camera);

    const goldColor = new THREE.Color(this.params.accentGold);
    const turquoiseColor = new THREE.Color(this.params.accentTurquoise);

    for (let i = 0; i < this.params.particleCount; i++) {
      const i3 = i * 3;
      const pos = new THREE.Vector3(positions[i3], positions[i3+1], positions[i3+2]);
      const data = this.particleData[i];

      // --- Organic "Fungal" Movement using Noise ---
      const noise = this.noise.noise3D(pos.x * 0.1, pos.y * 0.1, pos.z * 0.1 + elapsedTime * 0.05);
      data.velocity.x += this.params.noiseStrength * Math.sin(noise * Math.PI * 2) * deltaTime;
      data.velocity.y += this.params.noiseStrength * Math.cos(noise * Math.PI * 2) * deltaTime;
      
      // --- Mouse Interaction ---
      let isHovered = false;
      const distanceToMouse = pos.distanceTo(mouseWorldPos);
      if (distanceToMouse < this.params.hoverRadius) {
        isHovered = true;
        const repulsion = new THREE.Vector3().subVectors(pos, mouseWorldPos).normalize();
        data.velocity.add(repulsion.multiplyScalar(this.params.repulsionStrength * deltaTime));
      }

      // --- Scroll Interaction ---
      if (this.scrollForce > 0) {
        data.velocity.y -= this.scrollForce;
        const oscillation = Math.sin(pos.y * this.params.oscillationFreq + elapsedTime * 5) * this.mouse.x * this.params.oscillationAmp;
        pos.x += oscillation;
      } else {
         data.velocity.z += (data.basePosition.z - pos.z) * 0.001;
      }

      // --- UPDATE PHYSICS & POSITION ---
      pos.add(data.velocity);
      data.velocity.multiplyScalar(0.94); // Damping
      positions[i3] = pos.x;
      positions[i3+1] = pos.y;
      positions[i3+2] = pos.z;

      // =========================================================
      // --- NEW: DYNAMIC COLOR LOGIC FOR ELEGANT VIBRANCY ---
      // =========================================================
      const speed = data.velocity.length();
      const baseColor = new THREE.Color(colors[i3], colors[i3+1], colors[i3+2]);
      const finalColor = new THREE.Color();

      if (isHovered) {
        // If hovered, glow with a vibrant gold color
        finalColor.lerpColors(baseColor, goldColor, 0.8);
      } else if (speed > 0.001) {
        // If moving fast, glow with turquoise based on speed
        // Clamp the lerp factor for a subtle effect
        const energy = Math.min(speed * 200, 1.0); 
        finalColor.lerpColors(baseColor, turquoiseColor, energy);
      } else {
        // Otherwise, remain its base color
        finalColor.copy(baseColor);
      }
      
      colors[i3] = finalColor.r;
      colors[i3+1] = finalColor.g;
      colors[i3+2] = finalColor.b;
    }
    
    // Tell three.js these attributes have been updated
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.color.needsUpdate = true;
    
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  destroy() {
    if (this.renderer && this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

const GenerativeParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<GenerativeHeroAnimation | null>(null);

  useEffect(() => {
    const initAnimation = () => {
      if (containerRef.current && !animationRef.current) {
        animationRef.current = new GenerativeHeroAnimation('hero-animation-container');
      }
    };

    const timeoutId = setTimeout(initAnimation, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="hero-animation-container"
      className="absolute inset-0 w-full h-full"
      style={{ 
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
    />
  );
};

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Advanced Three.js Generative Animation */}
      <GenerativeParticles />

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