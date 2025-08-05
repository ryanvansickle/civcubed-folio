import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

export const Hero = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      try {
        console.log("--- Starting Final Diagnostic Script ---");

        // Wait for the entire page, including all platform assets, to be fully loaded.
        window.addEventListener('load', () => {
          console.log("Window 'load' event fired. Looking for #debug-target...");
          const targetDiv = document.getElementById('debug-target');

          if (targetDiv) {
            console.log("SUCCESS: Found #debug-target.");
            targetDiv.style.width = '100px';
            targetDiv.style.height = '100px';
            targetDiv.style.position = 'fixed'; // Fixed position to ensure visibility
            targetDiv.style.top = '20px';
            targetDiv.style.left = '20px';
            targetDiv.style.zIndex = '99999';
            targetDiv.style.backgroundColor = 'limegreen';
            targetDiv.style.color = 'white';
            targetDiv.style.textAlign = 'center';
            targetDiv.style.lineHeight = '100px';
            targetDiv.style.fontFamily = 'monospace';
            targetDiv.innerText = 'OK';
            console.log("SUCCESS: Changed div color to lime green.");
          } else {
            console.error("DIAGNOSTIC FAILURE: Script ran, but could not find #debug-target in the DOM.");
            alert("Animation Debug: Could not find target div.");
          }
        });
      } catch (error) {
        console.error("FATAL SCRIPT ERROR:", error);
        alert("Animation Debug: A fatal JavaScript error occurred: " + error.message);
      }
    `;
    document.head.appendChild(script);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Debug Target */}
      <div id="debug-target"></div>

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