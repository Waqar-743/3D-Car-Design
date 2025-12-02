import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Preload textures
useTexture.preload('/img/f1-from-left-far.png');
useTexture.preload('/img/from-right.png');
useTexture.preload('/img/from-right-close.png');

interface WallDecorationProps {
  imagePath?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number];
}

export const WallDecoration: React.FC<WallDecorationProps> = ({
  imagePath = '/img/f1-from-left-far.png',
  position = [-12.4, 5, -5], // On the left wall
  rotation = [0, Math.PI / 2, 0], // Facing inward
  scale = [10, 6],
}) => {
  // Load the texture
  const texture = useTexture(imagePath);
  
  // Configure texture for best quality
  useMemo(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);
  
  return (
    <group position={position} rotation={rotation}>
      {/* Main image plane - transparent, no border */}
      <mesh>
        <planeGeometry args={scale} />
        <meshBasicMaterial 
          map={texture} 
          side={THREE.FrontSide}
          transparent={true}
          opacity={0.35}
        />
      </mesh>
    </group>
  );
};

// Second wall decoration on back wall
export const BackWallDecoration: React.FC<WallDecorationProps> = ({
  imagePath = '/img/from-right.png',
  position = [6, 5, -14.9], // On the back wall, right side
  rotation = [0, 0, 0], // Facing forward
  scale = [8, 5],
}) => {
  // Load the texture
  const texture = useTexture(imagePath);
  
  // Configure texture for best quality
  useMemo(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);
  
  return (
    <group position={position} rotation={rotation}>
      {/* Main image plane - transparent, no border */}
      <mesh>
        <planeGeometry args={scale} />
        <meshBasicMaterial 
          map={texture} 
          side={THREE.FrontSide}
          transparent={true}
          opacity={0.35}
        />
      </mesh>
    </group>
  );
};

// Corner decoration - larger hero image
export const CornerWallDecoration: React.FC<WallDecorationProps> = ({
  imagePath = '/img/from-right-close.png',
  position = [-6, 5, -14.9], // Back wall, left side
  rotation = [0, 0, 0],
  scale = [8, 5],
}) => {
  const texture = useTexture(imagePath);
  
  useMemo(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);
  
  return (
    <group position={position} rotation={rotation}>
      {/* Main image - transparent, no border */}
      <mesh>
        <planeGeometry args={scale} />
        <meshBasicMaterial 
          map={texture} 
          side={THREE.FrontSide}
          transparent={true}
          opacity={0.35}
        />
      </mesh>
    </group>
  );
};

export default WallDecoration;
