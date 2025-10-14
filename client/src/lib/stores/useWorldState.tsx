import { create } from 'zustand';
import { getLocalStorage, setLocalStorage } from '../utils';

export interface TerrainData {
  x: number;
  y: number;
  color: string;
  type: 'grass' | 'water' | 'mountain' | 'forest';
  timestamp: number;
}

export interface WorldObject {
  id: string;
  x: number;
  y: number;
  type: 'tree' | 'house' | 'decoration';
  variant: number;
  created: number;
}

export interface WorldData {
  terrain: TerrainData[];
  objects: WorldObject[];
  lastSaved: number;
}

interface WorldState {
  worldData: WorldData;
  isDirty: boolean;
  
  // Actions
  initializeWorld: () => void;
  updateTerrain: (terrain: TerrainData[]) => void;
  addObject: (object: Omit<WorldObject, 'id' | 'created'>) => void;
  removeObject: (id: string) => void;
  saveWorld: () => void;
}

export const useWorldState = create<WorldState>((set, get) => ({
  worldData: {
    terrain: [],
    objects: [],
    lastSaved: 0
  },
  isDirty: false,

  initializeWorld: () => {
    const savedWorld = getLocalStorage('worldData');
    if (savedWorld) {
      set({ 
        worldData: savedWorld,
        isDirty: false 
      });
    } else {
      // Initialize with a small starting area
      const initialTerrain: TerrainData[] = [];
      const centerX = 400;
      const centerY = 300;
      
      // Create a small gray starting island
      for (let x = -20; x <= 20; x++) {
        for (let y = -20; y <= 20; y++) {
          if (x * x + y * y <= 400) { // Circular area
            initialTerrain.push({
              x: centerX + x * 4,
              y: centerY + y * 4,
              color: `hsl(0, 0%, ${20 + Math.random() * 10}%)`,
              type: 'grass',
              timestamp: Date.now()
            });
          }
        }
      }
      
      set({
        worldData: {
          terrain: initialTerrain,
          objects: [],
          lastSaved: Date.now()
        },
        isDirty: false
      });
    }
  },

  updateTerrain: (terrain: TerrainData[]) => {
    const { worldData } = get();
    set({
      worldData: {
        ...worldData,
        terrain: [...worldData.terrain, ...terrain]
      },
      isDirty: true
    });
    
    // Auto-save every 30 seconds when dirty
    setTimeout(() => {
      get().saveWorld();
    }, 30000);
  },

  addObject: (objectData) => {
    const { worldData } = get();
    const newObject: WorldObject = {
      ...objectData,
      id: `${Date.now()}-${Math.random()}`,
      created: Date.now()
    };
    
    set({
      worldData: {
        ...worldData,
        objects: [...worldData.objects, newObject]
      },
      isDirty: true
    });
  },

  removeObject: (id: string) => {
    const { worldData } = get();
    set({
      worldData: {
        ...worldData,
        objects: worldData.objects.filter(obj => obj.id !== id)
      },
      isDirty: true
    });
  },

  saveWorld: () => {
    const { worldData } = get();
    const updatedWorld = {
      ...worldData,
      lastSaved: Date.now()
    };
    
    setLocalStorage('worldData', updatedWorld);
    set({
      worldData: updatedWorld,
      isDirty: false
    });
    
    console.log('World saved successfully');
  }
}));
