import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-lg font-light text-foreground tracking-wide">
              RyanV.xyz
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <a href="#about" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-light tracking-wide">
              About
            </a>
            <a href="#research" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-light tracking-wide">
              Research
            </a>
            <a href="#experience" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-light tracking-wide">
              Experience
            </a>
            <a href="#contact" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-light tracking-wide">
              Contact
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:bg-transparent"
            >
              {isOpen ? <X size={20} strokeWidth={1} /> : <Menu size={20} strokeWidth={1} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-8 border-t border-border/20">
            <div className="flex flex-col space-y-6">
              <a 
                href="#about" 
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-light tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
              <a 
                href="#research" 
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-light tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                Research
              </a>
              <a 
                href="#experience" 
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-light tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                Experience
              </a>
              <a 
                href="#contact" 
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-light tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};