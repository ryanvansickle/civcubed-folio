import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const TimelineExploration = () => {
  const currentWork = {
    title: "Current Work: Civilization³",
    tagline: "A Framework for the Next Human Operating System.",
    description: "I am currently authoring a book on the next epoch of human civilization, catalyzed by the convergence of Artificial General Intelligence, synthetic biology, and decentralized systems."
  };

  const pastVentures = [
    {
      title: "Strategic Advisor",
      period: "2019 – Present",
      description: "Advising a select group of founders and investors on navigating disruptive change and architecting strategy for novel technology ventures."
    },
    {
      title: "Telos",
      role: "Co-Founder",
      tagline: "The Nexus for Builders of the Decentralized Future."
    },
    {
      title: "FACTORY",
      role: "Founding Member & Strategist",
      tagline: "The Olympic Training Ground for Innovation."
    },
    {
      title: "Executive Office",
      role: "Strategist",
      tagline: "Asymmetric Insight. Sovereign Scale."
    },
    {
      title: "Ursa Minor",
      role: "COO",
      tagline: "Digital Craft for Purpose-Driven Impact."
    },
    {
      title: "F2 Media",
      role: "Co-Founder & CEO",
      tagline: "Pioneering the Narratives of a New Generation."
    },
    {
      title: "Qiterra Press",
      role: "Researcher",
      tagline: "Researching the Economic Blueprints for a New World."
    }
  ];

  return (
    <section id="work" className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="section-tag mb-6 px-4 py-2 text-sm font-medium border-foreground/20">
            Experience
          </Badge>
          <h2 className="text-5xl md:text-6xl font-normal text-foreground mb-12 leading-tight">
            A Timeline of Exploration
          </h2>
        </div>

        {/* Featured Current Work */}
        <div className="mb-16">
          <Card className="interactive-card group bg-card border-border/20 shadow-soft p-8">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-6 mb-4">
                {/* Civilization 3 Logo (Corrected Version) */}
                <svg id="civ3-logo" width="100" height="116" viewBox="0 0 100 115.5" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <g className="logo-blocks">
                    {/* Outer Frame */}
                    <polygon points="25,14.4 50,0 75,14.4 75,43.8 87.5,36.3 87.5,21.3 100,28.8 100,86.3 87.5,93.8 87.5,101.3 75,108.8 75,101.3 50,115.5 25,101.3 25,108.8 12.5,101.3 12.5,93.8 0,86.3 0,28.8 12.5,21.3 12.5,36.3 25,43.8"/>
                    {/* Inner Cross */}
                    <polygon points="37.5,43.8 25,51.3 37.5,58.8 50,51.3"/>
                    <polygon points="50,51.3 62.5,58.8 75,51.3 62.5,43.8"/>
                    <polygon points="37.5,58.8 25,66.3 37.5,73.8 50,66.3"/>
                    <polygon points="50,66.3 62.5,73.8 75,66.3 62.5,58.8"/>
                    {/* Center Diamond */}
                    <polygon points="50,58.8 37.5,66.3 50,73.8 62.5,66.3"/>
                  </g>
                </svg>
                <div>
                  <CardTitle className="text-3xl font-normal text-foreground mb-2">
                    {currentWork.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-foreground/70 italic">
                    {currentWork.tagline}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-foreground/80">
                {currentWork.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Past Ventures */}
        <div className="space-y-8">
          <h3 className="text-2xl font-normal text-foreground mb-8 text-center">
            Past Ventures
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {pastVentures.map((venture, index) => (
              <Card key={index} className="interactive-card bg-card border-border/20 shadow-soft p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-normal text-foreground">
                    {venture.title}
                    {venture.role && (
                      <span className="text-base text-foreground/60 font-light ml-2">
                        ({venture.role})
                      </span>
                    )}
                    {venture.period && (
                      <span className="text-base text-foreground/60 font-light ml-2">
                        {venture.period}
                      </span>
                    )}
                  </CardTitle>
                  {venture.tagline && (
                    <CardDescription className="text-foreground/70 italic">
                      {venture.tagline}
                    </CardDescription>
                  )}
                </CardHeader>
                {venture.description && (
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed">
                      {venture.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};