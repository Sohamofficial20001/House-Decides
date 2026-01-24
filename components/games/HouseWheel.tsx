import React, { useState, useRef, useEffect } from 'react';
import { audioService } from '../AudioService';

interface HouseWheelProps {
  soundEnabled: boolean;
}

const HouseWheel: React.FC<HouseWheelProps> = ({ soundEnabled }) => {
  const [options, setOptions] = useState<string[]>(['Option A', 'Option B', 'Option C', 'Option D']);
  const [newOption, setNewOption] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Logic: Always generate 2N slices. For 2 options, we get 4 slices.
  // This ensures alternating colors (Green/Black) work perfectly even with small lists.
  const getVisualSlices = () => {
    if (options.length === 0) return [];
    // We double the list to ensure visual density and alternating colors
    const doubled = [...options, ...options];
    return doubled;
  };

  const visualSlices = getVisualSlices();
  const sliceCount = visualSlices.length;

  const spin = () => {
    if (isSpinning || options.length < 2) return;
    setIsSpinning(true);
    setWinner(null);

    // Audio cues for the "clack"
    if (soundEnabled) {
      let clackCount = 0;
      const totalClacks = 30;
      const clackInterval = setInterval(() => {
        if (clackCount < totalClacks) {
          audioService.playTick(200 + (clackCount * 5), 0.02);
          clackCount++;
        } else {
          clearInterval(clackInterval);
        }
      }, 100);
    }
    
    // Calculate a massive rotation
    const extraSpins = 10 + Math.random() * 10;
    const addedRotation = extraSpins * 360;
    const newRotation = rotation + addedRotation;
    
    setRotation(newRotation);

    // Wait for transition to finish (5s matching CSS)
    setTimeout(() => {
      setIsSpinning(false);
      
      // Calculate winner
      const degree = newRotation % 360;
      const sliceAngle = 360 / sliceCount;
      // 0 deg is the top. Rotation is clockwise.
      // To find what's at the top (pointer), we invert the rotation.
      const normalizedDegree = (360 - (degree % 360)) % 360;
      const index = Math.floor(normalizedDegree / sliceAngle);
      setWinner(visualSlices[index]);
    }, 5000);
  };

  const addOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOption.trim() && options.length < 12) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
      setWinner(null);
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 md:p-8 bg-transparent">
      
      {/* Title */}
      <h2 className="text-3xl md:text-4xl gold-text uppercase tracking-[0.3em] font-bold mb-12 text-center drop-shadow-lg">
        House Wheel
      </h2>

      {/* Wheel Area */}
      <div className="relative mb-16 flex flex-col items-center">
        {/* Elegant Pointer */}
        <div className="absolute -top-6 z-20 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
          <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[36px] border-t-[#d4af37]"></div>
        </div>

        {/* The Wheel */}
        <div 
          className="w-72 h-72 md:w-[500px] md:h-[500px] rounded-full border-[12px] border-[#d4af37] relative overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.15)] bg-black"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 5s cubic-bezier(0.15, 0, 0.15, 1)' 
          }}
        >
          {visualSlices.map((opt, i) => {
            const sliceAngle = 360 / sliceCount;
            const color = i % 2 === 0 ? '#064e3b' : '#0a0a0a';
            return (
              <div 
                key={i}
                className="absolute top-0 left-0 w-full h-full origin-center"
                style={{ 
                  transform: `rotate(${i * sliceAngle}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.tan((sliceAngle * Math.PI) / 180)}% 0)`
                }}
              >
                <div 
                  className="w-full h-full flex justify-center"
                  style={{ backgroundColor: color }}
                >
                  {/* FIXED TEXT CONTAINER */}
                  <div 
                    className="h-[50%] w-8 flex flex-col items-center pt-12 md:pt-16 origin-bottom"
                    style={{ 
                      transform: `rotate(${sliceAngle / 2}deg)`,
                      transformOrigin: 'bottom center',
                      height: '50%' 
                    }}
                  >
                    <span 
                      className="text-[#d4af37] font-black uppercase tracking-widest text-[9px] md:text-[11px] whitespace-nowrap drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                      style={{ 
                        writingMode: 'vertical-rl', 
                        textOrientation: 'mixed',
                        maxHeight: '160px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {opt}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 bg-[#d4af37] rounded-full z-10 border-8 border-[#0a0a0a] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center">
             <div className="w-8 h-8 md:w-12 md:h-12 border-2 border-black/30 rounded-full bg-[#b5a642]"></div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full space-y-8 bg-[#0a0a0a]/50 p-6 md:p-10 border border-gray-900 rounded-sm backdrop-blur-sm shadow-2xl">
        <div className="min-h-[100px] flex items-center justify-center">
          {winner && !isSpinning ? (
            <div className="text-center w-full animate-in zoom-in duration-500">
              <span className="text-[10px] uppercase tracking-[0.6em] text-gray-500 block mb-4">Outcome Decided</span>
              <h3 className="text-4xl md:text-5xl font-black gold-text drop-shadow-xl tracking-tight uppercase leading-none">
                {winner}
              </h3>
            </div>
          ) : isSpinning ? (
            <div className="text-center animate-pulse">
                <p className="text-sm italic tracking-[0.4em] text-gray-600 uppercase">"Fates are revolving..."</p>
            </div>
          ) : (
            <div className="text-center opacity-40">
               <p className="text-xs italic tracking-[0.3em] text-gray-400 uppercase">"Place your stakes. The House awaits."</p>
            </div>
          )}
        </div>

        <button 
          disabled={isSpinning || options.length < 2}
          onClick={spin}
          className="w-full py-6 bg-[#d4af37] text-black font-black text-xl uppercase tracking-[0.5em] disabled:opacity-20 transition-all hover:bg-[#eec643] shadow-[0_10px_40px_rgba(212,175,55,0.15)] active:scale-[0.98] rounded-sm"
        >
          {isSpinning ? 'Wheel is Turning' : 'Initiate Spin'}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <form onSubmit={addOption} className="flex flex-col gap-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">New Stake</label>
            <div className="flex">
              <input 
                type="text" 
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Declare..."
                className="flex-grow bg-[#050505] border border-gray-800 p-4 text-sm focus:border-[#d4af37] outline-none text-white rounded-l-sm transition-colors"
                maxLength={24}
              />
              <button 
                type="submit"
                className="px-6 bg-gray-900 border border-gray-800 border-l-0 hover:border-[#d4af37] hover:text-[#d4af37] transition-all gold-text text-2xl rounded-r-sm"
              >
                +
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Active Pot ({options.length}/12)</label>
            <div className="max-h-40 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
              {options.map((opt, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-3 bg-[#0a0a0a] border border-gray-900 rounded-sm group hover:border-[#d4af37]/40 transition-all">
                  <span className="truncate opacity-80 tracking-widest uppercase font-medium">{opt}</span>
                  <button onClick={() => removeOption(i)} className="text-gray-700 hover:text-red-500 px-2 transition-colors text-xl leading-none">&times;</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseWheel;