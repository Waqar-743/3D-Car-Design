import React, { useRef, useEffect, useCallback, useState } from "react";
import { useViewState } from "../../hooks";
import ViewTabs from "./ViewTabs";
import RotationCanvas from "./RotationCanvas";
import LoadingSpinner from "./LoadingSpinner";

interface CarViewer360Props {
  carModel?: string;
  carYear?: number;
  subtitle?: string;
}

export const CarViewer360: React.FC<CarViewer360Props> = ({
  carModel = "Luxury Sports Car",
  carYear = 2024,
  subtitle = "Premium Edition",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // View state management
  const {
    currentView,
    currentViewConfig,
    viewImages,
    isLoading,
    loadingProgress,
    changeView,
  } = useViewState({
    initialView: "exterior",
    autoRotate: false,
  });

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Keyboard: F for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex flex-col bg-charcoal overflow-hidden"
    >
      {/* Floating Header */}
      <header className="absolute top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex items-center justify-between p-4">
          {/* Logo/Title */}
          <div className="glass-panel px-4 py-3 pointer-events-auto">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-light-gray">
              <span className="text-gold">🚗</span> {carModel}
            </h1>
            <p className="text-platinum-500 text-xs tracking-wider uppercase">
              {carYear} {subtitle}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* View Tabs - Compact */}
            <div className="glass-panel p-1 flex gap-1">
              <ViewTabs
                activeView={currentView}
                onViewChange={changeView}
                disabled={isLoading}
                compact
              />
            </div>

            {/* Fullscreen button */}
            <button
              onClick={toggleFullscreen}
              className="glass-panel w-10 h-10 flex items-center justify-center
                hover:bg-gold hover:text-charcoal transition-all duration-300"
              title="Toggle fullscreen (F)"
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen 360° Viewer */}
      <div className="flex-1 relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-charcoal">
            <LoadingSpinner
              progress={loadingProgress}
              message={`Loading ${currentViewConfig.label}...`}
            />
          </div>
        )}

        {/* 360° Rotation Viewer - Full screen with scroll interaction */}
        {!isLoading && (
          <RotationCanvas images={viewImages} />
        )}
      </div>
    </div>
  );
};

export default CarViewer360;
