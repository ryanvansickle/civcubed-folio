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
            <a href="/" className="logo-shimmer flex items-center space-x-3 group">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                aria-label="Ryan Van Sickle Logo"
                className="text-foreground group-hover:text-accent-turquoise transition-colors duration-300"
              >
                <path d="M0 0 L50 100 L100 0 L78 0 L50 56 L22 0 L0 0Z" fill="currentColor"/>
              </svg>
              <h1 className="text-lg font-medium text-foreground tracking-wide group-hover:text-accent-turquoise transition-colors duration-300">
                RyanV.xyz
              </h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <a href="#about" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium tracking-wide">
              About
            </a>
            <a href="#work" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium tracking-wide">
              Experience
            </a>
            <a href="#foundations" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium tracking-wide">
              Foundations
            </a>
            <a href="#contact" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium tracking-wide">
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
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
              <a 
                href="#work" 
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                Experience
              </a>
              <a 
                href="#foundations" 
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                Foundations
              </a>
              <a 
                href="#contact" 
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium tracking-wide"
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