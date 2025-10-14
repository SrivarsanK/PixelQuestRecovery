import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePlayerProgress } from '../stores/usePlayerProgress';
import * as THREE from 'three';

export default function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { streak, lifeEnergy } = usePlayerProgress();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Subtle rotation
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Player becomes more vibrant with progress
  const playerColor = new THREE.Color().setHSL(
    0.6, // Blue-ish hue
    0.3 + (streak / 30) * 0.7, // More saturated with streak
    0.4 + (lifeEnergy / 100) * 0.4 // Brighter with energy
  );

  return (
    <group>
      {/* Main player body */}
      <mesh ref={meshRef}>
        <capsuleGeometry args={[0.3, 1.2]} />
        <meshLambertMaterial color={playerColor} />
      </mesh>
      
      {/* Energy aura when high energy */}
      {lifeEnergy > 50 && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.8]} />
          <meshBasicMaterial 
            color={new THREE.Color().setHSL(0.15, 1, 0.5)}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
      
      {/* Shadow */}
      <mesh position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4]} />
        <meshBasicMaterial 
          color={0x000000}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
