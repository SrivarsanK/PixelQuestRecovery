export interface SaveData {
  version: string;
  timestamp: number;
  playerProgress: any;
  worldData: any;
  settings: {
    soundEnabled: boolean;
    musicVolume: number;
    sfxVolume: number;
  };
}

export function createSaveData(): SaveData {
  const playerProgress = JSON.parse(localStorage.getItem('playerProgress') || '{}');
  const worldData = JSON.parse(localStorage.getItem('worldData') || '{}');
  
  return {
    version: '1.0.0',
    timestamp: Date.now(),
    playerProgress,
    worldData,
    settings: {
      soundEnabled: !JSON.parse(localStorage.getItem('audioMuted') || 'true'),
      musicVolume: 0.3,
      sfxVolume: 0.5
    }
  };
}

export function loadSaveData(saveData: SaveData): boolean {
  try {
    if (saveData.playerProgress) {
      localStorage.setItem('playerProgress', JSON.stringify(saveData.playerProgress));
    }
    
    if (saveData.worldData) {
      localStorage.setItem('worldData', JSON.stringify(saveData.worldData));
    }
    
    if (saveData.settings) {
      localStorage.setItem('audioMuted', JSON.stringify(!saveData.settings.soundEnabled));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to load save data:', error);
    return false;
  }
}

export function exportSave(): string {
  const saveData = createSaveData();
  return JSON.stringify(saveData, null, 2);
}

export function importSave(saveString: string): boolean {
  try {
    const saveData: SaveData = JSON.parse(saveString);
    return loadSaveData(saveData);
  } catch (error) {
    console.error('Failed to import save data:', error);
    return false;
  }
}

export function clearSaveData(): void {
  const keysToRemove = [
    'playerProgress',
    'worldData',
    'worldLoreEntries',
    'audioMuted'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('All save data cleared');
}

export function getSaveDataSize(): number {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length;
    }
  }
  return total;
}
