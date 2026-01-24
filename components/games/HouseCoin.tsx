
import React, { useState } from 'react';
import { audioService } from '../AudioService';

interface HouseCoinProps {
  soundEnabled: boolean;
}

const HouseCoin: React.FC<HouseCoinProps> = ({ soundEnabled }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'HEADS' | 'TAILS' | null>(null);
  const [headsLabel, setHeadsLabel] = useState('Heads');
  const [tailsLabel, setTailsLabel] = useState('Tails');
  const [rotation, setRotation] = useState(0);

  const flip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);
    if (soundEnabled) audioService.playCoinFlip();
    
    // Generate the final outcome immediately but show it later
    const outcome = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
    
    // Rotation logic:
    // Even * 180 results in Side A (Heads)
    // Odd * 180 results in Side B (Tails)
    const baseSpins = 10; // At least 5 full rotations
    const randomExtra = Math.floor(Math.random() * 4) * 2; // Keep it even to preserve side parity
    
    // To land on TAILS, we need an ODD number of 180-degree turns
    // To land on HEADS, we need an EVEN number of 180-degree turns
    const targetSideTurn = outcome === 'TAILS' ? 1 : 0;
    const totalHalfTurns = baseSpins + randomExtra + targetSideTurn;
    const targetRotation = totalHalfTurns * 180;
    
    // Since rotation is cumulative, we add to the current one
    // But we need to make sure the NEW total rotation ends on the correct parity relative to 0
    // Simplest: set rotation directly to a high value that matches the outcome
    const newTotalRotation = (Math.floor(rotation / 360) + 10) * 360 + (outcome === 'TAILS' ? 180 : 0);
    setRotation(newTotalRotation);

    setTimeout(() => {
      setIsFlipping(false);
      setResult(outcome);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl mb-8 gold-text uppercase tracking-widest">House Coin</h2>

      <div className="relative w-56 h-56 mb-12" style={{ perspective: '1200px' }}>
        <div 
          className="w-full h-full relative transition-transform duration-[2000ms] ease-out"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)` 
          }}
        >
          {/* Front (Side A) */}
          <div className="absolute inset-0 w-full h-full bg-[#d4af37] rounded-full border-8 border-[#b5a642] flex items-center justify-center backface-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]" style={{ backfaceVisibility: 'hidden' }}>
            <div className="w-44 h-44 rounded-full border-2 border-black/10 flex flex-col items-center justify-center">
              <span className="text-6xl mb-2 filter drop-shadow-md">🦅</span>
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-black/40 text-center px-4 truncate max-w-full">
                {headsLabel}
              </span>
            </div>
          </div>
          {/* Back (Side B) */}
          <div className="absolute inset-0 w-full h-full bg-[#b5a642] rounded-full border-8 border-[#d4af37] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
            <div className="w-44 h-44 rounded-full border-2 border-black/10 flex flex-col items-center justify-center">
              <span className="text-6xl mb-2 filter drop-shadow-md">⚖️</span>
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-black/40 text-center px-4 truncate max-w-full">
                {tailsLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center w-full max-w-sm">
        <div className="mb-8 min-h-[90px] flex items-center justify-center">
          {result && !isFlipping && (
            <div className="animate-in zoom-in duration-500">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 block mb-2">Final Verdict</span>
              <h3 className="text-4xl font-bold gold-text tracking-widest uppercase">
                {result === 'HEADS' ? headsLabel : tailsLabel}
              </h3>
            </div>
          )}
          {isFlipping && <p className="text-gray-500 animate-pulse italic tracking-widest text-sm">"Fate is in the air..."</p>}
          {!isFlipping && !result && <p className="text-gray-500 italic text-sm">"The House awaits your call."</p>}
        </div>

        <button 
          onClick={flip}
          disabled={isFlipping}
          className="w-full py-5 bg-[#d4af37] text-black font-bold uppercase tracking-[0.2em] transition-all hover:bg-[#b5a642] disabled:opacity-50 shadow-lg active:scale-95"
        >
          {isFlipping ? 'The Toss is Made...' : 'Flip the Coin'}
        </button>

        <div className="mt-12 grid grid-cols-2 gap-4">
           <div className="space-y-1">
             <label className="text-[9px] uppercase tracking-widest text-gray-600 block text-left ml-1">Heads Side Label</label>
             <input 
               value={headsLabel} 
               onChange={e => setHeadsLabel(e.target.value)}
               className="w-full bg-[#0a0a0a] border border-gray-800 p-2 text-xs text-white outline-none focus:border-[#d4af37] rounded-sm"
               placeholder="Heads"
             />
           </div>
           <div className="space-y-1">
             <label className="text-[9px] uppercase tracking-widest text-gray-600 block text-left ml-1">Tails Side Label</label>
             <input 
               value={tailsLabel} 
               onChange={e => setTailsLabel(e.target.value)}
               className="w-full bg-[#0a0a0a] border border-gray-800 p-2 text-xs text-white outline-none focus:border-[#d4af37] rounded-sm"
               placeholder="Tails"
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default HouseCoin;
