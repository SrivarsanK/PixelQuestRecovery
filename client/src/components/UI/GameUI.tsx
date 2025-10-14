import { useState } from 'react';
import { usePlayerProgress } from '../../lib/stores/usePlayerProgress';
import { useWorldState } from '../../lib/stores/useWorldState';
import CheckInModal from './CheckInModal';
import JournalModal from './JournalModal';
import BuildingTools from './BuildingTools';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface GameUIProps {
  gameMode: 'world-builder' | 'life-simulation';
  onToggleMode: () => void;
}

export default function GameUI({ gameMode, onToggleMode }: GameUIProps) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const { lifeEnergy, streak, lastCheckIn } = usePlayerProgress();
  const { worldData } = useWorldState();

  const canCheckIn = () => {
    if (!lastCheckIn) return true;
    const hoursSinceLastCheckIn = (Date.now() - lastCheckIn) / (1000 * 60 * 60);
    return hoursSinceLastCheckIn >= 1; // Can check in every hour
  };

  return (
    <>
      {/* Top HUD */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        {/* Left side - Stats */}
        <Card className="p-4 bg-black/70 text-white border-white/20">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-lg font-bold">{lifeEnergy} Life Energy</span>
            </div>
            <div className="text-sm text-gray-300">
              Streak: {streak} days
            </div>
            <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all"
                style={{ width: `${Math.min(100, (lifeEnergy / 100) * 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Right side - Mode toggle */}
        <Card className="p-2 bg-black/70 border-white/20">
          <Button 
            onClick={onToggleMode}
            variant="outline"
            className="text-white border-white/40 hover:bg-white/10"
          >
            {gameMode === 'world-builder' ? 'Enter World' : 'Build Mode'}
          </Button>
        </Card>
      </div>

      {/* Bottom HUD */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        {/* Left side - Building tools (only in world-builder mode) */}
        {gameMode === 'world-builder' && (
          <BuildingTools />
        )}

        {/* Right side - Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCheckIn(true)}
            disabled={!canCheckIn()}
            className={`${
              canCheckIn() 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canCheckIn() ? 'Harvest Energy' : 'Energy Harvested'}
          </Button>
          
          <Button
            onClick={() => setShowJournal(true)}
            variant="outline"
            className="text-white border-white/40 hover:bg-white/10"
          >
            World Lore
          </Button>
        </div>
      </div>

      {/* Instructions overlay */}
      {gameMode === 'world-builder' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          textAlign: 'center',
          color: 'white',
          pointerEvents: 'none',
          opacity: lifeEnergy > 0 ? 0.7 : 1
        }}>
          {lifeEnergy > 0 ? (
            <p className="text-lg">Click to paint your world with creative energy</p>
          ) : (
            <div>
              <p className="text-xl mb-2">Your world awaits your creative touch</p>
              <p className="text-sm text-gray-300">Harvest life energy to begin painting</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CheckInModal 
        isOpen={showCheckIn} 
        onClose={() => setShowCheckIn(false)} 
      />
      <JournalModal 
        isOpen={showJournal} 
        onClose={() => setShowJournal(false)} 
      />
    </>
  );
}
