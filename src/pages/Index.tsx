import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { NewSubstrate } from "@/components/NewSubstrate";
import { Genesis } from "@/components/Genesis";
import { IntellectualFoundations } from "@/components/IntellectualFoundations";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <NewSubstrate />
      <Genesis />
      <IntellectualFoundations />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
