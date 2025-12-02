import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCarStore } from '../../store/carStore';
import { getAllCars } from '../../config/carModels';

export const CarSelector: React.FC = () => {
  const { 
    selectedCarId, 
    setSelectedCar, 
    isLoading,
    carClickCount,
    incrementCarClick,
    resetCarClick,
    setSpotlightMode,
    spotlightMode,
  } = useCarStore();
  const cars = getAllCars();
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Handle car button click with triple-click detection
  const handleCarClick = (carId: string) => {
    // Clear existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    // Increment click count
    incrementCarClick();
    
    // Set the selected car
    setSelectedCar(carId);
    
    // Reset click count after 800ms of no clicks
    clickTimeoutRef.current = setTimeout(() => {
      resetCarClick();
    }, 800);
  };
  
  // Check for triple click
  useEffect(() => {
    if (carClickCount >= 3) {
      // Toggle spotlight mode
      setSpotlightMode(!spotlightMode);
      resetCarClick();
    }
  }, [carClickCount, spotlightMode, setSpotlightMode, resetCarClick]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
      {cars.map((car) => (
        <motion.button
          key={car.id}
          onClick={() => handleCarClick(car.id)}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-medium
            transition-colors duration-200
            ${selectedCarId === car.id
              ? 'bg-gold text-charcoal shadow-lg shadow-gold/20'
              : 'bg-charcoal-200/80 text-platinum-400 hover:bg-charcoal-100 border border-charcoal-50'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span className="hidden md:inline">{car.name}</span>
          <span className="hidden sm:inline md:hidden">{car.model}</span>
          <span className="sm:hidden">{car.year}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CarSelector;
