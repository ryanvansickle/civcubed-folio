import { useEffect, useRef } from "react";
import * as THREE from "three";

class SubtleBodyAnimation {
  private container: HTMLElement | null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private points: THREE.Points | null;
  private mouse: THREE.Vector2;
  private params: {
    particleCount: number;
    baseSpeed: number;
  };

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error("Cosmic background container not found!");
      return;
    }

    // Core Parameters
    this.params = {
      particleCount: 200, // Very sparse
      baseSpeed: 0.05
    };

    // Setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    // State
    this.mouse = new THREE.Vector2(0, 0);
    this.points = null;

    this.initParticles();
    this.addEventListeners();
    this.animate();
  }

  initParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < this.params.particleCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x888888, // A slightly lighter gray to differentiate from hero
      transparent: true,
      opacity: 0.5
    });
    
    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
  }
  
  addEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) - 0.5;
      this.mouse.y = (e.clientY / window.innerHeight) - 0.5;
    });
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate = () => {
    const elapsedTime = Date.now() * 0.0001;
    
    // Gentle rotation of the entire scene for a cosmic feel
    this.scene.rotation.y = elapsedTime * this.params.baseSpeed;
    this.scene.rotation.x = elapsedTime * this.params.baseSpeed * 0.5;

    // Subtle reaction to mouse
    this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.02;
    this.camera.position.y += (-this.mouse.y * 0.5 - this.camera.position.y) * 0.02;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  destroy() {
    if (this.renderer && this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export const CosmicBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<SubtleBodyAnimation | null>(null);

  useEffect(() => {
    const initAnimation = () => {
      if (containerRef.current && !animationRef.current) {
        animationRef.current = new SubtleBodyAnimation('cosmic-background-container');
      }
    };

    const timeoutId = setTimeout(initAnimation, 200); // Slight delay after hero animation

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
      id="cosmic-background-container"
      className="fixed inset-0 w-full h-full"
      style={{ 
        pointerEvents: 'none',
        zIndex: -2, // Even further behind than the hero animation
        overflow: 'hidden'
      }}
    />
  );
};