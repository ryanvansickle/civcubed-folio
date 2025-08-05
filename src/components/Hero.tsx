import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import * as THREE from "three";

class GenerativeHeroAnimation {
  private container: HTMLElement | null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.InstancedMesh | null;
  private particleData: Array<{
    velocity: THREE.Vector3;
    basePosition: THREE.Vector3;
  }>;
  private mouse: THREE.Vector2;
  private scrollForce: number;
  private clock: THREE.Clock;
  private dummy: THREE.Object3D;
  private params: {
    particleCount: number;
    hoverRadius: number;
    repulsionStrength: number;
    spawnChance: number;
    scrollGravity: number;
    oscillationFreq: number;
    oscillationAmp: number;
  };

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error("Animation container not found!");
      return;
    }

    // Core Parameters - Optimized for performance
    this.params = {
      particleCount: 11250, // Reduced by 25% for performance
      hoverRadius: 0.2,
      repulsionStrength: 0.15,
      spawnChance: 0.03, // Reduced spawn rate for better performance
      scrollGravity: 0.03,
      oscillationFreq: 8.0,
      oscillationAmp: 0.05
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
    this.dummy = new THREE.Object3D();
    this.particles = null;
    this.particleData = [];

    this.initParticles();
    this.addEventListeners();
    this.animate();
  }

  initParticles() {
    // Simplified geometry - reduced subdivision level from 1 to 0 (~20% polygon reduction)
    const geometry = new THREE.IcosahedronGeometry(0.003, 0);
    // Optimized material - no lighting calculations needed
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x333333,
      transparent: false, // Disable transparency for better performance
      fog: false // Disable fog calculations
    });
    this.particles = new THREE.InstancedMesh(geometry, material, this.params.particleCount);
    
    for (let i = 0; i < this.params.particleCount; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      );
      this.dummy.position.copy(position);
      this.dummy.updateMatrix();
      this.particles.setMatrixAt(i, this.dummy.matrix);

      this.particleData.push({
        velocity: new THREE.Vector3(),
        basePosition: position.clone()
      });
    }
    this.scene.add(this.particles);
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
    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    if (!this.particles) return;

    const mouseWorldPos = new THREE.Vector3(this.mouse.x * this.camera.aspect, this.mouse.y, 0).unproject(this.camera);

    for (let i = 0; i < this.params.particleCount; i++) {
      this.particles.getMatrixAt(i, this.dummy.matrix);
      const currentPos = new THREE.Vector3().setFromMatrixPosition(this.dummy.matrix);
      const data = this.particleData[i];

      // Hover: Acceleration & Multiplication
      const distanceToMouse = currentPos.distanceTo(mouseWorldPos);
      if (distanceToMouse < this.params.hoverRadius) {
        const repulsionForce = new THREE.Vector3().subVectors(currentPos, mouseWorldPos).normalize();
        data.velocity.add(repulsionForce.multiplyScalar(this.params.repulsionStrength * deltaTime));
        
        if (Math.random() < this.params.spawnChance) {
          // "Multiplication": re-use a distant particle to simulate spawning
          const randomIndex = Math.floor(Math.random() * this.params.particleCount);
          this.dummy.position.copy(currentPos);
          this.dummy.updateMatrix();
          this.particles.setMatrixAt(randomIndex, this.dummy.matrix);
          this.particleData[randomIndex].velocity.copy(data.velocity).multiplyScalar(0.5);
        }
      }
      
      // Scroll: Downward acceleration with smooth ease-in
      if (this.scrollForce > 0) {
        data.velocity.y -= this.scrollForce * deltaTime;
      } else {
         // Return to base position when not scrolling
         const returnForce = new THREE.Vector3().subVectors(data.basePosition, currentPos).multiplyScalar(0.001);
         data.velocity.add(returnForce);
      }

      // Oscillation during scroll
      if (this.scrollForce > 0.001) {
          const oscillation = Math.sin(currentPos.y * this.params.oscillationFreq + elapsedTime) * this.mouse.x * this.params.oscillationAmp;
          currentPos.x += oscillation;
      }

      // Update Physics
      currentPos.add(data.velocity);
      data.velocity.multiplyScalar(0.96); // Damping

      this.dummy.position.copy(currentPos);
      this.dummy.updateMatrix();
      this.particles.setMatrixAt(i, this.dummy.matrix);
    }

    this.particles.instanceMatrix.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  destroy() {
    if (this.renderer && this.container && this.renderer.domElement) {
      // Check if the element is actually a child before removing
      if (this.container.contains(this.renderer.domElement)) {
        this.container.removeChild(this.renderer.domElement);
      }
      // Dispose of Three.js resources
      this.renderer.dispose();
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
      {/* Background Music */}
      <BackgroundMusic />
      
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