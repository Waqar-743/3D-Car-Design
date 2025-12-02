import React from 'react';
import { motion } from 'framer-motion';
import { useCarStore } from '../../store/carStore';

// F1 Car SVG Icon Component - Brighter colors
const F1CarIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg 
    viewBox="0 0 100 40" 
    className={className}
    style={style}
    fill="currentColor"
  >
    {/* F1 Car silhouette */}
    <path d="M95 25 L90 22 L85 22 L82 18 L75 16 L70 16 L68 14 L55 12 L45 12 L35 14 L25 16 L15 18 L10 20 L5 22 L3 25 L5 28 L15 28 L18 25 L22 25 L25 28 L35 28 L38 25 L62 25 L65 28 L75 28 L78 25 L82 25 L85 28 L92 28 L95 25 Z" />
    {/* Front wheel */}
    <circle cx="20" cy="26" r="6" fill="#2a2a2a" />
    <circle cx="20" cy="26" r="4" fill="#444" />
    <circle cx="20" cy="26" r="2" fill="#666" />
    {/* Rear wheel */}
    <circle cx="80" cy="26" r="6" fill="#2a2a2a" />
    <circle cx="80" cy="26" r="4" fill="#444" />
    <circle cx="80" cy="26" r="2" fill="#666" />
    {/* Halo */}
    <path d="M45 12 Q50 8 55 12" fill="none" stroke="currentColor" strokeWidth="2" />
    {/* Front wing detail */}
    <rect x="2" y="20" width="8" height="2" rx="1" />
    {/* Rear wing */}
    <rect x="88" y="15" width="2" height="8" />
    <rect x="85" y="13" width="10" height="2" rx="1" />
  </svg>
);

export const LoadingOverlay: React.FC = () => {
  const { isLoading, loadingProgress } = useCarStore();
  
  if (!isLoading) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
      }}
    >
      {/* Top spacer */}
      <div className="flex-1" />
      
      {/* Center - "Are You Ready?" Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-1 flex flex-col items-center justify-center px-4"
      >
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-wider text-center"
          style={{ 
            color: '#FFFFFF',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3)',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Are You Ready?
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl tracking-wide text-center"
          style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Experience engineering perfection
        </motion.p>
      </motion.div>
      
      {/* Bottom - Loader near footer */}
      <div className="w-full px-4 sm:px-8 pb-8 sm:pb-16">
        <div className="max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
          {/* F1 Car driving across the screen - Hidden on very small screens for performance */}
          <div className="relative h-10 sm:h-12 mb-3 sm:mb-4 hidden sm:block">
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ 
                left: `${Math.max(0, Math.min(loadingProgress - 5, 95))}%`,
                filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.8))',
              }}
              initial={{ left: '0%' }}
              animate={{ 
                left: `${Math.max(0, Math.min(loadingProgress - 5, 95))}%`,
              }}
              transition={{ 
                duration: 0.3, 
                ease: 'easeOut',
              }}
            >
              <F1CarIcon className="w-10 h-5 sm:w-14 sm:h-7" style={{ color: '#D4AF37' }} />
              
              {/* Speed lines behind car - Simplified */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 flex flex-col gap-0.5 pr-1">
                <div className="w-6 sm:w-10 h-0.5 rounded" style={{ background: 'linear-gradient(to left, #D4AF37, transparent)' }} />
                <div className="w-4 sm:w-7 h-0.5 rounded" style={{ background: 'linear-gradient(to left, #D4AF37, transparent)' }} />
              </div>
            </motion.div>
          </div>
          
          {/* Progress Bar - Full width, bright */}
          <div 
            className="h-1 sm:h-1.5 rounded-full overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: '#D4AF37',
                boxShadow: '0 0 15px rgba(212, 175, 55, 0.6)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          
          {/* Progress Percentage */}
          <div className="flex justify-center items-center mt-3 sm:mt-4">
            <p 
              className="text-xl sm:text-2xl md:text-3xl font-bold font-mono"
              style={{ 
                color: '#D4AF37',
                textShadow: '0 0 15px rgba(212, 175, 55, 0.6)',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {loadingProgress}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
