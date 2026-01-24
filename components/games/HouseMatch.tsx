
import React, { useState } from 'react';
import { audioService } from '../AudioService';

interface HouseMatchProps {
  soundEnabled: boolean;
}

const HouseMatch: React.FC<HouseMatchProps> = ({ soundEnabled }) => {
  const [listA, setListA] = useState<string[]>(['Alice', 'Bob']);
  const [listB, setListB] = useState<string[]>(['Cleaning', 'Cooking']);
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [results, setResults] = useState<{a: string, b: string}[] | null>(null);

  const match = () => {
    if (listA.length === 0 || listB.length === 0 || isMatching) return;
    setIsMatching(true);
    setResults(null);
    if (soundEnabled) audioService.playCardShuffle();

    setTimeout(() => {
      const shuffledA = [...listA].sort(() => Math.random() - 0.5);
      const shuffledB = [...listB].sort(() => Math.random() - 0.5);
      const newPairs = shuffledA.map((a, i) => ({
        a,
        b: shuffledB[i % shuffledB.length]
      }));
      setResults(newPairs);
      setIsMatching(false);
      if (soundEnabled) audioService.playTick(500);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl mb-8 gold-text uppercase tracking-widest">House Match</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Subjects</label>
          <div className="flex gap-2">
            <input 
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              className="flex-grow bg-[#050505] border border-gray-800 p-2 text-sm outline-none focus:border-[#d4af37] text-white rounded-sm"
              placeholder="e.g. Person"
            />
            <button onClick={() => {if(inputA){setListA([...listA, inputA]); setInputA('')}}} className="px-4 border border-gray-800 gold-text hover:border-[#d4af37] transition-colors">+</button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {listA.map((item, i) => (
              <span key={i} className="text-[10px] uppercase tracking-widest bg-[#0a0a0a] px-2 py-1 border border-gray-900 flex items-center gap-2 rounded-sm">
                {item}
                <button onClick={() => setListA(listA.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Assignments</label>
          <div className="flex gap-2">
            <input 
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              className="flex-grow bg-[#050505] border border-gray-800 p-2 text-sm outline-none focus:border-[#d4af37] text-white rounded-sm"
              placeholder="e.g. Task"
            />
            <button onClick={() => {if(inputB){setListB([...listB, inputB]); setInputB('')}}} className="px-4 border border-gray-800 gold-text hover:border-[#d4af37] transition-colors">+</button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {listB.map((item, i) => (
              <span key={i} className="text-[10px] uppercase tracking-widest bg-[#0a0a0a] px-2 py-1 border border-gray-900 flex items-center gap-2 rounded-sm">
                {item}
                <button onClick={() => setListB(listB.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full mb-8 min-h-[120px]">
        {results && (
          <div className="w-full bg-[#0a0a0a] border-2 border-[#d4af37] p-6 animate-in slide-in-from-top duration-500 rounded-sm">
             <h3 className="text-[10px] uppercase tracking-[0.4em] text-center text-gray-500 mb-6">Inescapable Pairings</h3>
             <div className="space-y-3">
               {results.map((pair, i) => (
                 <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-2">
                   <span className="gold-text font-bold uppercase tracking-widest text-sm">{pair.a}</span>
                   <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600">is assigned to</span>
                   <span className="font-bold text-white uppercase tracking-widest text-sm">{pair.b}</span>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>

      <button 
        onClick={match}
        disabled={isMatching || listA.length === 0 || listB.length === 0}
        className="w-full max-w-sm py-5 bg-[#d4af37] text-black font-bold uppercase tracking-[0.2em] hover:bg-[#b5a642] disabled:opacity-20 shadow-lg active:scale-95"
      >
        {isMatching ? 'Calculating Pairings...' : 'Resolve Assignments'}
      </button>
    </div>
  );
};

export default HouseMatch;
