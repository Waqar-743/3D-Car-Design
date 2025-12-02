import React from 'react';
import { motion } from 'framer-motion';

interface DemoButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

export const DemoButton: React.FC<DemoButtonProps> = ({ isActive, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl
        transition-colors duration-200
        ${isActive 
          ? 'bg-gold text-charcoal' 
          : 'bg-charcoal-200/80 text-platinum-300 border border-charcoal-50 hover:border-gold/50'
        }
      `}
    >
      {/* Play/Pause Icon */}
      <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
        {isActive ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>
      <span className="text-xs sm:text-sm font-medium hidden md:inline">
        {isActive ? 'Stop' : 'Cinematic'}
      </span>
    </motion.button>
  );
};

export default DemoButton;
