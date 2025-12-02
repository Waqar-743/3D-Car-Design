import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarStore } from '../../store/carStore';

export const Lighting: React.FC = () => {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunSpotRef = useRef<THREE.SpotLight>(null);
  const sunSpot2Ref = useRef<THREE.SpotLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const backLightRef = useRef<THREE.DirectionalLight>(null);
  
  const { demoTransitionPhase, spotlightMode } = useCarStore();
  
  // Create a target for the spotlight
  const spotTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0, 0.5, 0);
    return target;
  }, []);
  
  // Animate light intensity during demo transition and spotlight mode
  useFrame(() => {
    // Spotlight mode: dark environment with sun rays from gate
    if (spotlightMode) {
      const speed = 0.05; // Faster transition
      
      // Dim all normal lights significantly
      if (keyLightRef.current) {
        keyLightRef.current.intensity += (0.02 - keyLightRef.current.intensity) * speed;
      }
      if (fillLightRef.current) {
        fillLightRef.current.intensity += (0.01 - fillLightRef.current.intensity) * speed;
      }
      if (spotLightRef.current) {
        spotLightRef.current.intensity += (0.02 - spotLightRef.current.intensity) * speed;
      }
      if (ambientRef.current) {
        ambientRef.current.intensity += (0.03 - ambientRef.current.intensity) * speed;
      }
      if (hemiRef.current) {
        hemiRef.current.intensity += (0.02 - hemiRef.current.intensity) * speed;
      }
      if (backLightRef.current) {
        backLightRef.current.intensity += (0.01 - backLightRef.current.intensity) * speed;
      }
      // Bright yellow spotlight from the front wall/gate
      if (sunSpotRef.current) {
        sunSpotRef.current.intensity += (15 - sunSpotRef.current.intensity) * speed;
      }
      if (sunSpot2Ref.current) {
        sunSpot2Ref.current.intensity += (10 - sunSpot2Ref.current.intensity) * speed;
      }
      return;
    }
    
    // Normal mode or demo transition
    const targetIntensity = demoTransitionPhase === 'dark' ? 0.2 : 
                           demoTransitionPhase === 'revealing' ? 1.5 : 1;
    const speed = 0.02;
    
    if (keyLightRef.current) {
      keyLightRef.current.intensity += (targetIntensity * 2 - keyLightRef.current.intensity) * speed;
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity += (targetIntensity - fillLightRef.current.intensity) * speed;
    }
    if (spotLightRef.current) {
      spotLightRef.current.intensity += (targetIntensity * 1.2 - spotLightRef.current.intensity) * speed;
    }
    if (ambientRef.current) {
      ambientRef.current.intensity += (targetIntensity * 0.7 - ambientRef.current.intensity) * speed;
    }
    if (hemiRef.current) {
      hemiRef.current.intensity += (0.5 - hemiRef.current.intensity) * speed;
    }
    if (backLightRef.current) {
      backLightRef.current.intensity += (0.8 - backLightRef.current.intensity) * speed;
    }
    // Turn off sun spotlight in normal mode
    if (sunSpotRef.current) {
      sunSpotRef.current.intensity += (0 - sunSpotRef.current.intensity) * speed;
    }
    if (sunSpot2Ref.current) {
      sunSpot2Ref.current.intensity += (0 - sunSpot2Ref.current.intensity) * speed;
    }
  });
  
  return (
    <>
      {/* Key Light - Main illumination (reduced shadow map size) */}
      <directionalLight
        ref={keyLightRef}
        position={[5, 10, 7]}
        intensity={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      
      {/* Fill Light - Reduce harsh shadows */}
      <directionalLight
        ref={fillLightRef}
        position={[-5, 5, 0]}
        intensity={1}
        color="#ffffff"
      />
      
      {/* Back Light - Rim lighting for edges */}
      <directionalLight
        ref={backLightRef}
        position={[0, 2, -10]}
        intensity={0.8}
        color="#ffffff"
      />
      
      {/* Ambient Light - Overall scene illumination */}
      <ambientLight ref={ambientRef} intensity={0.7} />
      
      {/* Hemisphere light for natural sky/ground lighting */}
      <hemisphereLight
        ref={hemiRef}
        args={['#ffffff', '#444444', 0.5]}
        position={[0, 10, 0]}
      />
      
      {/* Single spot light for dramatic effect */}
      <spotLight
        ref={spotLightRef}
        position={[0, 12, 10]}
        angle={0.4}
        penumbra={1}
        intensity={1.2}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      
      {/* Spotlight target */}
      <primitive object={spotTarget} />
      
      {/* Main Yellow Spotlight - fixed on front wall, wide angle to cover whole car */}
      <spotLight
        ref={sunSpotRef}
        position={[0, 8, 15]}
        target={spotTarget}
        angle={1.2}
        penumbra={0.8}
        intensity={0}
        color="#FFD700"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        distance={40}
        decay={0.8}
      />
      
      {/* Secondary Yellow Spotlight - even wider for full coverage */}
      <spotLight
        ref={sunSpot2Ref}
        position={[0, 10, 15]}
        target={spotTarget}
        angle={1.4}
        penumbra={1}
        intensity={0}
        color="#FFA500"
        distance={45}
        decay={0.5}
      />
      
      {/* Point light close to car for direct illumination */}
      <pointLight
        position={[0, 2, 0]}
        intensity={spotlightMode ? 5 : 0}
        color="#FFD700"
        distance={15}
        decay={1.5}
      />
      
      {/* Additional point lights to cover entire car */}
      <pointLight
        position={[3, 1, 0]}
        intensity={spotlightMode ? 3 : 0}
        color="#FFD700"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[-3, 1, 0]}
        intensity={spotlightMode ? 3 : 0}
        color="#FFD700"
        distance={10}
        decay={2}
      />
    </>
  );
};

export default Lighting;
