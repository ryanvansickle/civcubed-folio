import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

class HeroAnimation {
  private container: HTMLElement | null;
  private params: {
    particleCount: number;
    hoverRadius: number;
    repulsionStrength: number;
    spawnRate: number;
    scrollGravity: number;
    oscillationFrequency: number;
    oscillationAmplitude: number;
  };
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private mouse: THREE.Vector2;
  private targetMouse: THREE.Vector2;
  private scrollDownForce: number;
  private clock: THREE.Clock;
  private particles: THREE.InstancedMesh | null;
  private particleData: Array<{
    velocity: THREE.Vector3;
    basePosition: THREE.Vector3;
    age: number;
    lifespan: number;
  }>;
  private onMouseMove: (event: MouseEvent) => void;
  private onScroll: () => void;
  private onResize: () => void;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error("Animation container not found!");
      return;
    }

    // Core Parameters (Tweak these for artistic direction)
    this.params = {
      particleCount: 15000,
      hoverRadius: 0.15,
      repulsionStrength: 0.1,
      spawnRate: 0.5,
      scrollGravity: 0.00005,
      oscillationFrequency: 0.1,
      oscillationAmplitude: 0.01
    };

    // Setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 1.5;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // State Variables
    this.mouse = new THREE.Vector2(9999, 9999);
    this.targetMouse = new THREE.Vector2(9999, 9999);
    this.scrollDownForce = 0;
    this.clock = new THREE.Clock();
    this.particles = null;
    this.particleData = [];

    // Bind methods
    this.onMouseMove = this.handleMouseMove.bind(this);
    this.onScroll = this.handleScroll.bind(this);
    this.onResize = this.handleResize.bind(this);

    this.initParticles();
    this.initEventListeners();
    this.animate();
  }

  initParticles() {
    // Uses InstancedMesh for extreme performance
    const particleGeometry = new THREE.SphereGeometry(0.002, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    this.particles = new THREE.InstancedMesh(particleGeometry, particleMaterial, this.params.particleCount);

    this.particleData = [];
    const transform = new THREE.Object3D();

    for (let i = 0; i < this.params.particleCount; i++) {
      transform.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      transform.updateMatrix();
      this.particles.setMatrixAt(i, transform.matrix);

      this.particleData.push({
        velocity: new THREE.Vector3(),
        basePosition: transform.position.clone(),
        age: Math.random() * 100,
        lifespan: 100 + Math.random() * 50
      });
    }
    this.scene.add(this.particles);
  }

  initEventListeners() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
  }

  handleMouseMove(event: MouseEvent) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  handleScroll() {
    // Calculate scroll force based on scroll position
    const scrollY = window.scrollY;
    const scrollPercent = Math.min(scrollY / 500, 1);
    
    // Use easing function for smooth acceleration
    const easeInQuad = (t: number) => t * t;
    this.scrollDownForce = easeInQuad(scrollPercent) * this.params.scrollGravity;
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    if (!this.particles) return;

    // Smoothly interpolate mouse position
    this.mouse.lerp(this.targetMouse, 0.05);
    
    // Convert normalized mouse coords to world space
    const mouseWorld = new THREE.Vector3(this.mouse.x * this.camera.aspect, this.mouse.y, 0).unproject(this.camera);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.params.particleCount; i++) {
      this.particles.getMatrixAt(i, dummy.matrix);
      const pos = new THREE.Vector3().setFromMatrixPosition(dummy.matrix);
      const data = this.particleData[i];

      // Reset dead particles for continuous loop
      data.age += deltaTime;
      if (data.age > data.lifespan) {
        pos.copy(data.basePosition);
        data.velocity.set(0, 0, 0);
        data.age = 0;
      }
      
      // Hover interaction: acceleration & multiplication
      const distanceToMouse = pos.distanceTo(mouseWorld);
      if (distanceToMouse < this.params.hoverRadius) {
        const repulsion = new THREE.Vector3().subVectors(pos, mouseWorld).normalize();
        data.velocity.add(repulsion.multiplyScalar(this.params.repulsionStrength * deltaTime));
        
        // Particle multiplication
        if (Math.random() > this.params.spawnRate) {
          const spawnIndex = Math.floor(Math.random() * this.params.particleCount);
          if (this.particleData[spawnIndex].age > this.particleData[spawnIndex].lifespan) {
            const spawnPos = new THREE.Vector3(
              mouseWorld.x + (Math.random() - 0.5) * 0.1,
              mouseWorld.y + (Math.random() - 0.5) * 0.1,
              mouseWorld.z + (Math.random() - 0.5) * 0.1
            );
            dummy.position.copy(spawnPos);
            this.particleData[spawnIndex].velocity.copy(data.velocity).multiplyScalar(0.5);
            this.particleData[spawnIndex].age = 0;
            this.particleData[spawnIndex].lifespan = 1 + Math.random();
          }
        }
      }

      // Scroll interaction: acceleration & oscillation
      if (this.scrollDownForce > 0) {
        data.velocity.y -= this.scrollDownForce;
        
        // Lateral oscillation based on mouse X position
        const oscillation = Math.sin(pos.y * this.params.oscillationFrequency + elapsedTime) * this.mouse.x * this.params.oscillationAmplitude;
        pos.x += oscillation;
      }

      // Update physics
      pos.add(data.velocity);
      data.velocity.multiplyScalar(0.97); // Damping

      dummy.position.copy(pos);
      dummy.updateMatrix();
      this.particles.setMatrixAt(i, dummy.matrix);
    }
    this.particles.instanceMatrix.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.renderer && this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }
}

const BiosphereParticles = () => {
  const animationRef = useRef<HeroAnimation | null>(null);

  useEffect(() => {
    // Initialize the animation
    animationRef.current = new HeroAnimation('hero-animation-container');

    return () => {
      // Cleanup on unmount
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      id="hero-animation-container"
      className="absolute inset-0 w-full h-full"
      style={{ 
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden'
      }}
    />
  );
};

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Advanced Three.js Biosphere Animation */}
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