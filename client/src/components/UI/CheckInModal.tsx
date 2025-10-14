import { useState } from 'react';
import { usePlayerProgress } from '../../lib/stores/usePlayerProgress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckInModal({ isOpen, onClose }: CheckInModalProps) {
  const [hoursOffSocial, setHoursOffSocial] = useState([1]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addLifeEnergy, incrementStreak } = usePlayerProgress();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate energy based on hours
    const hours = hoursOffSocial[0];
    const energyGained = Math.min(50, hours * 5); // Max 50 energy per check-in
    
    // Add energy and update streak
    addLifeEnergy(energyGained);
    incrementStreak();
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    onClose();
  };

  const hours = hoursOffSocial[0];
  const energyToGain = Math.min(50, hours * 5);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-yellow-400">
            Energy Harvesting Ritual
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          <p className="text-center text-gray-300">
            How many hours have you been away from social media scrolling?
          </p>
          
          <Card className="p-4 bg-gray-800 border-gray-600">
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-yellow-400">
                  {hours}
                </span>
                <span className="text-lg text-gray-300 ml-2">
                  {hours === 1 ? 'hour' : 'hours'}
                </span>
              </div>
              
              <Slider
                value={hoursOffSocial}
                onValueChange={setHoursOffSocial}
                max={24}
                min={1}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>1h</span>
                <span>24h</span>
              </div>
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-gray-300 mb-2">Energy to gain:</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xl font-bold text-yellow-400">
                +{energyToGain}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Harvesting...' : 'Harvest Energy'}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Energy harvesting helps fuel your world creation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
