import React from "react";

interface ControlBarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  isAutoRotating?: boolean;
  onToggleAutoRotate?: () => void;
  disabled?: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  onFullscreen,
  isFullscreen,
  isAutoRotating = false,
  onToggleAutoRotate,
  disabled = false,
}) => {
  return (
    <div className="glass-panel p-3 flex items-center justify-center gap-3 sm:gap-4">
      {/* Zoom controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onZoomOut}
          disabled={disabled || zoom <= 0.8}
          className="btn-icon"
          aria-label="Zoom out"
          title="Zoom Out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35M8 11h6" />
          </svg>
        </button>

        {/* Zoom level indicator */}
        <span className="text-platinum text-xs font-medium w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={onZoomIn}
          disabled={disabled || zoom >= 3}
          className="btn-icon"
          aria-label="Zoom in"
          title="Zoom In"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-charcoal-50"></div>

      {/* Auto-rotate toggle */}
      {onToggleAutoRotate && (
        <button
          onClick={onToggleAutoRotate}
          disabled={disabled}
          className={`btn-icon ${isAutoRotating ? "border-gold text-gold" : ""}`}
          aria-label={isAutoRotating ? "Stop auto-rotate" : "Start auto-rotate"}
          title={isAutoRotating ? "Stop Auto-Rotate" : "Start Auto-Rotate"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 ${isAutoRotating ? "animate-spin-slow" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
      )}

      {/* Reset button */}
      <button
        onClick={onReset}
        disabled={disabled}
        className="btn-icon"
        aria-label="Reset view"
        title="Reset View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>

      {/* Fullscreen button */}
      <button
        onClick={onFullscreen}
        disabled={disabled}
        className="btn-icon"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ControlBar;
