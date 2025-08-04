import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const FinalAnimation = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
// This script assumes THREE is already globally available from the platform.
if (typeof THREE !== 'undefined') {
  class FinalHeroAnimation {
    constructor() {
      // --- Core Parameters for Artistic Control ---
      this.params = {
        particleCount: 18000,
        accentGold: 0xD4AF37,
        accentTurquoise: 0x00A0A0,
        baseColor: 0x444444,
        hoverRadius: 0.3,
        repulsionStrength: 0.25,
        scrollGravity: 0.04,
        oscillationFreq: 6.0,
        oscillationAmp: 0.06
      };

      // --- Setup ---
      this.container = document.getElementById('hero-animation-container');
      if (!this.container) return;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
      this.camera.position.set(0, 0, 2);
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.container.appendChild(this.renderer.domElement);

      // --- State ---
      this.mouse = new THREE.Vector2(-999, -999);
      this.clock = new THREE.Clock();
      this.hasInteracted = false;

      this.initParticles();
      this.addEventListeners();
      this.animate();
    }

    initParticles() {
      const material = new THREE.PointsMaterial({
        size: 0.015,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true
      });

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(this.params.particleCount * 3);
      const colors = new Float32Array(this.params.particleCount * 3);
      const color = new THREE.Color();
      const accentPalette = [this.params.accentGold, this.params.accentTurquoise, this.params.baseColor, this.params.baseColor, this.params.baseColor, this.params.baseColor];
      
      this.particleData = [];

      for (let i = 0; i < this.params.particleCount; i++) {
        // Initialize far away to be invisible before wake-up
        positions[i * 3] = positions[i * 3 + 1] = positions[i * 3 + 2] = -1000; 

        color.set(accentPalette[Math.floor(Math.random() * accentPalette.length)]);
        color.toArray(colors, i * 3);
        
        this.particleData.push({
          velocity: new THREE.Vector3(),
          basePosition: new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4)
        });
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      this.points = new THREE.Points(geometry, material);
      this.scene.add(this.points);
    }

    addEventListeners() {
      const wakeUp = () => {
        if (this.hasInteracted) return;
        this.hasInteracted = true;
        this.container.classList.add('is-active');

        // Animate particles into view on first interaction
        const positions = this.points.geometry.attributes.position.array;
        for (let i = 0; i < this.params.particleCount; i++) {
            const targetPos = this.particleData[i].basePosition;
            // A simple spring-like animation (can use a library like GSAP for more complex tweens)
            const startPos = new THREE.Vector3().fromArray(positions, i * 3);
            const duration = 1.5 + Math.random() * 1.5;
            const delay = Math.random() * 0.5;
            // Simple timeout-based tweening for compatibility
            setTimeout(() => {
                let t = 0;
                const interval = setInterval(() => {
                    t += 16 / (duration * 1000);
                    if (t >= 1) {
                        new THREE.Vector3().fromArray(targetPos.toArray()).toArray(positions, i * 3);
                        clearInterval(interval);
                    } else {
                        const easeOut = 1 - Math.pow(1 - t, 4);
                        new THREE.Vector3().copy(startPos).lerp(targetPos, easeOut).toArray(positions, i * 3);
                    }
                    this.points.geometry.attributes.position.needsUpdate = true;
                }, 16);
            }, delay * 1000);
        }
      };

      window.addEventListener('mousemove', (e) => {
        wakeUp();
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 - 1;
      }, { once: true, passive: true });

      window.addEventListener('scroll', wakeUp, { once: true, passive: true });

      window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }

    animate() {
      requestAnimationFrame(this.animate.bind(this));
      if (!this.hasInteracted) return;

      const elapsedTime = this.clock.getElapsedTime();
      const positions = this.points.geometry.attributes.position.array;
      const colors = this.points.geometry.attributes.color.array;
      const mouseWorldPos = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5).unproject(this.camera);

      let scrollForce = 0;
      if (window.scrollY < window.innerHeight * 0.7) {
          scrollForce = (t => t*t)(window.scrollY / (window.innerHeight * 0.7)) * this.params.scrollGravity;
      }
      
      for (let i = 0; i < this.params.particleCount; i++) {
        const i3 = i * 3;
        const pos = new THREE.Vector3(positions[i3], positions[i3+1], positions[i3+2]);
        const data = this.particleData[i];

        // Organic Movement
        const timeFactor = elapsedTime * 0.2;
        data.velocity.x += Math.sin(i + timeFactor) * 0.00005;
        data.velocity.y += Math.cos(i + timeFactor) * 0.00005;

        // Mouse Interaction
        const distanceToMouse = pos.distanceTo(mouseWorldPos);
        if (distanceToMouse < this.params.hoverRadius) {
          const repulsion = new THREE.Vector3().subVectors(pos, mouseWorldPos).normalize();
          data.velocity.add(repulsion.multiplyScalar(this.params.repulsionStrength * 0.01));
        }

        // Scroll Interaction
        if (scrollForce > 0) {
            data.velocity.y -= scrollForce;
            const oscillation = Math.sin(pos.y * this.params.oscillationFreq + elapsedTime * 5) * this.mouse.x * this.params.oscillationAmp;
            pos.x += oscillation;
        } else {
            // Gently return toward base Z position
            data.velocity.z += (data.basePosition.z - pos.z) * 0.01;
        }

        pos.add(data.velocity);
        data.velocity.multiplyScalar(0.96); // Damping
        pos.toArray(positions, i3);
      }

      this.points.geometry.attributes.position.needsUpdate = true;
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Final check to ensure DOM is ready
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => new FinalHeroAnimation());
  } else {
    new FinalHeroAnimation();
  }
} else {
  console.error("Three.js is not available on the page. Animation cannot start.");
}
    `;
    document.head.appendChild(script);

    return () => {
      script.remove();
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
            transition: opacity 2.5s ease-in-out;
          }
          #hero-animation-container.is-active {
            opacity: 1;
          }
        `
      }} />
      <div id="hero-animation-container" />
    </>
  );
};

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Advanced Three.js Generative Animation */}
      <FinalAnimation />

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