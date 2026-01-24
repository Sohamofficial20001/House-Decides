
import React, { useState } from 'react';
import { audioService } from '../AudioService';

interface HouseShuffleProps {
  soundEnabled: boolean;
}

const HouseShuffle: React.FC<HouseShuffleProps> = ({ soundEnabled }) => {
  const [people, setPeople] = useState<string[]>(['Alice', 'Bob', 'Charlie']);
  const [tasks, setTasks] = useState<string[]>(['Kitchen', 'Trash', 'Mopping']);
  const [assignments, setAssignments] = useState<{person: string, task: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputP, setInputP] = useState('');
  const [inputT, setInputT] = useState('');

  const nextStep = () => {
    if (people.length === 0 || tasks.length === 0 || isProcessing) return;
    setIsProcessing(true);
    if (soundEnabled) audioService.playCardShuffle();

    setTimeout(() => {
      const pIdx = Math.floor(Math.random() * people.length);
      const tIdx = Math.floor(Math.random() * tasks.length);
      const p = people[pIdx];
      const t = tasks[tIdx];

      setAssignments([...assignments, { person: p, task: t }]);
      setPeople(people.filter((_, i) => i !== pIdx));
      setTasks(tasks.filter((_, i) => i !== tIdx));
      setIsProcessing(false);
      if (soundEnabled) audioService.playTick(300);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl mb-8 gold-text uppercase tracking-widest">House Shuffle</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
        <div className="space-y-4">
           <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Unassigned Subjects ({people.length})</label>
           <div className="flex gap-2">
              <input value={inputP} onChange={e=>setInputP(e.target.value)} className="flex-grow bg-[#050505] border border-gray-800 p-2 text-sm outline-none focus:border-[#d4af37] text-white rounded-sm" />
              <button onClick={()=>{if(inputP){setPeople([...people, inputP]); setInputP('')}}} className="px-4 border border-gray-800 gold-text">+</button>
           </div>
           <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
             {people.map((p,i) => <span key={i} className="px-2 py-1 bg-[#064e3b]/20 text-[10px] uppercase tracking-widest border border-[#064e3b]/40 rounded-sm">{p}</span>)}
           </div>
        </div>
        <div className="space-y-4">
           <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Remaining Duties ({tasks.length})</label>
           <div className="flex gap-2">
              <input value={inputT} onChange={e=>setInputT(e.target.value)} className="flex-grow bg-[#050505] border border-gray-800 p-2 text-sm outline-none focus:border-[#d4af37] text-white rounded-sm" />
              <button onClick={()=>{if(inputT){setTasks([...tasks, inputT]); setInputT('')}}} className="px-4 border border-gray-800 gold-text">+</button>
           </div>
           <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
             {tasks.map((t,i) => <span key={i} className="px-2 py-1 bg-[#b5a642]/20 text-[10px] uppercase tracking-widest border border-[#b5a642]/40 rounded-sm">{t}</span>)}
           </div>
        </div>
      </div>

      <div className="w-full mb-12 space-y-2 min-h-[150px]">
        {assignments.map((a, i) => (
          <div key={i} className="flex justify-between p-4 border-l-4 border-[#d4af37] bg-[#0a0a0a] animate-in slide-in-from-left duration-300 rounded-sm shadow-md">
            <span className="font-bold gold-text uppercase tracking-widest text-sm">{a.person}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 self-center">is chosen for</span>
            <span className="font-bold text-white uppercase tracking-widest text-sm">{a.task}</span>
          </div>
        ))}
        {isProcessing && (
           <div className="p-4 border-l-4 border-gray-800 bg-[#050505] animate-pulse flex justify-center italic text-gray-600 text-[10px] uppercase tracking-[0.3em] rounded-sm">
             The shuffle is underway...
           </div>
        )}
      </div>

      <button 
        onClick={nextStep}
        disabled={isProcessing || (people.length === 0 || tasks.length === 0)}
        className="w-full max-w-sm py-5 bg-[#d4af37] text-black font-bold uppercase tracking-[0.2em] hover:bg-[#b5a642] disabled:opacity-10 transition-all shadow-lg active:scale-95"
      >
        {people.length === 0 || tasks.length === 0 ? 'Fate is Fully Allocated' : 'Draw Next Assignment'}
      </button>
    </div>
  );
};

export default HouseShuffle;
