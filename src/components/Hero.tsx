import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
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

      {/* Animation Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
class FinalWorkingAnimation {
  constructor() {
    this.container = document.getElementById('hero-animation-container');
    if (!this.container || typeof THREE === 'undefined') {
      console.error("Animation Failed: Three.js or container not found.");
      return;
    }

    // --- Core Parameters ---
    this.params = {
      particleCount: 20000,
      hoverRadius: 0.3,
      repulsionStrength: 0.0035,
      accentGold: 0xD4AF37,
      accentTurquoise: 0x00A0A0,
      baseColor: 0x333333
    };

    // --- Setup ---
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 2.0;
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
    gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  initParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.params.particleCount * 3);
    const colors = new Float32Array(this.params.particleCount * 3);
    const color = new THREE.Color();
    const accentPalette = [this.params.accentGold, this.params.accentTurquoise, this.params.baseColor, this.params.baseColor, this.params.baseColor];
    
    this.particleData = [];

    for (let i = 0; i < this.params.particleCount; i++) {
      const pos = new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
      pos.toArray(positions, i * 3);
      
      const chosenColor = accentPalette[Math.floor(Math.random() * accentPalette.length)];
      color.set(chosenColor);
      color.toArray(colors, i * 3);
      
      this.particleData.push({ velocity: new THREE.Vector3(), baseColor: color.clone() });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.02,
      map: this.createSporeTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    });
    
    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
  }

  addEventListeners() {
    const wakeUp = () => {
      if (this.hasStarted) return;
      this.hasStarted = true;
      this.container.classList.add('is-active');
    };

    window.addEventListener('mousemove', (e) => {
      wakeUp();
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    window.addEventListener('scroll', wakeUp, { once: true, passive: true });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    if (!this.hasStarted) return; // The gatekeeper: do nothing until first interaction

    const elapsedTime = this.clock.getElapsedTime();
    const positions = this.points.geometry.attributes.position.array;
    const colors = this.points.geometry.attributes.color.array;
    // Correctly get mouse position in 3D space
    const mouseWorldPos = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5).unproject(this.camera);

    const goldColor = new THREE.Color(this.params.accentGold);
    const turquoiseColor = new THREE.Color(this.params.accentTurquoise);

    for (let i = 0; i < this.params.particleCount; i++) {
      const i3 = i * 3;
      const pos = new THREE.Vector3(positions[i3], positions[i3+1], positions[i3+2]);
      const data = this.particleData[i];

      // Gentle, organic drift using sine waves for stability
      const timeFactor = elapsedTime * 0.2;
      data.velocity.x += Math.sin(i + timeFactor) * 0.00003;
      data.velocity.y += Math.cos(i + timeFactor) * 0.00003;
      
      // Mouse repulsion
      let isHovered = false;
      const distanceToMouse = pos.distanceTo(mouseWorldPos);
      if (distanceToMouse < this.params.hoverRadius) {
        isHovered = true;
        const repulsion = new THREE.Vector3().subVectors(pos, mouseWorldPos).normalize();
        data.velocity.add(repulsion.multiplyScalar(this.params.repulsionStrength));
      }

      // Update position and apply damping
      pos.add(data.velocity);
      data.velocity.multiplyScalar(0.94); 
      pos.toArray(positions, i3);
      
      // Dynamic Color Logic
      const speed = data.velocity.length();
      const finalColor = new THREE.Color();
      const baseColor = data.baseColor; // Use stored base color

      if (isHovered) {
        finalColor.lerpColors(baseColor, goldColor, 0.9);
      } else if (speed > 0.0005) {
        const energy = Math.min(speed * 100, 1.0);
        finalColor.lerpColors(baseColor, turquoiseColor, energy);
      } else {
        finalColor.copy(baseColor);
      }
      finalColor.toArray(colors, i3);
    }

    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.color.needsUpdate = true;
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Ensure the DOM is ready before trying to create the animation
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => new FinalWorkingAnimation());
} else {
    new FinalWorkingAnimation();
}
          `
        }}
      />
    </section>
  );
};