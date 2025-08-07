import { Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6 bg-background scroll-mt-24">
      <div className="container mx-auto max-w-4xl text-center">
        <p className="text-2xl font-normal text-foreground mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Continue the conversation.
        </p>
        
        <div className="flex justify-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 rounded-full border border-border/30 hover:bg-muted/30 transition-colors"
            asChild
          >
            <a href="https://www.linkedin.com/in/ryan-van-sickle-/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 rounded-full border border-border/30 hover:bg-muted/30 transition-colors"
            asChild
          >
            <a href="https://x.com/Ryan_Van_Sickle" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};