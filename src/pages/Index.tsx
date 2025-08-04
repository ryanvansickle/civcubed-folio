import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { NewSubstrate } from "@/components/NewSubstrate";
import { TimelineExploration } from "@/components/TimelineExploration";
import { IntellectualFoundations } from "@/components/IntellectualFoundations";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ConstellationField } from "@/components/ConstellationField";
import { CosmicBackground } from "@/components/CosmicBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <CosmicBackground />
      <ConstellationField />
      <Navigation />
      <Hero />
      <NewSubstrate />
      <TimelineExploration />
      <IntellectualFoundations />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
