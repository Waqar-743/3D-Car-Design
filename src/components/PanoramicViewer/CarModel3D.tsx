import React, { useRef, useEffect, Suspense } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useCarStore } from '../../store/carStore';
import { getCarById } from '../../config/carModels';
import { EXCLUDED_MESH_PATTERNS } from './ColorPicker';
import { F1_HOTSPOTS, HotspotData } from './Hotspots';

// Preload models for faster switching
useGLTF.preload('/models/mclaren-mcl38/f1_2024_mclaren_mcl38.glb');
useGLTF.preload('/models/mercedes-w14/f1_2023_mercedes_amg_w14_e_performance_s1.glb');

interface CarModel3DProps {
  carId: string;
  onHotspotClick?: (hotspot: HotspotData) => void;
}

// Check if a mesh should be excluded from color changes
const shouldExcludeMesh = (meshName: string): boolean => {
  const lowerName = meshName.toLowerCase();
  return EXCLUDED_MESH_PATTERNS.some(pattern => lowerName.includes(pattern));
};

function CarModelInner({ carId, onHotspotClick }: CarModel3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const carConfig = getCarById(carId);
  const paintedMeshesRef = useRef<THREE.Mesh[]>([]);
  const loadingAnimated = useRef(false);
  
  const { 
    autoRotate,
    demoMode,
    setLoading,
    selectedBodyColor,
    activeHotspot,
  } = useCarStore();
  
  // Load 3D model
  const modelPath = carConfig?.modelPath || '';
  const { scene } = useGLTF(modelPath, true);
  
  // Fast loading animation after model loads
  useEffect(() => {
    if (!loadingAnimated.current && scene) {
      loadingAnimated.current = true;
      
      // Quick animate from current progress to 100%
      let progress = 0;
      const animateProgress = () => {
        progress += 10; // Faster increments
        if (progress >= 100) {
          setLoading(false, 100);
        } else {
          setLoading(true, progress);
          requestAnimationFrame(animateProgress);
        }
      };
      animateProgress();
    }
  }, [scene, setLoading]);
  
  // Clone and process the scene
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    paintedMeshesRef.current = [];
    
    // Calculate bounding box to auto-scale and position
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    
    // Normalize scale so model fits nicely
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 6; // Target size
    const autoScale = targetSize / maxDim;
    clone.scale.multiplyScalar(autoScale);
    
    // Recalculate bounding box after scaling
    box.setFromObject(clone);
    const newCenter = box.getCenter(new THREE.Vector3());
    const newMin = box.min;
    
    // Center horizontally and position on ground (y = 0)
    clone.position.x = -newCenter.x;
    clone.position.z = -newCenter.z;
    clone.position.y = -newMin.y + 0.1; // Lift slightly above ground
    
    // Process meshes and identify paintable surfaces
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        const meshName = child.name || `mesh_${child.id}`;
        
        // Clone material so we can modify it independently
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material = child.material.clone();
          child.material.envMapIntensity = 2;
          
          // Check if this mesh should be color-changeable
          // Only add meshes that are NOT excluded
          if (!shouldExcludeMesh(meshName)) {
            // Check if material has a color that looks like paint (not black, not chrome)
            const color = child.material.color;
            const isBlackish = color.r < 0.15 && color.g < 0.15 && color.b < 0.15;
            
            // Add colored meshes to paintable list
            if (!isBlackish) {
              paintedMeshesRef.current.push(child);
            }
          }
          
          child.material.metalness = Math.max(child.material.metalness, 0.5);
          child.material.roughness = Math.min(child.material.roughness, 0.5);
          child.material.needsUpdate = true;
        }
      }
    });
    
    return clone;
  }, [scene]);
  
  // Apply color changes when selectedBodyColor changes
  useEffect(() => {
    paintedMeshesRef.current.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        // Convert to MeshPhysicalMaterial for clearcoat support if needed
        if (!(mesh.material instanceof THREE.MeshPhysicalMaterial)) {
          const physicalMat = new THREE.MeshPhysicalMaterial();
          physicalMat.copy(mesh.material as THREE.MeshStandardMaterial);
          mesh.material = physicalMat;
        }
        
        const material = mesh.material as THREE.MeshPhysicalMaterial;
        
        // Set the color
        material.color.set(selectedBodyColor.hex);
        
        // Premium car paint properties
        material.metalness = selectedBodyColor.metalness ?? 0.7;
        material.roughness = selectedBodyColor.roughness ?? 0.15;
        
        // Clearcoat for that glossy car paint look
        material.clearcoat = 1.0;
        material.clearcoatRoughness = 0.1;
        
        // Enhanced reflectivity
        material.envMapIntensity = 2.5;
        material.reflectivity = 1;
        
        material.needsUpdate = true;
      }
    });
  }, [selectedBodyColor]);
  
  // Auto-rotate animation - slower speed
  useFrame((_, delta) => {
    if (groupRef.current && (autoRotate || demoMode)) {
      groupRef.current.rotation.y += delta * (demoMode ? 0.08 : 0.15);
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={clonedScene} />
      
      {/* Hotspots that move with the car */}
      {F1_HOTSPOTS.map((hotspot) => (
        <HotspotMarkerInternal
          key={hotspot.id}
          hotspot={hotspot}
          onClick={onHotspotClick}
          isActive={activeHotspot?.id === hotspot.id}
        />
      ))}
    </group>
  );
}

// Internal hotspot marker that moves with the car
interface HotspotMarkerInternalProps {
  hotspot: HotspotData;
  onClick?: (hotspot: HotspotData) => void;
  isActive: boolean;
}

const HotspotMarkerInternal: React.FC<HotspotMarkerInternalProps> = ({ hotspot, onClick, isActive }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <group position={hotspot.position}>
      <Html center distanceFactor={8}>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onClick?.(hotspot)}
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
          <div 
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: hovered || isActive ? '#00CED1' : 'rgba(0, 206, 209, 0.6)',
            }}
          />
          
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
        </motion.button>
        
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

// Loading fallback component
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 2;
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[3, 0.8, 6]} />
      <meshStandardMaterial color="#d4af37" wireframe />
    </mesh>
  );
}

export const CarModel3D: React.FC<CarModel3DProps> = (props) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CarModelInner {...props} />
    </Suspense>
  );
};

export default CarModel3D;
