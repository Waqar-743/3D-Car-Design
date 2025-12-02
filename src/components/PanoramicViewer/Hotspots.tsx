import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// Hotspot data for F1 car parts
export interface HotspotData {
  id: string;
  position: THREE.Vector3;
  title: string;
  description: string;
  icon: string;
}

export const F1_HOTSPOTS: HotspotData[] = [
  {
    id: 'front-wing',
    position: new THREE.Vector3(0, 0.3, 2.8),
    title: 'Front Wing Assembly',
    description: 'Multi-element carbon fiber aerodynamic package generating up to 25% of total downforce. Features adjustable flap angles, cascade elements, and endplates optimized through 60+ wind tunnel sessions. Weight: approximately 10kg with mounting hardware.',
    icon: '▲',
  },
  {
    id: 'halo',
    position: new THREE.Vector3(0, 1.2, 0.3),
    title: 'Halo Protection System',
    description: 'FIA-mandated Grade 5 Titanium safety structure capable of withstanding 116kN (12 tonnes) of static load. Weighs 9kg and has saved multiple lives since its 2018 introduction. Integrated mounting points are stressed members of the chassis.',
    icon: '◆',
  },
  {
    id: 'engine-cover',
    position: new THREE.Vector3(0, 0.8, -1.2),
    title: 'Power Unit Bay',
    description: '1.6L V6 Turbo Hybrid Power Unit producing 1,000+ combined horsepower. Features MGU-K (kinetic) and MGU-H (heat) energy recovery systems. Thermal efficiency exceeds 50%—the most efficient internal combustion engines ever built. RPM limited to 15,000.',
    icon: '●',
  },
  {
    id: 'rear-wing',
    position: new THREE.Vector3(0, 1.0, -2.5),
    title: 'Rear Wing & DRS',
    description: 'Drag Reduction System (DRS) enables the rear flap to open within designated zones, reducing drag by up to 20%. Generates 300-350kg of downforce at 250 km/h. Carbon fiber construction with titanium mounting bolts. Actuator responds in under 0.1 seconds.',
    icon: '▼',
  },
  {
    id: 'sidepod',
    position: new THREE.Vector3(1.2, 0.6, -0.3),
    title: 'Sidepod & Cooling',
    description: 'Houses radiators managing 140kW of heat rejection. 2022 ground effect regulations revolutionized sidepod design for floor-generated downforce. Internal baffles direct airflow at precise angles. Inlet design critical for balancing cooling efficiency and aerodynamic drag.',
    icon: '◀',
  },
];

interface HotspotMarkerProps {
  hotspot: HotspotData;
  onClick: (hotspot: HotspotData) => void;
  isActive: boolean;
}

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot, onClick, isActive }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={hotspot.position}>
      {/* HTML overlay button - small transparent ring */}
      <Html center distanceFactor={8}>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onClick(hotspot)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'transparent',
            border: `2px solid ${isActive ? '#00CED1' : 'rgba(0, 206, 209, 0.8)'}`,
            boxShadow: hovered || isActive
              ? '0 0 15px rgba(0, 206, 209, 0.8), 0 0 30px rgba(0, 206, 209, 0.4), inset 0 0 10px rgba(0, 206, 209, 0.2)'
              : '0 0 8px rgba(0, 206, 209, 0.5)',
            position: 'relative',
          }}
        >
          {/* Small inner dot */}
          <div 
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: hovered || isActive ? '#00CED1' : 'rgba(0, 206, 209, 0.6)',
            }}
          />
          
          {/* Pulse ring 1 */}
          <motion.div
            animate={{
              scale: [1, 2, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '1px solid #00CED1',
            }}
          />
          
          {/* Pulse ring 2 (offset) */}
          <motion.div
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            style={{
              position: 'absolute',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '1px solid #00CED1',
            }}
          />
        </motion.button>
        
        {/* Tooltip on hover */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute',
              bottom: '-28px',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
            }}
          >
            <span 
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(0, 0, 0, 0.85)',
                color: '#00CED1',
                border: '1px solid rgba(0, 206, 209, 0.3)',
              }}
            >
              {hotspot.title}
            </span>
          </motion.div>
        )}
      </Html>
    </group>
  );
};

interface HotspotsProps {
  onHotspotClick?: (hotspot: HotspotData) => void;
  activeHotspot: HotspotData | null;
}

// Main Hotspots component to render all markers
export const Hotspots: React.FC<HotspotsProps> = ({ onHotspotClick, activeHotspot }) => {
  return (
    <group>
      {F1_HOTSPOTS.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          onClick={onHotspotClick || (() => {})}
          isActive={activeHotspot?.id === hotspot.id}
        />
      ))}
    </group>
  );
};

// Hotspot Info Modal Component (rendered outside Canvas)
interface HotspotModalProps {
  hotspot: HotspotData | null;
  onClose: () => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({ hotspot, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {hotspot && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] max-w-md"
          >
            <div 
              className="backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(0, 206, 209, 0.3)',
                boxShadow: '0 0 30px rgba(0, 206, 209, 0.1)',
              }}
            >
              {/* Header with icon */}
              <div 
                className="p-4 sm:p-6 pb-3 sm:pb-4"
                style={{
                  background: 'linear-gradient(to right, rgba(0, 206, 209, 0.15), transparent)',
                }}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(0, 206, 209, 0.1)',
                      border: '1px solid rgba(0, 206, 209, 0.4)',
                    }}
                  >
                    <span className="text-xl sm:text-2xl">{hotspot.icon}</span>
                  </div>
                  <div>
                    <h3 
                      className="text-base sm:text-xl font-bold"
                      style={{ color: '#00CED1' }}
                    >
                      {hotspot.title}
                    </h3>
                    <p 
                      className="text-xs sm:text-sm uppercase tracking-wider"
                      style={{ color: 'rgba(0, 206, 209, 0.6)' }}
                    >
                      Technical Spec
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 sm:p-6 pt-2">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{hotspot.description}</p>
                
                {/* Stats bar */}
                <div className="mt-4 sm:mt-5 flex gap-2 sm:gap-3">
                  <div 
                    className="flex-1 rounded-lg p-2 sm:p-3 text-center"
                    style={{ background: 'rgba(0, 206, 209, 0.08)' }}
                  >
                    <p style={{ color: '#00CED1' }} className="text-base sm:text-lg font-bold">F1</p>
                    <p className="text-gray-500 text-[10px] sm:text-xs">Regulation</p>
                  </div>
                  <div 
                    className="flex-1 rounded-lg p-2 sm:p-3 text-center"
                    style={{ background: 'rgba(0, 206, 209, 0.08)' }}
                  >
                    <p style={{ color: '#00CED1' }} className="text-base sm:text-lg font-bold">2024</p>
                    <p className="text-gray-500 text-[10px] sm:text-xs">Season</p>
                  </div>
                  <div 
                    className="flex-1 rounded-lg p-2 sm:p-3 text-center"
                    style={{ background: 'rgba(0, 206, 209, 0.08)' }}
                  >
                    <p style={{ color: '#00CED1' }} className="text-base sm:text-lg font-bold">CFD</p>
                    <p className="text-gray-500 text-[10px] sm:text-xs">Optimized</p>
                  </div>
                </div>
              </div>
              
              {/* Close button */}
              <div className="p-4 sm:p-6 pt-0">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors duration-200"
                  style={{
                    background: 'rgba(0, 206, 209, 0.1)',
                    border: '1px solid rgba(0, 206, 209, 0.3)',
                    color: '#00CED1',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#00CED1';
                    e.currentTarget.style.color = '#1a1a1a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 206, 209, 0.1)';
                    e.currentTarget.style.color = '#00CED1';
                  }}
                >
                  Close
                </button>
              </div>
              
              {/* X button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-200 text-sm"
                style={{
                  background: 'rgba(0, 206, 209, 0.1)',
                  color: 'rgba(0, 206, 209, 0.8)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#00CED1';
                  e.currentTarget.style.color = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 206, 209, 0.1)';
                  e.currentTarget.style.color = 'rgba(0, 206, 209, 0.8)';
                }}
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

export default Hotspots;
