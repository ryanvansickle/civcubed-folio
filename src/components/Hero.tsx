import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

class FinalHeroAnimation {
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
  private wakeUpTime: number;
  private noise: any;
  private params: {
    particleCount: number;
    baseColor: number;
    accentGold: number;
    accentTurquoise: number;
    hoverRadius: number;
    repulsionStrength: number;
    noiseSpeed: number;
    noiseStrength: number;
    scrollGravity: number;
    oscillationFreq: number;
    oscillationAmp: number;
    wakeUpDuration: number;
  };

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error("Animation container not found!");
      return;
    }

    // Core Parameters
    this.params = {
      particleCount: 20000,
      baseColor: 0x444444,
      accentGold: 0xD4AF37,
      accentTurquoise: 0x00A0A0,
      hoverRadius: 0.3,
      repulsionStrength: 0.3,
      noiseSpeed: 0.0001,
      noiseStrength: 0.01,
      scrollGravity: 0.05,
      oscillationFreq: 5.0,
      oscillationAmp: 0.07,
      wakeUpDuration: 2.5
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
    this.mouse = new THREE.Vector2(-99, -99);
    this.scrollForce = 0;
    this.clock = new THREE.Clock();
    this.hasInteracted = false; // This is our gatekeeper
    this.wakeUpTime = -1;
    this.points = null;
    this.particleData = [];

    this.initSimplexNoise();
    this.initParticles();
    this.addEventListeners();
    this.animate(); // Start the animation loop immediately
  }

  initParticles() {
    const particleTexture = this.createSporeTexture();
    const material = new THREE.PointsMaterial({
      size: 0.015,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    });

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.params.particleCount * 3);
    const colors = new Float32Array(this.params.particleCount * 3);
    const color = new THREE.Color();
    const accentPalette = [this.params.accentGold, this.params.accentTurquoise, this.params.baseColor, this.params.baseColor, this.params.baseColor];

    this.particleData = [];

    for (let i = 0; i < this.params.particleCount; i++) {
      // All particles start at the center but will be invisible until wake-up
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      color.set(accentPalette[Math.floor(Math.random() * accentPalette.length)]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      this.particleData.push({
        velocity: new THREE.Vector3(),
        basePosition: new THREE.Vector3(
          (Math.random() - 0.5) * 6, 
          (Math.random() - 0.5) * 4, 
          (Math.random() - 0.5) * 4
        )
      });
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.points = new THREE.Points(geometry, material);
    this.points.visible = false; // Crucial: start with points invisible
    this.scene.add(this.points);
  }

  addEventListeners() {
    const handleFirstInteraction = () => {
      if (!this.hasInteracted) {
        this.hasInteracted = true;
        this.wakeUpTime = this.clock.getElapsedTime();
        if (this.points) {
          this.points.visible = true; // Make points visible now
        }
        if (this.container) {
          this.container.classList.add('is-active');
        }
      }
    };
    
    window.addEventListener('mousemove', (e) => {
      handleFirstInteraction();
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });
    
    window.addEventListener('scroll', () => {
      handleFirstInteraction();
      const scrollY = window.scrollY;
      const scrollPercent = Math.min(scrollY / (window.innerHeight * 0.7), 1);
      const easeIn = (t: number) => t * t;
      this.scrollForce = easeIn(scrollPercent) * this.params.scrollGravity;
    }, { passive: true });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = this.clock.getDelta();
    
    // The loop runs, but nothing happens until hasInteracted is true
    if (!this.hasInteracted || !this.points) return;

    const positions = this.points.geometry.attributes.position.array as Float32Array;
    const colors = this.points.geometry.attributes.color.array as Float32Array;
    const mouseWorldPos = new THREE.Vector3(this.mouse.x * this.camera.aspect, this.mouse.y, 0).unproject(this.camera);
    const goldColor = new THREE.Color(this.params.accentGold);
    const turquoiseColor = new THREE.Color(this.params.accentTurquoise);

    for (let i = 0; i < this.params.particleCount; i++) {
      const i3 = i * 3;
      const pos = new THREE.Vector3(positions[i3], positions[i3+1], positions[i3+2]);
      const data = this.particleData[i];

      // --- WAKE-UP ANIMATION PHASE ---
      if (elapsedTime < this.wakeUpTime + this.params.wakeUpDuration) {
        const wakeUpProgress = (elapsedTime - this.wakeUpTime) / this.params.wakeUpDuration;
        const easeOut = 1 - Math.pow(1 - wakeUpProgress, 4);
        pos.lerp(data.basePosition, easeOut);
      } else {
        // --- NORMAL INTERACTION LOGIC (runs after wake-up) ---
        const noise = this.noise.noise3D(pos.x * 0.1, pos.y * 0.1, pos.z * 0.1 + elapsedTime * 0.05);
        data.velocity.x += this.params.noiseStrength * Math.sin(noise * Math.PI * 2) * deltaTime;
        data.velocity.y += this.params.noiseStrength * Math.cos(noise * Math.PI * 2) * deltaTime;
        
        const distanceToMouse = pos.distanceTo(mouseWorldPos);
        if (distanceToMouse < this.params.hoverRadius) {
          const repulsion = new THREE.Vector3().subVectors(pos, mouseWorldPos).normalize();
          data.velocity.add(repulsion.multiplyScalar(this.params.repulsionStrength * deltaTime));
        }

        if (this.scrollForce > 0) {
          data.velocity.y -= this.scrollForce;
          const oscillation = Math.sin(pos.y * this.params.oscillationFreq + elapsedTime * 5) * this.mouse.x * this.params.oscillationAmp;
          pos.x += oscillation;
        } else {
           data.velocity.z += (data.basePosition.z - pos.z) * 0.001;
        }
      }

      // --- UPDATE PHYSICS & POSITION ---
      pos.add(data.velocity);
      data.velocity.multiplyScalar(0.94);
      positions[i3] = pos.x;
      positions[i3+1] = pos.y;
      positions[i3+2] = pos.z;
      
      // --- DYNAMIC COLOR LOGIC ---
      const speed = data.velocity.length();
      const baseColor = new THREE.Color().fromArray(colors, i3);
      const finalColor = new THREE.Color();
      if (pos.distanceTo(mouseWorldPos) < this.params.hoverRadius) {
        finalColor.lerpColors(baseColor, goldColor, 0.8);
      } else if (speed > 0.001) {
        const energy = Math.min(speed * 200, 1.0); 
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

  createSporeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; 
    canvas.height = 64;
    const context = canvas.getContext('2d')!;
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  initSimplexNoise() {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0; 
    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;
    const p = new Uint8Array(256); 
    for(let i=0; i<256; i++) p[i] = i; 
    let i = 255; 
    while(i--) { 
      const j = Math.floor((i + 1) * Math.random());
      const k = p[i]; 
      p[i] = p[j]; 
      p[j] = k; 
    }
    const perm = new Uint8Array(512); 
    for(i=0; i<512; i++) { 
      perm[i] = p[i & 255]; 
    }
    this.noise = { 
      noise3D: (x: number, y: number, z: number) => {
        let n0, n1, n2, n3; 
        const s = (x + y + z) * F3; 
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const t = (i + j + k) * G3; 
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t; 
        const x0 = x - X0;
        const y0 = y - Y0;
        const z0 = z - Z0;
        let i1, j1, k1, i2, j2, k2; 
        if(x0>=y0) { 
          if(y0>=z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; } 
          else if(x0>=z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; } 
          else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; } 
        }
        else { 
          if(y0<z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; } 
          else if(x0<z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; } 
          else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; } 
        }
        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3; 
        const x2 = x0 - i2 + 2.0 * G3;
        const y2 = y0 - j2 + 2.0 * G3;
        const z2 = z0 - k2 + 2.0 * G3;
        const x3 = x0 - 1.0 + 3.0 * G3;
        const y3 = y0 - 1.0 + 3.0 * G3;
        const z3 = z0 - 1.0 + 3.0 * G3; 
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        const grad = (p: number, x: number, y: number, z: number) => { 
          const h=p&15; 
          const u=h<8?x:y; 
          const v=h<4?y:h==12||h==14?x:z; 
          return ((h&1)==0?u:-u)+((h&2)==0?v:-v); 
        }
        let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0; 
        if(t0<0) n0 = 0.0; 
        else { t0 *= t0; n0 = t0 * t0 * grad(perm[ii+perm[jj+perm[kk]]], x0, y0, z0); }
        let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1; 
        if(t1<0) n1 = 0.0; 
        else { t1 *= t1; n1 = t1 * t1 * grad(perm[ii+i1+perm[jj+j1+perm[kk+k1]]], x1, y1, z1); }
        let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2; 
        if(t2<0) n2 = 0.0; 
        else { t2 *= t2; n2 = t2 * t2 * grad(perm[ii+i2+perm[jj+j2+perm[kk+k2]]], x2, y2, z2); }
        let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3; 
        if(t3<0) n3 = 0.0; 
        else { t3 *= t3; n3 = t3 * t3 * grad(perm[ii+1+perm[jj+1+perm[kk+1]]], x3, y3, z3); }
        return 32.0 * (n0 + n1 + n2 + n3);
      }
    };
  }

  destroy() {
    if (this.renderer && this.container && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

const GenerativeParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<FinalHeroAnimation | null>(null);

  useEffect(() => {
    const initAnimation = () => {
      if (containerRef.current && !animationRef.current) {
        animationRef.current = new FinalHeroAnimation('hero-animation-container');
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