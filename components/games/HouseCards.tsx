
import React, { useState } from 'react';
import { audioService } from '../AudioService';

interface HouseCardsProps {
  soundEnabled: boolean;
}

const HouseCards: React.FC<HouseCardsProps> = ({ soundEnabled }) => {
  const [items, setItems] = useState<string[]>(['Prize A', 'Prize B', 'Prize C']);
  const [newItem, setNewItem] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const startReveal = () => {
    if (items.length < 2 || isRevealing) return;
    setIsRevealing(true);
    setRevealed(false);
    setSelectedIdx(null);

    let shuffleCount = 0;
    const shuffleInterval = window.setInterval(() => {
        if (soundEnabled) audioService.playCardShuffle();
        shuffleCount++;
        if (shuffleCount >= 10) clearInterval(shuffleInterval);
    }, 150);

    setTimeout(() => {
      const idx = Math.floor(Math.random() * items.length);
      setSelectedIdx(idx);
      setIsRevealing(false);
      setRevealed(true);
      if (soundEnabled) audioService.playTick(400);
    }, 2000);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      // Fixed: Removed non-existent setNewOption call which caused a compilation error
      setNewItem('');
      setRevealed(false);
      setSelectedIdx(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl mb-8 gold-text uppercase tracking-widest">House Cards</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-12 min-h-[250px] w-full items-center">
        {isRevealing ? (
          <div className="flex gap-4 animate-pulse">
             {[1,2,3].map(i => (
                <div key={i} className="w-24 h-36 bg-[#1a1a1a] border-2 border-[#d4af37]/40 rounded-lg flex items-center justify-center text-3xl shadow-xl">🎴</div>
             ))}
          </div>
        ) : revealed && selectedIdx !== null ? (
          <div className="w-52 h-72 bg-[#1a1a1a] border-4 border-[#d4af37] rounded-xl flex flex-col items-center justify-center p-6 card-shadow animate-in zoom-in duration-500 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
             <span className="text-5xl mb-6">🃏</span>
             <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-4">The Chosen Card</p>
             <h3 className="text-2xl font-bold gold-text text-center uppercase drop-shadow-sm">{items[selectedIdx]}</h3>
          </div>
        ) : (
          <div className="text-center opacity-30 italic text-sm tracking-widest">
            "Prepare the deck with potential fates."
          </div>
        )}
      </div>

      <div className="w-full max-w-sm">
        <button 
          onClick={startReveal}
          disabled={isRevealing || items.length < 2}
          className="w-full py-5 bg-[#d4af37] text-black font-bold uppercase tracking-[0.2em] hover:bg-[#b5a642] mb-8 disabled:opacity-20 transition-all shadow-lg active:scale-95"
        >
          {isRevealing ? 'Dealer is Shuffling...' : 'Draw Your Fate'}
        </button>

        <form onSubmit={addItem} className="flex gap-2 mb-4">
          <input 
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Outcome..."
            className="flex-grow bg-[#050505] border border-gray-800 p-3 text-sm focus:border-[#d4af37] outline-none text-white rounded-sm"
          />
          <button className="px-6 border border-gray-800 hover:border-[#d4af37] gold-text">+</button>
        </form>

        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 custom-scrollbar">
          {items.map((item, i) => (
            <div key={i} className="px-3 py-1 bg-[#0a0a0a] border border-gray-800 text-[10px] uppercase tracking-wider flex items-center gap-2 rounded-sm">
              {item}
              <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-gray-500 hover:text-red-500">×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HouseCards;
