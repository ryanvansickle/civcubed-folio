import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, TrendingUp, Globe, Brain, Lightbulb } from "lucide-react";

export const Experience = () => {
  const experiences = [
    {
      icon: Brain,
      title: "Author",
      company: "Civilization³",
      period: "",
      description: "Writing Civilization³, a book mapping the transition beyond the Industrial Age into the Intelligence Age. This work informs my consulting frameworks: how products, brands, and growth systems must evolve when the underlying substrate changes.",
      highlights: []
    },
    {
      icon: Building,
      title: "Co-Founder",
      company: "T3MPLO",
      period: "",
      description: "Co-founded a live/work innovation hub for blockchain builders. This real-world experiment revealed how environment design and trust architectures shape deep work and platform success—key insights for modern product and growth strategy.",
      highlights: []
    },
    {
      icon: Users,
      title: "Founding Member & Strategist",
      company: "F4CTORY",
      period: "",
      description: "Built an innovation platform connecting entrepreneurs with Fortune 500s. This experience highlighted the friction between legacy systems and emerging paradigms, informing how I approach product-market fit in new technological contexts.",
      highlights: []
    },
    {
      icon: Lightbulb,
      title: "Advisor",
      company: "Aethos",
      period: "",
      description: "Advised a multidisciplinary creative guild and Web3 incubator focused on culture, community, and identity. Reinforced how brand, culture, and growth systems must evolve together—not independently—in the Intelligence Age.",
      highlights: []
    },
    {
      icon: Globe,
      title: "Advisor",
      company: "Wilder World",
      period: "",
      description: "Supported strategy for a photorealistic, player-owned metaverse. A living lab for digital economies, sovereign identity, and next-gen platform design—all of which shape my approach to product and ecosystem growth.",
      highlights: []
    },
    {
      icon: TrendingUp,
      title: "Executive Producer",
      company: "Ursa Minor",
      period: "",
      description: "Led a digital agency through a market crisis by redesigning its business model around resilience and adaptability. Formed the foundation of my thinking on anti-fragile product design and growth under uncertainty.",
      highlights: []
    },
    {
      icon: Brain,
      title: "Co-Founder, CMO",
      company: "Synchro",
      period: "",
      description: "Helped architect foundational well-being systems, blending lifestyle design with technology. Demonstrated how products and brands can drive long-term retention and emotional resonance.",
      highlights: []
    },
    {
      icon: Lightbulb,
      title: "Co-Founder, CMO / Creative Director",
      company: "Noma",
      period: "",
      description: "Co-founded a venture at the intersection of cognition, culture, and botanical science. An exploration in upgrading the human substrate—insights that now inform my product and brand work.",
      highlights: []
    },
    {
      icon: Users,
      title: "Founder, CEO",
      company: "F2 Media",
      period: "",
      description: "Co-founded one of the earliest venture-backed podcast studios. Pioneered creator ecosystems, niche community building, and decentralized media structures—precursors to today's growth models.",
      highlights: []
    },
    {
      icon: Brain,
      title: "Researcher",
      company: "Qiterra Press",
      period: "",
      description: "Conducted early research into decentralized monetary systems before Bitcoin. A foundational exploration into how economic substrates shift, informing how modern platforms and products must evolve.",
      highlights: []
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