import { Badge } from "@/components/ui/badge";

export const IntellectualFoundations = () => {
  const foundations = [
    {
      title: "Naropa University",
      location: "Boulder, CO",
      tagline: "The world's first Buddhist-inspired university, where ancient wisdom collides with cutting-edge consciousness research",
      description: "It was here I began the formal work of bridging frontier technology with deep consciousness studies, culminating in my thesis on the \"Integral Singularity.\""
    },
    {
      title: "The Westminster Schools",
      location: "Atlanta, GA",
      tagline: "An elite preparatory academy engineering tomorrow's visionaries through rigorous intellectual combat",
      description: "This rigorous academic environment provided the foundation for my lifelong passion for frontier science and the world-changing ideas that would define my future path."
    }
  ];

  return (
    <section id="foundations" className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="section-tag mb-6 px-4 py-2 text-sm font-medium border-foreground/20">
            Foundations
          </Badge>
          <h2 className="text-5xl md:text-6xl font-normal text-foreground mb-12 leading-tight">
            Intellectual Foundations
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {foundations.map((foundation, index) => (
            <div key={index} className="genesis-card">
              <div className="card-content">
                <div className="card-state card-default-state">
                  <h3 className="card-title">{foundation.title}</h3>
                  <p className="card-role">{foundation.tagline}</p>
                  {foundation.location && (
                    <span className="card-location">{foundation.location}</span>
                  )}
                </div>
                
                <div className="card-state card-hover-state">
                  <p className="card-narrative">{foundation.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};