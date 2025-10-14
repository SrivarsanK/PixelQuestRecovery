import { create } from 'zustand';
import { getLocalStorage, setLocalStorage } from '../utils';

interface PlayerProgress {
  lifeEnergy: number;
  streak: number;
  lastCheckIn: number | null;
  totalEnergyEarned: number;
  checkInHistory: Array<{
    date: number;
    hoursReported: number;
    energyGained: number;
  }>;
}

interface PlayerProgressState extends PlayerProgress {
  // Actions
  initializeProgress: () => void;
  addLifeEnergy: (amount: number) => void;
  spendLifeEnergy: (amount: number) => boolean;
  incrementStreak: () => void;
  resetStreak: () => void; // For compassionate handling of relapses
  addCheckIn: (hoursReported: number, energyGained: number) => void;
}

export const usePlayerProgress = create<PlayerProgressState>((set, get) => ({
  lifeEnergy: 0,
  streak: 0,
  lastCheckIn: null,
  totalEnergyEarned: 0,
  checkInHistory: [],

  initializeProgress: () => {
    const saved = getLocalStorage('playerProgress');
    if (saved) {
      set(saved);
    } else {
      // Give new players a small amount to start with
      set({
        lifeEnergy: 10,
        streak: 0,
        lastCheckIn: null,
        totalEnergyEarned: 10,
        checkInHistory: []
      });
    }
  },

  addLifeEnergy: (amount: number) => {
    const current = get();
    const updated = {
      ...current,
      lifeEnergy: current.lifeEnergy + amount,
      totalEnergyEarned: current.totalEnergyEarned + amount
    };
    
    set(updated);
    setLocalStorage('playerProgress', updated);
  },

  spendLifeEnergy: (amount: number) => {
    const current = get();
    if (current.lifeEnergy >= amount) {
      const updated = {
        ...current,
        lifeEnergy: current.lifeEnergy - amount
      };
      
      set(updated);
      setLocalStorage('playerProgress', updated);
      return true;
    }
    return false;
  },

  incrementStreak: () => {
    const current = get();
    const updated = {
      ...current,
      streak: current.streak + 1,
      lastCheckIn: Date.now()
    };
    
    set(updated);
    setLocalStorage('playerProgress', updated);
    
    console.log(`Streak increased to ${updated.streak} days!`);
  },

  resetStreak: () => {
    const current = get();
    // Compassionate reset - reduce streak by half instead of resetting to 0
    const newStreak = Math.floor(current.streak / 2);
    const updated = {
      ...current,
      streak: newStreak
    };
    
    set(updated);
    setLocalStorage('playerProgress', updated);
    
    console.log(`Streak compassionately reduced to ${newStreak} days`);
  },

  addCheckIn: (hoursReported: number, energyGained: number) => {
    const current = get();
    const checkIn = {
      date: Date.now(),
      hoursReported,
      energyGained
    };
    
    const updated = {
      ...current,
      checkInHistory: [checkIn, ...current.checkInHistory].slice(0, 30) // Keep last 30 check-ins
    };
    
    set(updated);
    setLocalStorage('playerProgress', updated);
  }
}));
