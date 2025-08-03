import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, Globe, Zap } from "lucide-react";
import bookCover from "@/assets/book-cover.jpg";

export const Book = () => {
  const themes = [
    {
      icon: Globe,
      title: "Global Systems",
      description: "How interconnected systems shape our collective future"
    },
    {
      icon: Zap,
      title: "Technology Integration",
      description: "The seamless merger of human and artificial intelligence"
    },
    {
      icon: Users,
      title: "Social Evolution",
      description: "New forms of governance, collaboration, and community"
    },
    {
      icon: Star,
      title: "Consciousness Expansion",
      description: "The role of awareness in civilizational advancement"
    }
  ];

  return (
    <section id="book" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Current Project
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Civilization³
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Currently working on a book exploring humanity's technological and social evolution, 
              examining the forces shaping our collective future.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Book Cover */}
            <div className="relative">
              <div className="relative group">
                <img 
                  src={bookCover} 
                  alt="Civilization³ Book Cover" 
                  className="w-full max-w-md mx-auto rounded-2xl shadow-elegant group-hover:shadow-glow transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl" />
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-accent px-4 py-2 rounded-full border border-accent-foreground/20 backdrop-blur-sm animate-float">
                <span className="text-sm font-medium text-accent-foreground">In Progress</span>
              </div>
            </div>

            {/* Right Column - Book Details */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Research in Progress
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  An ongoing research project examining how technological advancement 
                  and social evolution intersect to shape humanity's future trajectory.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The work explores patterns of change across multiple domains to understand 
                  how current trends might influence long-term civilizational development.
                </p>
              </div>

              {/* Key Themes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {themes.map((theme, index) => {
                  const Icon = theme.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{theme.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group">
                  Learn More
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
                <Button variant="outline" size="lg">
                  Research Updates
                </Button>
              </div>
            </div>
          </div>

          {/* Testimonials/Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">Comprehensive Research</h4>
              <p className="text-sm text-muted-foreground">
                Drawing from cutting-edge research across multiple disciplines
              </p>
            </Card>

            <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">Actionable Insights</h4>
              <p className="text-sm text-muted-foreground">
                Practical frameworks for navigating the future
              </p>
            </Card>

            <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Star className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">Visionary Thinking</h4>
              <p className="text-sm text-muted-foreground">
                Bold ideas for humanity's next evolutionary leap
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};