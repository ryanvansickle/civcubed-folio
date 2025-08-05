import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <a href="/" className="flex items-center space-x-3 group">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    aria-label="Ryan Van Sickle Logo"
                    className="text-foreground group-hover:text-accent-turquoise transition-colors duration-300"
                  >
                    <path d="M0 0 L50 100 L100 0 L78 0 L50 56 L22 0 L0 0Z" fill="currentColor"/>
                  </svg>
                  <h1 className="text-lg font-medium text-foreground tracking-wide group-hover:text-accent-turquoise transition-colors duration-300">Ryan Van Sickle</h1>
                </a>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Futurist, author, and strategic thinker exploring the next evolution 
                of human civilization through technology, consciousness, and systems design.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#book" className="text-muted-foreground hover:text-foreground transition-colors">
                    The Book
                  </a>
                </li>
                <li>
                  <a href="#experience" className="text-muted-foreground hover:text-foreground transition-colors">
                    Experience
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Research Papers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Speaking Topics
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Media Kit
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Ryan Van Sickle. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Media Inquiries
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};