import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { getLocalStorage, setLocalStorage } from '../../lib/utils';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  worldState?: string;
}

export default function JournalModal({ isOpen, onClose }: JournalModalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [entryTitle, setEntryTitle] = useState('');

  useEffect(() => {
    // Load journal entries from localStorage
    const savedEntries = getLocalStorage('worldLoreEntries') || [];
    setEntries(savedEntries);
  }, []);

  const saveEntry = () => {
    if (!newEntry.trim() || !entryTitle.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      title: entryTitle,
      content: newEntry,
      worldState: 'Created during world building session'
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    setLocalStorage('worldLoreEntries', updatedEntries);
    
    setNewEntry('');
    setEntryTitle('');
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    setLocalStorage('worldLoreEntries', updatedEntries);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-blue-400">
            📖 World Lore Book
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="write" className="h-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="write" className="text-white">Write New Entry</TabsTrigger>
            <TabsTrigger value="read" className="text-white">Read Entries ({entries.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="space-y-4 p-4">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Entry title (e.g., 'The Golden Valley', 'My First Tree')"
                value={entryTitle}
                onChange={(e) => setEntryTitle(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400"
              />
              
              <Textarea
                placeholder="Write about your world... What did you create today? How does it make you feel? What does this place represent in your journey?"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="min-h-[200px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
              />
              
              <div className="flex gap-3">
                <Button
                  onClick={saveEntry}
                  disabled={!newEntry.trim() || !entryTitle.trim()}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  Save Entry
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="read" className="space-y-4 p-4 max-h-[60vh] overflow-y-auto">
            {entries.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-lg mb-2">Your lore book is empty</p>
                <p className="text-sm">Start writing about your world to preserve its stories</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card key={entry.id} className="bg-gray-800 border-gray-600 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-blue-400">{entry.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{entry.date}</span>
                        <Button
                          onClick={() => deleteEntry(entry.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {entry.content}
                    </p>
                    {entry.worldState && (
                      <div className="mt-2 text-xs text-gray-500 italic">
                        {entry.worldState}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t border-gray-700">
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Close
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
