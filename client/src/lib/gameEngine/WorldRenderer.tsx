import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { WorldData } from '../stores/useWorldState';
import * as THREE from 'three';

interface WorldRendererProps {
  worldData: WorldData;
  streak: number;
}

export default function WorldRenderer({ worldData, streak }: WorldRendererProps) {
  const grassTexture = useTexture('/textures/grass.png');
  const woodTexture = useTexture('/textures/wood.jpg');

  // Configure textures for pixel art
  useMemo(() => {
    [grassTexture, woodTexture].forEach(texture => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });
  }, [grassTexture, woodTexture]);

  // Generate world objects based on streak and terrain
  const worldObjects = useMemo(() => {
    const objects = [];
    const vibrancy = Math.min(1, streak / 30); // Full vibrancy at 30-day streak
    
    // Add trees based on terrain data
    worldData.terrain.forEach((terrain, index) => {
      if (index % 10 === 0 && streak >= 3) { // Trees unlock at 3-day streak
        const treeColor = new THREE.Color().setHSL(
          0.33, // Green hue
          0.5 + vibrancy * 0.4,
          0.3 + vibrancy * 0.3
        );
        
        objects.push(
          <group key={`tree-${index}`} position={[
            (terrain.x - 400) / 20, // Scale down for 3D world
            1,
            (terrain.y - 300) / 20
          ]}>
            {/* Tree trunk */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.3, 2]} />
              <meshLambertMaterial map={woodTexture} />
            </mesh>
            {/* Tree leaves */}
            <mesh position={[0, 1.5, 0]}>
              <sphereGeometry args={[1.2]} />
              <meshLambertMaterial color={treeColor} />
            </mesh>
          </group>
        );
      }
    });

    // Add houses based on streak
    if (streak >= 7) {
      for (let i = 0; i < Math.min(5, Math.floor(streak / 7)); i++) {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 8 + i * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const houseColor = new THREE.Color().setHSL(
          0.1 + i * 0.1,
          0.6 * vibrancy,
          0.5 + vibrancy * 0.3
        );
        
        objects.push(
          <group key={`house-${i}`} position={[x, 0.5, z]}>
            {/* House base */}
            <mesh>
              <boxGeometry args={[2, 2, 2]} />
              <meshLambertMaterial color={houseColor} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI/4, 0]}>
              <coneGeometry args={[1.6, 1.5, 4]} />
              <meshLambertMaterial color={new THREE.Color().setHSL(0, 0.8 * vibrancy, 0.3)} />
            </mesh>
          </group>
        );
      }
    }
    
    return objects;
  }, [worldData.terrain, streak, woodTexture]);

  return (
    <>
      {worldObjects}
      
      {/* Decorative elements that appear with higher streaks */}
      {streak >= 5 && (
        <>
          {/* Floating energy orbs */}
          {Array.from({ length: Math.min(10, streak) }, (_, i) => (
            <mesh
              key={`orb-${i}`}
              position={[
                Math.sin(i * 0.7) * 15,
                2 + Math.sin(Date.now() * 0.001 + i) * 0.5,
                Math.cos(i * 0.7) * 15
              ]}
            >
              <sphereGeometry args={[0.3]} />
              <meshBasicMaterial 
                color={new THREE.Color().setHSL(0.15, 1, 0.7)}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </>
      )}
    </>
  );
}
