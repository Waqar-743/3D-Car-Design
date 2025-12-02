import React from "react";

interface LoadingSpinnerProps {
  progress?: number;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  progress,
  message = "Loading...",
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-charcoal/90 backdrop-blur-sm z-10">
      {/* Animated spinner */}
      <div className="relative w-20 h-20 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-charcoal-50 rounded-full"></div>
        {/* Spinning gold arc */}
        <div className="absolute inset-0 border-4 border-transparent border-t-gold rounded-full animate-spin"></div>
        {/* Inner glow */}
        <div className="absolute inset-2 border-2 border-gold/30 rounded-full animate-pulse-gold"></div>
        
        {/* Progress percentage in center */}
        {progress !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gold font-semibold text-lg">
              {progress}%
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="w-48 h-2 bg-charcoal-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-gold-600 to-gold transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Loading message */}
      <p className="text-platinum text-sm tracking-wide uppercase">
        {message}
      </p>

      {/* Car icon */}
      <div className="mt-4 text-3xl animate-pulse">🚗</div>
    </div>
  );
};

export default LoadingSpinner;
