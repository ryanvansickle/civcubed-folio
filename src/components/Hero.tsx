import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const GenerativeParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the stable animation
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.innerHTML = `
class StableHeroAnimation {
  constructor() {
    this.container = document.getElementById('hero-animation-container');
    if (!this.container) return;

    // --- Simplified Parameters for Stability ---
    this.params = {
      particleCount: 15000,
      accentGold: 0xD4AF37,
      accentTurquoise: 0x00A0A0,
      baseColor: 0x444444,
      hoverRadius: 0.35,
      repulsionStrength: 0.2
    };

    // --- Setup ---
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 2;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    // --- State ---
    this.mouse = new THREE.Vector2(-999, -999);
    this.clock = new THREE.Clock();
    this.hasInteracted = false;

    this.initParticles();
    this.addEventListeners();
    this.animate();
  }

  // --- Initializes particles in a "ready" state ---
  initParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.params.particleCount * 3);
    const colors = new Float32Array(this.params.particleCount * 3);
    const color = new THREE.Color();
    const accentPalette = [this.params.accentGold, this.params.accentTurquoise, this.params.baseColor, this.params.baseColor, this.params.baseColor];
    
    this.particleData = [];

    for (let i = 0; i < this.params.particleCount; i++) {
      const i3 = i * 3;
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      pos.toArray(positions, i3);
      
      color.set(accentPalette[Math.floor(Math.random() * accentPalette.length)]);
      color.toArray(colors, i3);
      
      this.particleData.push({ velocity: new THREE.Vector3() });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.015,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    });
    
    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
  }

  // --- Simplified and Corrected Event Listeners ---
  addEventListeners() {
    const wakeUp = () => {
      if (!this.hasInteracted) {
        this.hasInteracted = true;
        this.container.classList.add('is-active');
      }
    };

    window.addEventListener('mousemove', (e) => {
      wakeUp();
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    window.addEventListener('scroll', wakeUp, { once: true, passive: true });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // --- The Main Animation Loop ---
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    if (!this.hasInteracted) return; // Gatekeeper remains crucial

    const elapsedTime = this.clock.getElapsedTime();
    const positions = this.points.geometry.attributes.position.array;
    const colors = this.points.geometry.attributes.color.array;
    const mouseWorldPos = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);

    for (let i = 0; i < this.params.particleCount; i++) {
      const i3 = i * 3;
      const pos = new THREE.Vector3(positions[i3], positions[i3+1], positions[i3+2]);
      const data = this.particleData[i];

      // Simplified Organic Movement
      const timeFactor = elapsedTime * 0.1;
      const noise = Math.sin(pos.y * 0.5 + timeFactor) * Math.cos(pos.x * 0.5 + timeFactor);
      data.velocity.x += Math.sin(noise) * 0.0001;
      data.velocity.y += Math.cos(noise) * 0.0001;
      
      // Mouse Interaction
      const distanceToMouse = pos.distanceTo(mouseWorldPos);
      if (distanceToMouse < this.params.hoverRadius) {
        const repulsion = new THREE.Vector3().subVectors(pos, mouseWorldPos).normalize();
        data.velocity.add(repulsion.multiplyScalar(this.params.repulsionStrength * 0.01));
      }

      // Update position and color
      pos.add(data.velocity);
      data.velocity.multiplyScalar(0.95); // Damping
      pos.toArray(positions, i3);

      const speed = data.velocity.length();
      if (speed > 0.001) {
        const lerpFactor = Math.min(speed * 10, 1.0);
        const activeColor = new THREE.Color(this.params.accentTurquoise);
        const baseColor = new THREE.Color().fromArray(colors, i3);
        baseColor.lerp(activeColor, lerpFactor);
        baseColor.toArray(colors, i3);
      }
    }

    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.color.needsUpdate = true;
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Ensure the DOM is ready before creating the animation
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => new StableHeroAnimation());
} else {
    new StableHeroAnimation();
}
      `;
      document.head.appendChild(script2);
    };
    document.head.appendChild(script1);

    return () => {
      // Cleanup scripts on unmount
      const scripts = document.querySelectorAll('script[src*="three.js"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          #hero-animation-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: -1;
            opacity: 0;
            transition: opacity 2s ease-in-out;
          }
          #hero-animation-container.is-active {
            opacity: 1;
          }
        `
      }} />
      <div 
        ref={containerRef}
        id="hero-animation-container"
      />
    </>
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