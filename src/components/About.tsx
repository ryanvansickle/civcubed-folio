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
              About
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6">
              Background
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A researcher and emerging author focused on the intersection of technology, 
              society, and human potential.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Bio */}
            <div className="space-y-6">
              <div className="prose prose-lg text-muted-foreground">
                <p className="mb-6">
                  Focused on understanding how emerging technologies reshape social structures 
                  and human relationships, with particular interest in long-term societal implications.
                </p>
                <p className="mb-6">
                  Currently researching the convergence of technological advancement and social evolution, 
                  exploring how these forces might influence humanity's future development.
                </p>
                <p>
                  Engaged in writing and research projects that examine complex systems 
                  and their potential impacts on civilization.
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
          <Card className="p-8 md:p-12 bg-accent/20 border-accent-foreground/10 backdrop-blur-sm">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-6">
                Core Philosophy
              </h3>
              <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto font-light">
                "Understanding the trajectory of technological and social change requires 
                both rigorous analysis and long-term thinking. The patterns we identify today 
                will shape the possibilities of tomorrow."
              </blockquote>
              <cite className="block mt-6 text-foreground font-medium">— Ryan Van Sickle</cite>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};