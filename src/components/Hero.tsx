import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

export const Hero = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
// This final script assumes THREE is already available on the page.
// It is designed for maximum stability and to deliver the core visual experience.

class FinalHeroAnimation {
    constructor() {
        this.container = document.getElementById('hero-animation-container');
        if (!this.container || typeof THREE === 'undefined') {
            console.error("Animation failed: Container or Three.js not found.");
            return;
        }

        // --- Core Parameters ---
        this.params = {
            particleCount: 15000,
            hoverRadius: 0.4,
            repulsionStrength: 0.003,
            accentGold: 0xD4AF37,
            accentTurquoise: 0x00A0A0,
            baseColor: 0x333333
        };

        // --- Setup ---
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 2.5;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // --- State ---
        this.mouse = new THREE.Vector2(-999, -999);
        this.clock = new THREE.Clock();
        this.hasStarted = false;

        this.initParticles();
        this.addEventListeners();
        this.animate();
    }

    createSporeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }

    initParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.params.particleCount * 3);
        const colors = new Float32Array(this.params.particleCount * 3);
        const sizes = new Float32Array(this.params.particleCount);
        const color = new THREE.Color();
        const accentPalette = [this.params.accentGold, this.params.accentTurquoise, this.params.baseColor, this.params.baseColor];

        this.particleData = [];

        for (let i = 0; i < this.params.particleCount; i++) {
            const i3 = i * 3;
            const pos = new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
            pos.toArray(positions, i3);

            const chosenColor = accentPalette[Math.floor(Math.random() * accentPalette.length)];
            color.set(chosenColor);
            color.toArray(colors, i3);

            sizes[i] = Math.random() * 1.5 + 0.5;

            this.particleData.push({ velocity: new THREE.Vector3(), baseColor: color.clone() });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: this.createSporeTexture() }
            },
            vertexShader: \`
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            \`,
            fragmentShader: \`
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                    if (gl_FragColor.a < 0.1) discard;
                }
            \`,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true
        });

        this.points = new THREE.Points(geometry, material);
        this.points.visible = false; // Start invisible
        this.scene.add(this.points);
    }
    
    addEventListeners() {
      const wakeUp = () => {
        if (!this.hasStarted) {
            this.hasStarted = true;
            this.points.visible = true; // Make particles appear
        }
      };

      window.addEventListener('mousemove', (e) => {
        wakeUp();
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 - 1;
      }, { once: true, passive: true }); // The \`{once: true}\` ensures wakeUp is called only on the very first move

      // Add a persistent mouse move listener to update coordinates continuously
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
    }

    animate() {
      requestAnimationFrame(this.animate.bind(this));
      if (!this.hasStarted) return; // The gatekeeper: do nothing until first interaction

      const elapsedTime = this.clock.getElapsedTime();
      const positions = this.points.geometry.attributes.position.array;
      const mouseWorldPos = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5).unproject(this.camera);

      for (let i = 0; i < this.params.particleCount; i++) {
        const i3 = i * 3;
        const pos = new THREE.Vector3(positions[i3], positions[i3+1], positions[i3+2]);
        const data = this.particleData[i];

        // Gentle, organic drift
        pos.x += Math.sin(elapsedTime * 0.1 + i) * 0.0001;
        pos.y += Math.cos(elapsedTime * 0.1 + i) * 0.0001;
        
        // Mouse repulsion
        const distanceToMouse = pos.distanceTo(mouseWorldPos);
        if (distanceToMouse < this.params.hoverRadius) {
          const repulsion = new THREE.Vector3().subVectors(pos, mouseWorldPos).normalize();
          data.velocity.add(repulsion.multiplyScalar(this.params.repulsionStrength));
        }

        pos.add(data.velocity);
        data.velocity.multiplyScalar(0.92); // Damping
        pos.toArray(positions, i3);
      }

      this.points.geometry.attributes.position.needsUpdate = true;
      this.renderer.render(this.scene, this.camera);
    }
}

// Ensure the DOM is ready before creating the animation
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => new FinalHeroAnimation());
} else {
    new FinalHeroAnimation();
}
    `;
    document.head.appendChild(script);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animation Container */}
      <div id="hero-animation-container"></div>

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