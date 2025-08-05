import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const IntellectualFoundations = () => {
  const foundations = [
    {
      title: "Naropa University",
      description: "It was here I began the formal work of bridging frontier technology with deep consciousness studies, culminating in my thesis on the \"Integral Singularity.\""
    },
    {
      title: "The Westminster Schools",
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
            <Card key={index} className="interactive-card bg-card border-border/20 shadow-soft p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-normal text-foreground">
                  {foundation.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-foreground/80">
                  {foundation.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};