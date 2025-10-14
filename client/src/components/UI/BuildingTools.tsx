import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { usePlayerProgress } from '../../lib/stores/usePlayerProgress';

type BuildingTool = 'terrain' | 'nature' | 'structures' | 'decorations';

export default function BuildingTools() {
  const [selectedTool, setSelectedTool] = useState<BuildingTool>('terrain');
  const [brushSize, setBrushSize] = useState(2);
  const { lifeEnergy, streak } = usePlayerProgress();

  const tools = [
    {
      id: 'terrain' as BuildingTool,
      name: 'Terrain',
      icon: '🏞️',
      cost: 1,
      unlocked: true
    },
    {
      id: 'nature' as BuildingTool,
      name: 'Nature',
      icon: '🌳',
      cost: 2,
      unlocked: streak >= 3
    },
    {
      id: 'structures' as BuildingTool,
      name: 'Structures',
      icon: '🏠',
      cost: 5,
      unlocked: streak >= 7
    },
    {
      id: 'decorations' as BuildingTool,
      name: 'Decorations',
      icon: '✨',
      cost: 3,
      unlocked: streak >= 5
    }
  ];

  return (
    <Card className="bg-black/70 border-white/20 p-3">
      <div className="space-y-3">
        <div className="text-white text-sm font-bold mb-2">Building Tools</div>
        
        {/* Tool Selection */}
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              disabled={!tool.unlocked || lifeEnergy < tool.cost}
              variant={selectedTool === tool.id ? 'default' : 'outline'}
              size="sm"
              className={`
                ${selectedTool === tool.id 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'border-white/40 hover:bg-white/10'
                }
                ${!tool.unlocked ? 'opacity-50' : ''}
                text-xs
              `}
            >
              <span className="mr-1">{tool.icon}</span>
              {tool.name}
              <span className="ml-1 text-xs">({tool.cost})</span>
            </Button>
          ))}
        </div>
        
        {/* Brush Size */}
        <div className="space-y-2">
          <label className="text-white text-xs">Brush Size</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(size => (
              <Button
                key={size}
                onClick={() => setBrushSize(size)}
                variant={brushSize === size ? 'default' : 'outline'}
                size="sm"
                className={`
                  w-8 h-8 p-0 text-xs
                  ${brushSize === size 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'border-white/40 hover:bg-white/10'
                  }
                `}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Tool Info */}
        <div className="text-xs text-gray-300">
          {selectedTool === 'terrain' && 'Paint the landscape'}
          {selectedTool === 'nature' && streak < 3 && 'Unlock at 3-day streak'}
          {selectedTool === 'structures' && streak < 7 && 'Unlock at 7-day streak'}
          {selectedTool === 'decorations' && streak < 5 && 'Unlock at 5-day streak'}
        </div>
      </div>
    </Card>
  );
}
