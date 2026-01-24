
import React, { useState } from 'react';
import { audioService } from '../AudioService';

interface CupOfFateProps {
  soundEnabled: boolean;
}

const CupOfFate: React.FC<CupOfFateProps> = ({ soundEnabled }) => {
  const [items, setItems] = useState(['Yes', 'No', 'Maybe']);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCup, setSelectedCup] = useState<number | null>(null);
  const [shuffledIndices, setShuffledIndices] = useState([0, 1, 2]);

  const shuffle = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    setSelectedCup(null);

    // Visual shuffle simulation
    let count = 0;
    const interval = setInterval(() => {
      setShuffledIndices(prev => [...prev].sort(() => Math.random() - 0.5));
      if (soundEnabled) audioService.playTick(100 + Math.random() * 50);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setIsShuffling(false);
      }
    }, 120);
  };

  const pickCup = (idx: number) => {
    if (isShuffling || selectedCup !== null) return;
    setSelectedCup(idx);
    if (soundEnabled) audioService.playTick(600);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl mb-12 gold-text uppercase tracking-widest">Cup of Fate</h2>

      <div className="flex gap-8 mb-20 h-44 items-end">
        {shuffledIndices.map((originalIdx, visualIdx) => (
          <div key={visualIdx} className="relative group cursor-pointer" onClick={() => pickCup(visualIdx)}>
             <div 
               className={`w-28 h-36 bg-[#111] border-4 border-[#d4af37] rounded-t-[3rem] transition-all duration-500 flex flex-col items-center justify-center shadow-2xl
               ${selectedCup === visualIdx ? '-translate-y-24 shadow-[0_30px_60px_rgba(212,175,55,0.2)]' : ''}
               ${isShuffling ? 'animate-bounce' : ''}
               hover:border-white`}
             >
               <span className="text-4xl gold-text font-serif drop-shadow-lg">?</span>
             </div>
             {selectedCup === visualIdx && (
               <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center animate-in zoom-in duration-300">
                 <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 mb-2">The Hidden Fate</p>
                 <span className="text-xl font-bold gold-text whitespace-nowrap uppercase tracking-widest drop-shadow-sm">
                   {items[originalIdx]}
                 </span>
               </div>
             )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-10 flex gap-2">
          {items.map((it, i) => (
            <input 
              key={i}
              value={it}
              onChange={e => {
                const newItems = [...items];
                newItems[i] = e.target.value;
                setItems(newItems);
              }}
              className="w-full bg-[#050505] border border-gray-800 p-3 text-xs outline-none focus:border-[#d4af37] text-white rounded-sm text-center"
            />
          ))}
        </div>

        <button 
          onClick={shuffle}
          disabled={isShuffling}
          className="w-full py-5 bg-[#d4af37] text-black font-bold uppercase tracking-[0.2em] hover:bg-[#b5a642] disabled:opacity-50 transition-all shadow-lg active:scale-95"
        >
          {isShuffling ? 'Cups are Moving...' : 'Initiate Shuffle'}
        </button>
      </div>
    </div>
  );
};

export default CupOfFate;
