import React, { useRef, useEffect, useState, useCallback } from "react";

// Car detail hotspots - position relative to image (percentage based)
interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  label: string;
  description: string;
  icon: string;
  specs?: { label: string; value: string }[];
}

// Hotspots for each image
const defaultHotspots: Hotspot[] = [
  {
    id: "headlights",
    x: 25,
    y: 35,
    label: "LED Matrix Headlights",
    description: "Adaptive LED matrix technology with automatic high beam assist",
    icon: "💡",
    specs: [
      { label: "Type", value: "LED Matrix" },
      { label: "Range", value: "500m" },
      { label: "Auto Dimming", value: "Yes" },
    ],
  },
  {
    id: "wheels",
    x: 20,
    y: 70,
    label: "21\" Forged Alloy Wheels",
    description: "Lightweight forged aluminum wheels with performance tires",
    icon: "⚙️",
    specs: [
      { label: "Size", value: '21"' },
      { label: "Material", value: "Forged Aluminum" },
      { label: "Tires", value: "Michelin Pilot Sport" },
    ],
  },
  {
    id: "body",
    x: 50,
    y: 40,
    label: "Carbon Fiber Body",
    description: "Lightweight carbon fiber construction for optimal performance",
    icon: "✨",
    specs: [
      { label: "Material", value: "Carbon Fiber" },
      { label: "Weight Savings", value: "40%" },
    ],
  },
  {
    id: "mirrors",
    x: 75,
    y: 35,
    label: "Digital Side Mirrors",
    description: "Camera-based mirrors with interior OLED displays",
    icon: "📷",
    specs: [
      { label: "Type", value: "Digital Camera" },
      { label: "Display", value: "OLED" },
    ],
  },
];

interface RotationCanvasProps {
  images: string[];
  onFrameChange?: (frame: number) => void;
}

export const RotationCanvas: React.FC<RotationCanvasProps> = ({
  images,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [imageAngles, setImageAngles] = useState<number[]>([]);

  // Initialize angles for each image
  useEffect(() => {
    setImageAngles(images.map(() => 0));
  }, [images]);

  // Preload all images
  useEffect(() => {
    if (images.length === 0) return;

    setIsLoaded(false);
    setLoadedCount(0);

    let loaded = 0;
    const imageElements: HTMLImageElement[] = [];

    images.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === images.length) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === images.length) {
          setIsLoaded(true);
        }
      };
      img.src = src;
      imageElements[index] = img;
    });

    return () => {
      imageElements.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [images]);

  // Scroll-based angle change for visible images
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const viewportHeight = container.clientHeight;

      // Calculate angle for each image based on its position in viewport
      const newAngles = images.map((_, index) => {
        const imageElement = container.querySelector(`[data-image-index="${index}"]`) as HTMLElement;
        if (!imageElement) return 0;

        const rect = imageElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate how far through the viewport this image is
        const imageCenter = rect.top + rect.height / 2 - containerRect.top;
        const viewportCenter = viewportHeight / 2;
        
        // Distance from center (-1 to 1)
        const distanceFromCenter = (imageCenter - viewportCenter) / viewportHeight;
        
        // Convert to rotation angle (-30 to 30 degrees)
        const angle = distanceFromCenter * -40;
        
        return Math.max(-40, Math.min(40, angle));
      });

      setImageAngles(newAngles);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // Initial calculation
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoaded, images]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.key === "Escape") {
        setActiveHotspot(null);
      } else if (e.key === "h" || e.key === "H") {
        setShowHotspots(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle hotspot click
  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    setActiveHotspot(prev => prev?.id === hotspot.id ? null : hotspot);
  }, []);

  // Close detail panel
  const closeDetailPanel = useCallback(() => {
    setActiveHotspot(null);
  }, []);

  // Loading state
  if (!isLoaded && images.length > 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-charcoal">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-charcoal-50 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-gold rounded-full animate-spin"></div>
        </div>
        <p className="text-platinum-400 text-lg mb-3">Loading 360° Experience...</p>
        <div className="w-48 h-2 bg-charcoal-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gold rounded-full transition-all duration-200"
            style={{ width: `${(loadedCount / images.length) * 100}%` }}
          />
        </div>
        <p className="text-platinum-500 text-sm mt-2">{loadedCount} / {images.length} images</p>
      </div>
    );
  }

  // No images
  if (images.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-charcoal">
        <div className="text-center">
          <span className="text-8xl mb-6 block">🚗</span>
          <p className="text-platinum-400 text-xl">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-charcoal"
    >
      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto scroll-smooth"
        style={{ perspective: "1500px" }}
      >
        {/* All images in a vertical scroll layout */}
        {images.map((src, index) => (
          <div
            key={index}
            data-image-index={index}
            className="relative min-h-screen flex items-center justify-center py-8"
            style={{ perspective: "1000px" }}
          >
            {/* Image with 3D rotation based on scroll */}
            <div
              className="relative w-full max-w-5xl mx-auto px-8 transition-transform duration-100 ease-out"
              style={{
                transform: `
                  rotateX(${imageAngles[index] || 0}deg)
                  scale(${1 - Math.abs(imageAngles[index] || 0) * 0.003})
                `,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Image number badge */}
              <div className="absolute -top-4 left-8 z-20">
                <div className="glass-panel px-4 py-2 flex items-center gap-3">
                  <span className="text-gold text-2xl font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="text-left">
                    <p className="text-platinum-400 text-sm font-medium">View {index + 1}</p>
                    <p className="text-platinum-500 text-xs">
                      Angle: {Math.round(imageAngles[index] || 0)}°
                    </p>
                  </div>
                </div>
              </div>

              {/* Main image with shadow */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={src}
                  alt={`Car view ${index + 1}`}
                  className="w-full h-auto object-contain"
                  draggable={false}
                />

                {/* Reflection/gradient overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(
                      ${180 + (imageAngles[index] || 0)}deg,
                      transparent 40%,
                      rgba(212, 175, 55, 0.05) 60%,
                      transparent 80%
                    )`,
                  }}
                />

                {/* Hotspot markers on each image */}
                {showHotspots && defaultHotspots.map((hotspot) => (
                  <button
                    key={`${index}-${hotspot.id}`}
                    onClick={() => handleHotspotClick(hotspot)}
                    className={`
                      absolute z-20 transform -translate-x-1/2 -translate-y-1/2
                      transition-all duration-300
                      ${activeHotspot?.id === hotspot.id ? "scale-125" : "hover:scale-110"}
                    `}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  >
                    {/* Pulsing ring */}
                    <span className={`
                      absolute inset-0 w-10 h-10 -m-2 rounded-full
                      ${activeHotspot?.id === hotspot.id ? "bg-gold/30" : "bg-gold/20"}
                      animate-ping
                    `}></span>
                    
                    {/* Hotspot button */}
                    <span className={`
                      relative flex items-center justify-center
                      w-8 h-8 rounded-full
                      ${activeHotspot?.id === hotspot.id 
                        ? "bg-gold text-charcoal" 
                        : "bg-charcoal/80 text-gold border-2 border-gold/50 hover:bg-gold hover:text-charcoal"
                      }
                      backdrop-blur-sm shadow-lg
                      transition-all duration-300
                    `}>
                      <span className="text-sm">{hotspot.icon}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Image shadow on "floor" */}
              <div 
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full blur-xl opacity-50"
                style={{
                  background: "radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)",
                  transform: `translateX(-50%) scaleY(${1 + Math.abs(imageAngles[index] || 0) * 0.02})`,
                }}
              />
            </div>
          </div>
        ))}

        {/* End spacer */}
        <div className="h-32"></div>
      </div>

      {/* Detail Panel - Slides in from right */}
      <div className={`
        absolute right-0 top-0 bottom-0 w-full sm:w-96 z-30
        bg-charcoal/95 backdrop-blur-xl
        border-l border-gold/20
        transform transition-transform duration-500 ease-out
        ${activeHotspot ? "translate-x-0" : "translate-x-full"}
        overflow-y-auto
      `}>
        {activeHotspot && (
          <div className="p-6">
            {/* Close button */}
            <button
              onClick={closeDetailPanel}
              className="absolute top-4 right-4 w-10 h-10 rounded-full
                bg-charcoal-100 hover:bg-gold hover:text-charcoal
                flex items-center justify-center
                transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Feature icon */}
            <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/30
              flex items-center justify-center mb-6">
              <span className="text-4xl">{activeHotspot.icon}</span>
            </div>

            {/* Feature title */}
            <h3 className="text-2xl font-bold text-light-gray mb-3">
              {activeHotspot.label}
            </h3>

            {/* Feature description */}
            <p className="text-platinum-400 text-base leading-relaxed mb-6">
              {activeHotspot.description}
            </p>

            {/* Specifications */}
            {activeHotspot.specs && activeHotspot.specs.length > 0 && (
              <div>
                <h4 className="text-gold text-sm font-semibold uppercase tracking-wider mb-4">
                  Specifications
                </h4>
                <div className="space-y-3">
                  {activeHotspot.specs.map((spec, idx) => (
                    <div 
                      key={idx}
                      className="flex justify-between items-center py-3 px-4
                        bg-charcoal-200 rounded-lg border border-charcoal-50"
                    >
                      <span className="text-platinum-500 text-sm">{spec.label}</span>
                      <span className="text-light-gray font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <button className="w-full mt-8 py-4 rounded-xl
              bg-gold text-charcoal font-bold
              hover:bg-gold/90 active:scale-[0.98]
              transition-all duration-300">
              Learn More
            </button>
          </div>
        )}
      </div>

      {/* Scroll progress indicator - Fixed on left */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
        <div className="glass-panel px-3 py-4 flex flex-col items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const el = scrollContainerRef.current?.querySelector(`[data-image-index="${index}"]`);
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${Math.abs(imageAngles[index] || 0) < 5 
                  ? "bg-gold scale-125 shadow-gold-glow" 
                  : "bg-charcoal-50 hover:bg-gold/50"
                }
              `}
              title={`View ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Controls hint - Fixed at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="glass-panel px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 text-platinum-400">
            <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-sm">Scroll to change viewing angle</span>
          </div>
          
          <div className="w-px h-6 bg-charcoal-50"></div>

          {/* Toggle hotspots button */}
          <button
            onClick={() => setShowHotspots(prev => !prev)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg
              transition-all duration-300
              ${showHotspots 
                ? "bg-gold text-charcoal" 
                : "bg-charcoal-100 text-platinum hover:bg-gold hover:text-charcoal"
              }
            `}
            title={showHotspots ? "Hide details (H)" : "Show details (H)"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">Details</span>
          </button>
        </div>
      </div>

      {/* Scroll hint animation at start */}
      <div className="fixed top-1/2 right-6 -translate-y-1/2 z-40 pointer-events-none">
        <div className="glass-panel px-3 py-4">
          <div className="flex flex-col items-center gap-2 text-platinum-500">
            <span className="text-xs uppercase tracking-wider rotate-90 whitespace-nowrap">Scroll for 3D</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotationCanvas;
