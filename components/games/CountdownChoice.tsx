
import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../AudioService';

interface CountdownChoiceProps {
  soundEnabled: boolean;
}

const CountdownChoice: React.FC<CountdownChoiceProps> = ({ soundEnabled }) => {
  const [options, setOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [newOption, setNewOption] = useState('');
  const [timerValue, setTimerValue] = useState(10);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startCountdown = () => {
    if (options.length < 2 || timeLeft !== null) return;
    setWinner(null);
    setTimeLeft(timerValue);
  };

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft > 0) {
      if (soundEnabled) audioService.playTick(200);
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else {
      const idx = Math.floor(Math.random() * options.length);
      setWinner(options[idx]);
      setTimeLeft(null);
      if (soundEnabled) audioService.playTick(800, 0.2);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft, options, soundEnabled]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl mb-8 gold-text uppercase tracking-widest">House Timer</h2>

      <div className="w-full max-w-sm mb-12">
        <div className="relative h-56 flex items-center justify-center border-4 border-gray-900 bg-[#050505] rounded-full mb-10 shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
           <div className="text-8xl gold-text font-serif drop-shadow-[0_5px_15px_rgba(212,175,55,0.3)]">
             {timeLeft !== null ? timeLeft : (winner ? '!' : '∞')}
           </div>
           {timeLeft !== null && (
             <div className="absolute inset-0 rounded-full border-4 border-t-[#d4af37] border-gray-900 animate-spin opacity-40"></div>
           )}
        </div>

        {winner && (
          <div className="text-center p-6 border-2 border-[#d4af37] bg-[#0a0a0a] animate-in zoom-in duration-500 mb-10 rounded-sm">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-4">Time is Up. The House Chooses:</p>
            <h3 className="text-3xl font-bold gold-text uppercase tracking-widest drop-shadow-sm">{winner}</h3>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 p-3 bg-[#0a0a0a] border border-gray-800 rounded-sm">
             <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Stakes Lifetime (Sec)</label>
             <input 
               type="number" 
               min="1" 
               max="60" 
               value={timerValue} 
               onChange={e=>setTimerValue(Number(e.target.value))}
               className="bg-black border border-gray-800 text-center w-20 gold-text py-1 outline-none text-xl font-serif rounded-sm"
             />
          </div>

          <button 
            onClick={startCountdown}
            disabled={timeLeft !== null || options.length < 2}
            className="w-full py-5 bg-red-950 text-red-200 border border-red-800 font-bold uppercase tracking-[0.2em] hover:bg-red-900 disabled:opacity-10 transition-all shadow-lg active:scale-95"
          >
            {timeLeft !== null ? 'Inevitability Approaches...' : 'Start Countdown'}
          </button>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <form onSubmit={e => { e.preventDefault(); if(newOption){setOptions([...options, newOption]); setNewOption('')}}} className="flex gap-2 mb-6">
          <input 
            value={newOption} 
            onChange={e=>setNewOption(e.target.value)} 
            className="flex-grow bg-[#050505] border border-gray-800 p-3 text-sm outline-none focus:border-[#d4af37] text-white rounded-sm" 
            placeholder="Add potential fate..."
          />
          <button className="px-6 border border-gray-800 gold-text hover:border-[#d4af37] transition-colors">+</button>
        </form>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 custom-scrollbar">
          {options.map((opt, i) => (
            <span key={i} className="text-[10px] uppercase tracking-widest px-3 py-1 bg-[#0a0a0a] border border-gray-800 flex items-center gap-2 rounded-sm">
              {opt}
              <button onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-500 transition-colors">×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownChoice;
