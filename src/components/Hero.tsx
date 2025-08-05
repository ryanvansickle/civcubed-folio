import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

class GenerativeHeroAnimation {
  private container: HTMLElement | null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.InstancedMesh | null;
  private glowParticles: THREE.Points | null;
  private connections: THREE.LineSegments | null;
  private particleData: Array<{
    velocity: THREE.Vector3;
    basePosition: THREE.Vector3;
    sizeVariation: number;
    hueShift: number;
    neighbors: number[];
    energy: number;
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
    connectionDistance: number;
    maxConnections: number;
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
      spawnChance: 0.05, // 5% chance per frame on hover
      scrollGravity: 0.03,
      oscillationFreq: 8.0,
      oscillationAmp: 0.05,
      connectionDistance: 0.15,
      maxConnections: 5
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
    this.glowParticles = null;
    this.connections = null;
    this.particleData = [];

    this.initParticles();
    this.initGlowParticles();
    this.initConnections();
    this.addEventListeners();
    this.animate();
  }

  createBiologicalTexture() {
    const canvas = document.createElement('canvas');
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Create organic texture with noise and variation
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const centerX = size / 2;
        const centerY = size / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        
        // Add noise for biological irregularity
        const noise = Math.random() * 0.3;
        const opacity = Math.max(0, (1 - distance / (size / 2)) + noise);
        
        // Organic color variation
        const hue = Math.random() * 20 + 30; // Warm organic tones
        ctx.fillStyle = `hsla(${hue}, 60%, 80%, ${opacity * 0.7})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  initParticles() {
    // Create irregular biological shapes
    const geometries: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.IcosahedronGeometry(0.002 + Math.random() * 0.003, 1);
      const positions = geo.attributes.position.array as Float32Array;
      
      // Deform vertices for biological irregularity
      for (let j = 0; j < positions.length; j += 3) {
        const noise = (Math.random() - 0.5) * 0.3;
        positions[j] *= (1 + noise);
        positions[j + 1] *= (1 + noise);
        positions[j + 2] *= (1 + noise);
      }
      
      geo.attributes.position.needsUpdate = true;
      geometries.push(geo);
    }

    // Use different materials for variety
    const materials = [
      new THREE.MeshBasicMaterial({ 
        color: 0x2a2a2a,
        transparent: true,
        opacity: 0.8
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x1a4a4a, // Dark turquoise base
        transparent: true,
        opacity: 0.7
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x4a3a1a, // Dark gold base
        transparent: true,
        opacity: 0.6
      })
    ];

    this.particles = new THREE.InstancedMesh(
      geometries[0], 
      materials[0], 
      this.params.particleCount
    );
    
    for (let i = 0; i < this.params.particleCount; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      );
      
      // Add random scale variation for biological diversity
      const scale = 0.5 + Math.random() * 1.5;
      this.dummy.position.copy(position);
      this.dummy.scale.setScalar(scale);
      this.dummy.updateMatrix();
      this.particles.setMatrixAt(i, this.dummy.matrix);

      this.particleData.push({
        velocity: new THREE.Vector3(),
        basePosition: position.clone(),
        sizeVariation: Math.random() * 0.5 + 0.75,
        hueShift: Math.random() * 60, // Color variation
        neighbors: [],
        energy: 0
      });
    }
    
    this.scene.add(this.particles);
  }

  initGlowParticles() {
    const positions = new Float32Array(this.params.particleCount * 3);
    const colors = new Float32Array(this.params.particleCount * 3);
    const sizes = new Float32Array(this.params.particleCount);

    for (let i = 0; i < this.params.particleCount; i++) {
      // Use same positions as main particles
      const data = this.particleData[i];
      positions[i * 3] = data.basePosition.x;
      positions[i * 3 + 1] = data.basePosition.y;
      positions[i * 3 + 2] = data.basePosition.z;
      
      // Turquoise and gold glow colors
      const isGold = Math.random() > 0.7;
      if (isGold) {
        colors[i * 3] = 1.0; // R
        colors[i * 3 + 1] = 0.84; // G  
        colors[i * 3 + 2] = 0.0; // B
      } else {
        colors[i * 3] = 0.0; // R
        colors[i * 3 + 1] = 0.8; // G
        colors[i * 3 + 2] = 0.8; // B
      }
      
      sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        texture: { value: this.createBiologicalTexture() }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          vAlpha = 0.3;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D texture;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec2 uv = gl_PointCoord;
          float dist = distance(uv, vec2(0.5));
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          gl_FragColor = vec4(vColor * glow, vAlpha * glow);
        }
      `,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });

    this.glowParticles = new THREE.Points(geometry, material);
    this.scene.add(this.glowParticles);
  }

  initConnections() {
    // Calculate neighbors for each particle
    for (let i = 0; i < this.params.particleCount; i++) {
      const data = this.particleData[i];
      const neighbors: number[] = [];
      
      for (let j = 0; j < this.params.particleCount; j++) {
        if (i === j) continue;
        
        const distance = data.basePosition.distanceTo(this.particleData[j].basePosition);
        if (distance < this.params.connectionDistance && neighbors.length < this.params.maxConnections) {
          neighbors.push(j);
        }
      }
      
      data.neighbors = neighbors;
    }

    // Create line geometry for connections
    const maxConnections = this.params.particleCount * this.params.maxConnections;
    const positions = new Float32Array(maxConnections * 6); // 2 points per line
    const colors = new Float32Array(maxConnections * 6); // 2 colors per line
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });
    
    this.connections = new THREE.LineSegments(geometry, material);
    this.scene.add(this.connections);
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

    if (!this.particles || !this.glowParticles || !this.connections) return;

    const mouseWorldPos = new THREE.Vector3(this.mouse.x * this.camera.aspect, this.mouse.y, 0).unproject(this.camera);
    
    // Update connections
    const connectionPositions = this.connections.geometry.attributes.position.array as Float32Array;
    const connectionColors = this.connections.geometry.attributes.color.array as Float32Array;
    let connectionIndex = 0;

    for (let i = 0; i < this.params.particleCount; i++) {
      this.particles.getMatrixAt(i, this.dummy.matrix);
      const currentPos = new THREE.Vector3().setFromMatrixPosition(this.dummy.matrix);
      const data = this.particleData[i];

      // Calculate energy based on velocity for psychedelic effects
      data.energy = data.velocity.length() * 10;

      // Biological size variation over time
      const breathing = Math.sin(elapsedTime * 2 + i * 0.1) * 0.1 + 1;
      const biologicalScale = data.sizeVariation * breathing;

      // Hover: Acceleration & Multiplication
      const distanceToMouse = currentPos.distanceTo(mouseWorldPos);
      if (distanceToMouse < this.params.hoverRadius) {
        const repulsionForce = new THREE.Vector3().subVectors(currentPos, mouseWorldPos).normalize();
        data.velocity.add(repulsionForce.multiplyScalar(this.params.repulsionStrength * deltaTime));
        data.energy += 2; // Boost energy on interaction
        
        if (Math.random() < this.params.spawnChance) {
          // "Multiplication": re-use a distant particle to simulate spawning
          const randomIndex = Math.floor(Math.random() * this.params.particleCount);
          this.dummy.position.copy(currentPos);
          this.dummy.scale.setScalar(biologicalScale);
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

      // Psychedelic hue shifting
      const hueShift = Math.sin(elapsedTime * 0.5 + data.hueShift) * 10;

      // Update Physics
      currentPos.add(data.velocity);
      data.velocity.multiplyScalar(0.96); // Damping

      // Apply biological scale variation
      this.dummy.position.copy(currentPos);
      this.dummy.scale.setScalar(biologicalScale);
      this.dummy.updateMatrix();
      this.particles.setMatrixAt(i, this.dummy.matrix);

      // Update connections for this particle
      for (const neighborIndex of data.neighbors) {
        if (connectionIndex < connectionPositions.length - 5) {
          this.particles.getMatrixAt(neighborIndex, this.dummy.matrix);
          const neighborPos = new THREE.Vector3().setFromMatrixPosition(this.dummy.matrix);
          
          // Line from current to neighbor
          connectionPositions[connectionIndex] = currentPos.x;
          connectionPositions[connectionIndex + 1] = currentPos.y;
          connectionPositions[connectionIndex + 2] = currentPos.z;
          connectionPositions[connectionIndex + 3] = neighborPos.x;
          connectionPositions[connectionIndex + 4] = neighborPos.y;
          connectionPositions[connectionIndex + 5] = neighborPos.z;
          
          // Dynamic connection colors based on energy
          const avgEnergy = (data.energy + this.particleData[neighborIndex].energy) / 2;
          const isActive = avgEnergy > 0.5;
          
          if (isActive) {
            // Gold for active connections
            connectionColors[connectionIndex] = 1.0;
            connectionColors[connectionIndex + 1] = 0.84;
            connectionColors[connectionIndex + 2] = 0.0;
            connectionColors[connectionIndex + 3] = 1.0;
            connectionColors[connectionIndex + 4] = 0.84;
            connectionColors[connectionIndex + 5] = 0.0;
          } else {
            // Turquoise for resting connections
            connectionColors[connectionIndex] = 0.0;
            connectionColors[connectionIndex + 1] = 0.8;
            connectionColors[connectionIndex + 2] = 0.8;
            connectionColors[connectionIndex + 3] = 0.0;
            connectionColors[connectionIndex + 4] = 0.8;
            connectionColors[connectionIndex + 5] = 0.8;
          }
          
          connectionIndex += 6;
        }
      }
    }

    // Update glow particles to follow main particles
    const glowPositions = this.glowParticles.geometry.attributes.position.array as Float32Array;
    const glowColors = this.glowParticles.geometry.attributes.color.array as Float32Array;
    
    for (let i = 0; i < this.params.particleCount; i++) {
      this.particles.getMatrixAt(i, this.dummy.matrix);
      const pos = new THREE.Vector3().setFromMatrixPosition(this.dummy.matrix);
      const data = this.particleData[i];
      
      // Update glow positions
      glowPositions[i * 3] = pos.x;
      glowPositions[i * 3 + 1] = pos.y;
      glowPositions[i * 3 + 2] = pos.z;
      
      // Dynamic glow intensity based on energy and hue shift
      const intensity = Math.min(1, data.energy * 0.5 + 0.3);
      const hueShift = Math.sin(elapsedTime * 0.5 + data.hueShift) * 0.2;
      
      // Alternate between turquoise and gold based on energy
      if (data.energy > 1) {
        glowColors[i * 3] = intensity; // R (gold)
        glowColors[i * 3 + 1] = intensity * 0.84; // G
        glowColors[i * 3 + 2] = hueShift; // B
      } else {
        glowColors[i * 3] = hueShift; // R
        glowColors[i * 3 + 1] = intensity * 0.8; // G (turquoise)
        glowColors[i * 3 + 2] = intensity * 0.8; // B
      }
    }

    // Update all geometry
    this.particles.instanceMatrix.needsUpdate = true;
    this.glowParticles.geometry.attributes.position.needsUpdate = true;
    this.glowParticles.geometry.attributes.color.needsUpdate = true;
    this.connections.geometry.attributes.position.needsUpdate = true;
    this.connections.geometry.attributes.color.needsUpdate = true;
    
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