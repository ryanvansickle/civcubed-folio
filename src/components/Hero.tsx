import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const DiagnosticTest = () => {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.innerHTML = `
  try {
    console.log("--- Starting Diagnostic Test ---");

    // 1. Check if three.js is loaded
    if (typeof THREE === 'undefined') {
      throw new Error("Three.js library failed to load.");
    }
    console.log("Three.js loaded successfully. Version:", THREE.REVISION);

    // 2. Setup basic scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const container = document.getElementById('test-container');
    if (!container) {
        throw new Error("Diagnostic container div not found in the DOM.");
    }
    container.appendChild(renderer.domElement);
    console.log("Renderer and canvas appended to container.");

    // 3. Create a very simple, visible object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // A bright red color
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    console.log("Red cube created and added to scene.");

    camera.position.z = 5;

    // 4. Create a simple animation loop
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();
    console.log("--- Diagnostic Test Initialized Successfully ---");

  } catch (error) {
    console.error("--- DIAGNOSTIC TEST FAILED ---");
    console.error(error);
    // Also display the error on the page itself for easier debugging
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.padding = '10px';
    errorDiv.style.background = 'rgba(255, 0, 0, 0.8)';
    errorDiv.style.color = 'white';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.zIndex = '9999';
    errorDiv.innerText = "Animation Error: " + error.message;
    document.body.appendChild(errorDiv);
  }
      `;
      document.head.appendChild(script2);
    };
    document.head.appendChild(script1);

    return () => {
      const scripts = document.querySelectorAll('script[src*="three.js"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <div 
      id="test-container" 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1 
      }} 
    />
  );
};

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Advanced Three.js Generative Animation */}
      <DiagnosticTest />

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