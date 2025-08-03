import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Minimal geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-primary rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-primary rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
      </div>

      {/* Minimal floating elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary/40 rounded-full animate-float opacity-60" />
      <div className="absolute bottom-32 right-32 w-3 h-3 bg-primary/30 rounded-full animate-pulse-soft opacity-40" />
      <div className="absolute top-1/2 right-20 w-1 h-1 bg-primary/50 rounded-full animate-float opacity-80" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 mb-8 animate-scale-in shadow-subtle">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-foreground text-sm font-medium">Now Available</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-serif font-semibold text-foreground mb-6 tracking-tight animate-slide-up">
            Civilization³
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-foreground/80 mb-4 max-w-3xl mx-auto leading-relaxed animate-slide-up font-light" style={{ animationDelay: '0.2s' }}>
            Exploring the Next Evolution of Human Society
          </p>

          {/* Author */}
          <p className="text-lg text-muted-foreground mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            by Ryan Van Sickle
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-elegant">
              Get the Book
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Minimal scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-5 h-8 border border-foreground/30 rounded-full flex justify-center">
          <div className="w-0.5 h-2 bg-foreground/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};