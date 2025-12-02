import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarStore } from '../../store/carStore';
import { getCarById, getCarPrice, formatPrice } from '../../config';

export const PricePopup: React.FC = () => {
  const { 
    selectedCarId, 
    showPrice, 
    setShowPrice,
    selectedVariant,
    setSelectedVariant,
  } = useCarStore();
  
  const carConfig = getCarById(selectedCarId);
  const priceConfig = getCarPrice(selectedCarId);
  
  if (!carConfig || !priceConfig) return null;
  
  const currentVariant = priceConfig.variants[selectedVariant] || priceConfig.variants[0];
  
  return (
    <AnimatePresence>
      {showPrice && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setShowPrice(false)}
          />
          
          {/* Price Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 25,
              duration: 0.4 
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
              w-[90%] max-w-md"
          >
            <div className="bg-gradient-to-br from-charcoal-200 to-charcoal 
              rounded-2xl border border-gold/30 shadow-2xl overflow-hidden">
              
              {/* Arrow Animation */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex justify-center pt-6"
              >
                <motion.div
                  animate={{ y: [-5, 0, -5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-gold text-4xl"
                >
                  ↑
                </motion.div>
              </motion.div>
              
              {/* Car Info */}
              <div className="px-6 pb-4 text-center">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-light-gray mb-1"
                >
                  🏎️ {carConfig.name}
                </motion.h2>
                <p className="text-platinum-500 text-sm">
                  {carConfig.model} • {carConfig.year} • {carConfig.color}
                </p>
              </div>
              
              {/* Price Display */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
                className="py-6 bg-black/30"
              >
                <div className="text-center">
                  <p className="text-platinum-500 text-sm mb-2 uppercase tracking-wider">
                    {currentVariant.name} Edition
                  </p>
                  <p className="text-5xl font-bold text-gold drop-shadow-lg">
                    {formatPrice(currentVariant.price)}
                  </p>
                  <p className="text-platinum-500 text-xs mt-2">
                    Starting Price • Financing Available
                  </p>
                </div>
              </motion.div>
              
              {/* Variant Selector */}
              <div className="px-6 py-4">
                <p className="text-platinum-500 text-xs uppercase tracking-wider mb-3">
                  Select Edition
                </p>
                <div className="flex gap-2">
                  {priceConfig.variants.map((variant, index) => (
                    <button
                      key={variant.name}
                      onClick={() => setSelectedVariant(index)}
                      className={`
                        flex-1 py-2 px-3 rounded-lg text-sm font-medium
                        transition-all duration-300
                        ${selectedVariant === index
                          ? 'bg-gold text-charcoal'
                          : 'bg-charcoal-100 text-platinum-400 hover:bg-charcoal-50'
                        }
                      `}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setShowPrice(false)}
                  className="flex-1 py-3 rounded-xl border border-charcoal-50
                    text-platinum-400 hover:bg-charcoal-100
                    transition-all duration-300"
                >
                  Close
                </button>
                <button
                  className="flex-1 py-3 rounded-xl bg-gold text-charcoal
                    font-bold hover:bg-gold/90
                    transition-all duration-300 active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
              
              {/* Close X Button */}
              <button
                onClick={() => setShowPrice(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full
                  bg-charcoal-100 hover:bg-gold hover:text-charcoal
                  flex items-center justify-center
                  transition-all duration-300"
              >
                ✕
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PricePopup;
