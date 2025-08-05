import { Badge } from "@/components/ui/badge";

export const NewSubstrate = () => {
  return (
    <section id="new-substrate" className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="section-tag mb-6 px-4 py-2 text-sm font-medium border-foreground/20">
            About
          </Badge>
          <h2 className="text-5xl md:text-6xl font-normal text-foreground mb-12 leading-tight">
            A New Substrate
          </h2>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-xl leading-relaxed text-foreground/80">
            Fifteen thousand years ago, we planted seeds—birthing Civilization¹, the Agrarian Age. Three centuries ago, we burned coal—igniting Civilization², the Industrial Age. Today, the learning machine is the new steam engine. Software writes itself. Biology compiles like code. The old order is not being tweaked; a new one is being written on a new substrate.
          </p>
          
          <p className="text-xl leading-relaxed text-foreground/80">
            This is the focus of my life's work and forthcoming book, Civilization³. After a career spent founding companies, advising startups, and building innovation platforms, I am currently on sabbatical, synthesizing these experiences into a framework for navigating our world in the aftermath of AGI.
          </p>
          
          <p className="text-xl leading-relaxed text-foreground/80">
            My path has always tracked the co-evolution of technology and consciousness—from a university thesis on the "Integral Singularity" and early research on decentralized currencies (pre-Bitcoin), to founding ventures at the dawn of new industries like podcasting and Web3. The throughline has been a focus on complex systems and the architectures—of capital, of culture, of code—that shape our future.
          </p>
          
          <p className="text-xl leading-relaxed text-foreground/80">
            While my primary focus is the book, I continue to engage in a small number of advisory roles, helping leaders and organizations navigate profound technological shifts. I am always open to connecting with fellow builders and thinkers operating at the edge.
          </p>
        </div>
      </div>
    </section>
  );
};