import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  connections: number[];
  element?: HTMLElement;
}

export const ConstellationField = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<Star[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Generate constellation points
    const generateStars = () => {
      const starCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
      const stars: Star[] = [];

      for (let i = 0; i < starCount; i++) {
        const star: Star = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          connections: []
        };

        // Create star element
        const starElement = document.createElement('div');
        starElement.className = 'constellation-star';
        starElement.style.left = `${star.x}px`;
        starElement.style.top = `${star.y}px`;
        container.appendChild(starElement);
        star.element = starElement;

        stars.push(star);
      }

      // Find nearest neighbors for each star
      stars.forEach((star, index) => {
        const distances = stars
          .map((otherStar, otherIndex) => ({
            index: otherIndex,
            distance: Math.sqrt(
              Math.pow(star.x - otherStar.x, 2) + Math.pow(star.y - otherStar.y, 2)
            )
          }))
          .filter(d => d.index !== index)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3); // Get 3 nearest neighbors

        star.connections = distances.map(d => d.index);
      });

      return stars;
    };

    const stars = generateStars();
    starsRef.current = stars;

    // Mouse interaction handler
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const revealRadius = 100;

      stars.forEach((star, index) => {
        const distance = Math.sqrt(
          Math.pow(mouseX - star.x, 2) + Math.pow(mouseY - star.y, 2)
        );

        if (distance < revealRadius && star.element) {
          const intensity = 1 - (distance / revealRadius);
          star.element.classList.add('active');
          star.element.style.opacity = `${0.3 + intensity * 0.5}`;

          // Create connection lines to nearest neighbors
          star.connections.forEach(connectionIndex => {
            const connectedStar = stars[connectionIndex];
            if (!connectedStar) return;

            const connectionDistance = Math.sqrt(
              Math.pow(mouseX - connectedStar.x, 2) + Math.pow(mouseY - connectedStar.y, 2)
            );

            if (connectionDistance < revealRadius) {
              // Create temporary line element
              const lineId = `line-${Math.min(index, connectionIndex)}-${Math.max(index, connectionIndex)}`;
              let lineElement = container.querySelector(`#${lineId}`) as HTMLElement;

              if (!lineElement) {
                lineElement = document.createElement('div');
                lineElement.id = lineId;
                lineElement.style.position = 'absolute';
                lineElement.style.height = '1px';
                lineElement.style.background = 'linear-gradient(90deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1))';
                lineElement.style.transformOrigin = 'left center';
                lineElement.style.pointerEvents = 'none';
                lineElement.style.zIndex = '1';
                container.appendChild(lineElement);
              }

              // Position and rotate the line
              const dx = connectedStar.x - star.x;
              const dy = connectedStar.y - star.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);

              lineElement.style.left = `${star.x}px`;
              lineElement.style.top = `${star.y}px`;
              lineElement.style.width = `${length}px`;
              lineElement.style.transform = `rotate(${angle}deg)`;
              lineElement.style.opacity = `${Math.min(intensity, 1 - (connectionDistance / revealRadius)) * 0.4}`;
            }
          });
        } else if (star.element) {
          star.element.classList.remove('active');
          star.element.style.opacity = '0.1';
        }
      });

      // Clean up distant connection lines
      const lines = container.querySelectorAll('[id^="line-"]');
      lines.forEach(line => {
        const lineElement = line as HTMLElement;
        const currentOpacity = parseFloat(lineElement.style.opacity || '0');
        if (currentOpacity < 0.05) {
          lineElement.remove();
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    isInitialized.current = true;

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="constellation-field"
      style={{ pointerEvents: 'none' }}
    />
  );
};