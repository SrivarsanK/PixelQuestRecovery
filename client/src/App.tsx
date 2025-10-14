import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import Game from "./components/Game";
import SoundManager from "./components/Audio/SoundManager";
import "@fontsource/inter";

// Define control keys for the game
enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  interact = 'interact',
  menu = 'menu',
  build = 'build',
  journal = 'journal'
}

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.interact, keys: ["KeyE", "Space"] },
  { name: Controls.menu, keys: ["Escape"] },
  { name: Controls.build, keys: ["KeyB"] },
  { name: Controls.journal, keys: ["KeyJ"] }
];

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      const loadingElement = document.getElementById('loading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return null; // Loading screen is handled in HTML
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3a 100%)'
    }}>
      <KeyboardControls map={controls}>
        <Suspense fallback={<div>Loading game...</div>}>
          <Game />
          <SoundManager />
        </Suspense>
      </KeyboardControls>
    </div>
  );
}

export default App;
