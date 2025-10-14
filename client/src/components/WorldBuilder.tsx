import { useRef, useEffect, useState } from 'react';
import { useWorldState } from '../lib/stores/useWorldState';
import { usePlayerProgress } from '../lib/stores/usePlayerProgress';
import TerrainPainter from '../lib/gameEngine/TerrainPainter';
import { getVibrancyMultiplier } from '../lib/utils/colorUtils';

export default function WorldBuilder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [terrainPainter, setTerrainPainter] = useState<TerrainPainter | null>(null);
  const { worldData, updateTerrain } = useWorldState();
  const { streak, lifeEnergy } = usePlayerProgress();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize terrain painter
    const painter = new TerrainPainter(canvas, {
      onTerrainUpdate: updateTerrain,
      vibrancyMultiplier: getVibrancyMultiplier(streak)
    });
    
    setTerrainPainter(painter);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      painter.cleanup();
    };
  }, [updateTerrain, streak]);

  useEffect(() => {
    if (terrainPainter) {
      terrainPainter.setVibrancyMultiplier(getVibrancyMultiplier(streak));
      terrainPainter.render();
    }
  }, [terrainPainter, streak]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!terrainPainter || lifeEnergy <= 0) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    terrainPainter.paint(x, y);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          cursor: lifeEnergy > 0 ? 'crosshair' : 'not-allowed',
          display: 'block'
        }}
      />
      
      {/* Creative essence particle effects */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background: lifeEnergy > 50 ? 
            'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)' :
            'none'
        }}
      />
    </div>
  );
}
