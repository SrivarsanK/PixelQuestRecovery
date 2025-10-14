import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import WorldBuilder from './WorldBuilder';
import LifeSimulation from './LifeSimulation';
import GameUI from './UI/GameUI';
import { useWorldState } from '../lib/stores/useWorldState';
import { usePlayerProgress } from '../lib/stores/usePlayerProgress';

type GameMode = 'world-builder' | 'life-simulation';

export default function Game() {
  const [gameMode, setGameMode] = useState<GameMode>('world-builder');
  const { initializeWorld } = useWorldState();
  const { initializeProgress } = usePlayerProgress();

  useEffect(() => {
    // Initialize game state
    initializeWorld();
    initializeProgress();
  }, []);

  const toggleMode = () => {
    setGameMode(prev => prev === 'world-builder' ? 'life-simulation' : 'world-builder');
  };

  return (
    <>
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 1
      }}>
        {gameMode === 'world-builder' ? (
          <WorldBuilder />
        ) : (
          <Canvas
            camera={{
              position: [0, 10, 15],
              fov: 45,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: false, // Pixel art style
              powerPreference: "default"
            }}
          >
            <color attach="background" args={["#87CEEB"]} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <LifeSimulation />
          </Canvas>
        )}
      </div>
      
      <GameUI 
        gameMode={gameMode}
        onToggleMode={toggleMode}
      />
    </>
  );
}
