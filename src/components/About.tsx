import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, Target, TrendingUp } from "lucide-react";

export const About = () => {
  const expertise = [
    {
      icon: Brain,
      title: "Future Thinking",
      description: "Analyzing emerging trends and their potential impact on society"
    },
    {
      icon: TrendingUp,
      title: "Strategic Innovation",
      description: "Helping organizations navigate complex technological transitions"
    },
    {
      icon: Target,
      title: "Systems Design",
      description: "Creating frameworks for understanding complex adaptive systems"
    },
    {
      icon: Lightbulb,
      title: "Thought Leadership",
      description: "Sharing insights on the future of human civilization"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              About the Author
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Envisioning Tomorrow's World
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ryan Van Sickle is a futurist and strategic thinker dedicated to understanding 
              and shaping the next phase of human civilization through technology, innovation, and conscious design.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Bio */}
            <div className="space-y-6">
              <div className="prose prose-lg text-muted-foreground">
                <p className="mb-6">
                  With a deep fascination for the intersection of technology and human potential, 
                  Ryan explores how emerging technologies, social structures, and consciousness evolution 
                  will shape our collective future.
                </p>
                <p className="mb-6">
                  His work focuses on identifying the patterns and systems that will define 
                  "Civilization³" — the next evolutionary leap in how we organize society, 
                  leverage technology, and expand human capability.
                </p>
                <p>
                  Through research, writing, and strategic consulting, Ryan helps individuals 
                  and organizations prepare for and actively participate in shaping this transformation.
                </p>
              </div>
            </div>

            {/* Right Column - Expertise Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {expertise.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={index} 
                    className="p-6 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-start space-y-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-card-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Philosophy Section */}
          <Card className="p-8 md:p-12 bg-accent/30 border-accent-foreground/20 backdrop-blur-sm">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Core Philosophy
              </h3>
              <blockquote className="text-lg md:text-xl text-muted-foreground italic leading-relaxed max-w-4xl mx-auto">
                "We stand at the threshold of Civilization³ — a new era where technology, 
                consciousness, and social evolution converge to create unprecedented opportunities 
                for human flourishing. Our challenge is not just to adapt to this future, 
                but to consciously design it."
              </blockquote>
              <cite className="block mt-6 text-foreground font-medium">— Ryan Van Sickle</cite>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};