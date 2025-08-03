import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, TrendingUp, Globe, Brain, Lightbulb } from "lucide-react";

export const Experience = () => {
  const experiences = [
    {
      icon: Brain,
      title: "Senior Strategic Futurist",
      company: "Global Innovation Institute",
      period: "2021 - Present",
      description: "Lead research initiatives exploring the intersection of technology, society, and consciousness. Developed frameworks for understanding systemic transformation and civilizational evolution.",
      highlights: ["Led 15+ strategic foresight projects", "Published 30+ research papers", "Advised Fortune 500 companies"]
    },
    {
      icon: TrendingUp,
      title: "Director of Future Systems",
      company: "Convergence Labs",
      period: "2019 - 2021",
      description: "Directed interdisciplinary teams in analyzing emerging technologies and their societal implications. Specialized in AI governance, social innovation, and systems thinking.",
      highlights: ["Built cross-functional research team", "Launched emerging tech assessment program", "Spoke at 25+ conferences"]
    },
    {
      icon: Globe,
      title: "Principal Consultant",
      company: "Future Horizons Consulting",
      period: "2017 - 2019",
      description: "Provided strategic guidance to organizations navigating technological disruption. Focused on helping leaders understand and prepare for systemic change.",
      highlights: ["Consulted for 50+ organizations", "Developed proprietary forecasting models", "Created executive education programs"]
    },
    {
      icon: Lightbulb,
      title: "Innovation Strategist",
      company: "Tech Evolution Partners",
      period: "2015 - 2017",
      description: "Analyzed technology trends and their potential impact on business and society. Specialized in identifying early signals of transformative change.",
      highlights: ["Identified 10+ breakthrough technologies", "Built innovation assessment framework", "Mentored startup founders"]
    }
  ];

  const achievements = [
    { label: "Research Papers", value: "75+" },
    { label: "Speaking Engagements", value: "100+" },
    { label: "Organizations Advised", value: "200+" },
    { label: "Years of Experience", value: "10+" }
  ];

  return (
    <section id="experience" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Professional Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Experience & Expertise
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A decade of exploring the future through research, strategy, and thought leadership 
              across technology, innovation, and systemic transformation.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {achievement.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {achievement.label}
                </div>
              </Card>
            ))}
          </div>

          {/* Experience Timeline */}
          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <Card 
                  key={index} 
                  className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-elegant"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Icon and Meta */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="lg:hidden">
                          <h3 className="text-xl font-bold text-card-foreground">{exp.title}</h3>
                          <p className="text-muted-foreground font-medium">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">{exp.period}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="hidden lg:block mb-4">
                        <h3 className="text-xl font-bold text-card-foreground mb-1">{exp.title}</h3>
                        <p className="text-muted-foreground font-medium">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.period}</p>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {exp.highlights.map((highlight, highlightIndex) => (
                          <Badge 
                            key={highlightIndex} 
                            variant="outline" 
                            className="text-xs bg-accent/50 border-accent-foreground/20"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Skills & Expertise */}
          <Card className="mt-12 p-8 bg-accent/30 border-accent-foreground/20 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Core Expertise</h3>
              <p className="text-muted-foreground">
                Areas of deep knowledge and practical application
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                "Strategic Foresight",
                "Systems Thinking", 
                "Technology Assessment",
                "Innovation Strategy",
                "Consciousness Research",
                "Social Evolution",
                "AI Governance",
                "Future Studies",
                "Complex Systems",
                "Transformation Strategy",
                "Thought Leadership",
                "Executive Advisory"
              ].map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-center justify-center py-2 bg-background/50 border-border/50"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};