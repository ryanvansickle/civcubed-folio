import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const TimelineExploration = () => {
  const currentWork = {
    title: "Current Work: Civilization³",
    tagline: "A Framework for Next Era of Human Civilization",
    description: "I am currently authoring a book on the next epoch of human civilization, catalyzed by the convergence of Artificial General Intelligence, synthetic biology, and decentralized systems."
  };

  const pastVentures = [
    {
      title: "Aethos",
      role: "Advisor"
    },
    {
      title: "Telos",
      role: "Co-Founder",
      tagline: "The Nexus for Builders of the Decentralized Future."
    },
    {
      title: "Wilder World",
      role: "Advisor"
    },
    {
      title: "F4CTORY",
      role: "Founding Member & Strategist",
      tagline: "The Olympic Training Ground for Innovation."
    },
    {
      title: "Synchro",
      role: "Co-Founder, CMO",
      link: "https://www.besynchro.com"
    },
    {
      title: "Noma",
      role: "Co-Founder, CMO",
      link: "https://www.nomalife.com"
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
          <Card className="interactive-card group bg-white border-border/20 shadow-soft p-8">
            <CardHeader className="pb-6">
              {/* Civilization 3 Animated Video Logo */}
              <div className="video-logo-container mb-6 flex justify-center">
                <video
                  src="/civ3-video.mp4"
                  poster="/civ3-poster.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="Civilization 3 Animated Logo"
                />
              </div>
              <div className="text-center">
                <CardTitle className="text-3xl font-normal text-foreground mb-2">
                  {currentWork.title}
                </CardTitle>
                <CardDescription className="text-lg text-foreground/70 italic">
                  {currentWork.tagline}
                </CardDescription>
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
            Genesis
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {pastVentures.map((venture, index) => {
              const CardWrapper = venture.link ? 'a' : 'div';
              const cardProps = venture.link ? { 
                href: venture.link, 
                target: "_blank", 
                rel: "noopener noreferrer",
                className: "block"
              } : {};
              
              return (
                <CardWrapper key={index} {...cardProps}>
                  <Card className="interactive-card bg-white border-border/20 shadow-soft p-6 h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-normal text-foreground">
                        {venture.title}
                        {venture.role && (
                          <span className="text-base text-foreground/60 font-light ml-2">
                            ({venture.role})
                          </span>
                        )}
                      </CardTitle>
                      {venture.tagline && (
                        <CardDescription className="text-foreground/70 italic">
                          {venture.tagline}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </CardWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};