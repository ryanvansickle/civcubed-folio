import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Calendar, ArrowRight, Linkedin, Twitter, Globe } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Let's Connect
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Connect
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Open to discussing research collaboration, speaking opportunities, 
              and shared interests in technology and society.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Professional Inquiries */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-elegant">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    Professional
                  </h3>
                  <p className="text-muted-foreground">
                    Speaking opportunities, collaboration, and professional networking
                  </p>
                </div>
              </div>
              <Button className="w-full group">
                Get in Touch
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </Card>

            {/* Book & Research */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-elegant">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    Research
                  </h3>
                  <p className="text-muted-foreground">
                    Research discussions, academic collaboration, and shared interests
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full group">
                Start a Conversation
                <MessageSquare className="group-hover:scale-110 transition-transform" size={18} />
              </Button>
            </Card>
          </div>

          {/* Speaking & Events */}
          <Card className="p-8 mb-12 bg-gradient-subtle border-border/50">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Speaking
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Available for presentations on technology trends, future studies, 
                and research insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Speaking Inquiries
                </Button>
                <Button variant="ghost" size="lg">
                  Topics & Expertise
                </Button>
              </div>
            </div>
          </Card>

          {/* Social Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-foreground mb-6">
              Follow the Journey
            </h4>
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                <Globe className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Stay updated on new research, insights, and events
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};