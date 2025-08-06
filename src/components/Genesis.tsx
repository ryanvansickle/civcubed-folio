import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Genesis = () => {
  const genesisData = [
    {
      title: "Civilization³",
      role: "Author",
      location: "Richmond, VA",
      narrative: "Authoring a forthcoming book on the next epoch of human civilization, catalyzed by the convergence of AGI, synthetic biology, and decentralized systems. Civilization³ maps the tectonic shift away from the Industrial Age and provides a framework for building our collective future."
    },
    {
      title: "T3MPLO",
      role: "Co-Founder",
      location: "Puerto Rico",
      narrative: "Co-founded a live/work incubator for leading blockchain innovators. It was a real-world experiment in creating high-trust environments to accelerate deep work, revealing the critical need for new social architectures to support the builders of Civilization³."
    },
    {
      title: "F4CTORY",
      role: "Founding Member & Strategist",
      location: "San Francisco, CA",
      narrative: "An innovation platform connecting entrepreneurs with Fortune 500s. This vantage point provided a clear signal of the profound friction between legacy systems (Civ²) and the emerging paradigms of a new technological era, highlighting the inertia that Civ³ must overcome."
    },
    {
      title: "Aethos",
      role: "Founding Advisor / Catalyst",
      narrative: "A multidisciplinary creative guild and Web3 incubator. The focus was on building the cultures, campaigns, and communities for a decentralized future. A lesson in how the 'software' of human culture must be rewritten alongside our technology."
    },
    {
      title: "Wilder World",
      role: "Founding Advisor / Catalyst",
      narrative: "Guiding strategy for a photorealistic, player-owned metaverse. This was a laboratory for studying the emergence of digital-native economies, sovereign identity, and decentralized governance—the very social and economic structures that may define Civilization³."
    },
    {
      title: "Ursa Minor",
      role: "Chief Operating Officer",
      location: "Boulder, CO",
      narrative: "Led a digital agency through the 2008 financial crisis by radically restructuring its business model. This experience was a lesson in systemic resilience—how to design adaptable, anti-fragile systems capable of surviving the chaotic transition between epochs."
    },
    {
      title: "Synchro",
      role: "Founding Advisor / Catalyst",
      narrative: "An exploration into architecting the foundational primitives of human wellbeing. This work informs the Civ³ thesis on how to engineer robust, health-centric lifestyles capable of navigating the complexities of a post-AGI world."
    },
    {
      title: "Noma",
      role: "Founding Advisor / Catalyst", 
      narrative: "Innovating on complex botanical synergies to enhance cognition. This venture explores the intersection of ancient plants and modern wisdom, a direct inquiry into upgrading the biological substrate—our own consciousness—for Civilization³."
    },
    {
      title: "F2 Media",
      role: "Co-Founder & CEO",
      location: "Boulder, CO",
      narrative: "Co-founded one of the first venture-backed podcasting studios. It was an early foray into decentralized media, building niche global communities at scale and pioneering new organizational structures (Holacracy), prefiguring the cultural and economic landscape of Civilization³."
    },
    {
      title: "Qiterra Press",
      role: "Researcher",
      location: "Boulder, CO",
      narrative: "Contributed research on decentralized monetary systems years before Bitcoin's launch. This was a foundational exploration into the economic substrate of the future—an early attempt to write the source code for a new world's financial system."
    }
  ];

  return (
    <section id="genesis" className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="section-tag mb-6 px-4 py-2 text-sm font-medium border-foreground/20">
            Experience
          </Badge>
          <h2 className="text-5xl md:text-6xl font-normal text-foreground mb-12 leading-tight">
            Genesis
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {genesisData.map((item, index) => (
            <div key={index} className="genesis-card">
              <div className="card-content">
                <div className="card-state card-default-state">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-role">{item.role}</p>
                  {item.location && (
                    <span className="card-location">{item.location}</span>
                  )}
                </div>
                
                <div className="card-state card-hover-state">
                  {item.title === "Civilization³" ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="video-logo-container">
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          poster="/civ3-poster.jpg"
                        >
                          <source src="/civ3-video.mp4" type="video/mp4" />
                        </video>
                      </div>
                      <p className="card-narrative text-center">{item.narrative}</p>
                    </div>
                  ) : item.title === "T3MPLO" ? (
                     <div className="flex flex-col items-center space-y-4">
                       <div className="video-logo-container">
                         <video
                           autoPlay
                           loop
                           muted
                           playsInline
                         >
                           <source src="/telos-video.mp4" type="video/mp4" />
                         </video>
                       </div>
                       <p className="card-narrative text-center">{item.narrative}</p>
                     </div>
                  ) : item.title === "Aethos" ? (
                     <div className="flex flex-col items-center space-y-4">
                       <div className="video-logo-container">
                         <video
                           autoPlay
                           loop
                           muted
                           playsInline
                         >
                           <source src="/aethos-video.mp4" type="video/mp4" />
                         </video>
                       </div>
                       <p className="card-narrative text-center">{item.narrative}</p>
                     </div>
                  ) : item.title === "F2 Media" ? (
                     <div className="flex flex-col items-center space-y-4">
                       <div className="video-logo-container">
                         <video
                           autoPlay
                           loop
                           muted
                           playsInline
                         >
                           <source src="/f2media-video.mp4" type="video/mp4" />
                         </video>
                       </div>
                       <p className="card-narrative text-center">{item.narrative}</p>
                     </div>
                  ) : item.title === "Synchro" ? (
                     <div className="flex flex-col items-center space-y-4">
                       <div className="video-logo-container">
                         <video
                           autoPlay
                           loop
                           muted
                           playsInline
                         >
                           <source src="/synchro-video.mp4" type="video/mp4" />
                         </video>
                       </div>
                       <p className="card-narrative text-center">{item.narrative}</p>
                     </div>
                  ) : item.title === "Wilder World" ? (
                     <div className="flex flex-col items-center space-y-4">
                       <div className="video-logo-container">
                         <video
                           autoPlay
                           loop
                           muted
                           playsInline
                         >
                           <source src="/wilder-world-video.mp4" type="video/mp4" />
                         </video>
                       </div>
                       <p className="card-narrative text-center">{item.narrative}</p>
                     </div>
                  ) : item.title === "F4CTORY" ? (
                     <div className="flex flex-col items-center space-y-4">
                       <div className="video-logo-container">
                         <video
                           autoPlay
                           loop
                           muted
                           playsInline
                         >
                           <source src="/f4ctory-video.mp4" type="video/mp4" />
                         </video>
                       </div>
                       <p className="card-narrative text-center">{item.narrative}</p>
                     </div>
                   ) : item.title === "Noma" ? (
                     <div className="flex flex-col items-center space-y-4">
                       <div className="video-logo-container">
                         <video
                           autoPlay
                           loop
                           muted
                           playsInline
                         >
                           <source src="/noma-video.mp4" type="video/mp4" />
                         </video>
                       </div>
                       <p className="card-narrative text-center">{item.narrative}</p>
                     </div>
                   ) : item.title === "Ursa Minor" ? (
                     <div className="flex flex-col items-center space-y-4">
                       <div className="video-logo-container">
                         <video
                           autoPlay
                           loop
                           muted
                           playsInline
                         >
                           <source src="/wilder-world-video.mp4" type="video/mp4" />
                         </video>
                       </div>
                       <p className="card-narrative text-center">{item.narrative}</p>
                     </div>
                   ) : (
                     <p className="card-narrative">{item.narrative}</p>
                   )}
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
 };