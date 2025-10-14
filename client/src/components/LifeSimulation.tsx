import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useWorldState } from '../lib/stores/useWorldState';
import { usePlayerProgress } from '../lib/stores/usePlayerProgress';
import WorldRenderer from '../lib/gameEngine/WorldRenderer';
import Player from '../lib/gameEngine/Player';
import * as THREE from 'three';

enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  interact = 'interact'
}

export default function LifeSimulation() {
  const { worldData } = useWorldState();
  const { streak } = usePlayerProgress();
  const [, getKeys] = useKeyboardControls<Controls>();
  
  const playerRef = useRef<THREE.Group>(null);
  const worldRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const controls = getKeys();
    
    if (playerRef.current) {
      const speed = 5 * delta;
      const player = playerRef.current;
      
      // Handle movement
      if (controls.forward) {
        player.position.z -= speed;
      }
      if (controls.backward) {
        player.position.z += speed;
      }
      if (controls.leftward) {
        player.position.x -= speed;
      }
      if (controls.rightward) {
        player.position.x += speed;
      }
      
      // Keep player on ground
      player.position.y = Math.max(0.5, player.position.y);
      
      // Update camera to follow player
      state.camera.position.lerp(
        new THREE.Vector3(
          player.position.x,
          player.position.y + 8,
          player.position.z + 12
        ),
        0.1
      );
      state.camera.lookAt(player.position);
    }
  });

  return (
    <>
      {/* World terrain and objects */}
      <group ref={worldRef}>
        <WorldRenderer worldData={worldData} streak={streak} />
      </group>
      
      {/* Player character */}
      <group ref={playerRef} position={[0, 0.5, 0]}>
        <Player />
      </group>
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200, 32, 32]} />
        <meshLambertMaterial 
          color={new THREE.Color().setHSL(0.3, 0.4 * (streak / 30), 0.3 + (streak / 100))} 
          wireframe={false}
        />
      </mesh>
    </>
  );
}
