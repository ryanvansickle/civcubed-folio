import { Badge } from "@/components/ui/badge";

export const NewSubstrate = () => {
  return (
    <section id="about" className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium border-foreground/20">
            A New Substrate
          </Badge>
          <h2 className="text-5xl md:text-6xl font-normal text-foreground mb-12 leading-tight">
            A New Substrate
          </h2>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed text-foreground/80 mb-8">
            Fifteen thousand years ago, we planted seeds—birthing Civilization¹, the Agrarian Age. Three centuries ago, we burned coal—igniting Civilization², the Industrial Age. Today, the learning machine is the new steam engine. Software writes itself. Biology compiles like code. The old order is not being tweaked; a new one is being written on a new substrate.
          </p>
          
          <p className="text-xl leading-relaxed text-foreground/80">
            My work has always been to explore this emergent reality by focusing on the complex systems—of capital, of culture, of code—that shape our future.
          </p>
        </div>
      </div>
    </section>
  );
};