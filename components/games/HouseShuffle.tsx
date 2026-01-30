
import React, { useState, useRef } from 'react';
import { audioService } from '../AudioService';

interface HouseShuffleProps {
  soundEnabled: boolean;
}

const HouseShuffle: React.FC<HouseShuffleProps> = ({ soundEnabled }) => {
  const defaultPeople = ['Person 1', 'Person 2'];
  const defaultTasks = ['Task 1', 'Task 2'];

  const [people, setPeople] = useState<string[]>(defaultPeople);
  const [tasks, setTasks] = useState<string[]>(defaultTasks);
  const [assignments, setAssignments] = useState<{person: string, task: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputP, setInputP] = useState('');
  const [inputT, setInputT] = useState('');

  // Use useRef to store the truly initial values
  const initialPeopleRef = useRef<string[]>(defaultPeople);
  const initialTasksRef = useRef<string[]>(defaultTasks);

  const addPerson = () => {
    if (inputP.trim() !== '') {
      const newPeople = [...people, inputP.trim()];
      setPeople(newPeople);
      // Update the ref only if you want new additions to be part of the "initial" state for future restores
      // For now, I'll keep the ref as truly initial
      setInputP('');
    }
  };

  const removePerson = (index: number) => {
    const newPeople = people.filter((_, i) => i !== index);
    setPeople(newPeople);
    // Same as above, decide if removals should affect future "initial" state for restores
  };

  const addTask = () => {
    if (inputT.trim() !== '') {
      const newTasks = [...tasks, inputT.trim()];
      setTasks(newTasks);
      // Same as addPerson
      setInputT('');
    }
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    // Same as removePerson
  };

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

  const restore = () => {
    setPeople(initialPeopleRef.current);
    setTasks(initialTasksRef.current);
    setAssignments([]);
  };

  const isGameFinished = people.length === 0 || tasks.length === 0;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl mb-8 gold-text uppercase tracking-widest">House Shuffle</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
        <div className="space-y-4">
           <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Unassigned Subjects ({people.length})</label>
           <div className="flex gap-2">
              <input value={inputP} onChange={e=>setInputP(e.target.value)} className="flex-grow bg-[#050505] border border-gray-800 p-2 text-sm outline-none focus:border-[#d4af37] text-white rounded-sm" />
              <button onClick={addPerson} className="px-4 border border-gray-800 gold-text">+</button>
           </div>
           <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
             {people.map((p,i) => (
                <span key={i} className="px-2 py-1 bg-[#064e3b]/20 text-[10px] uppercase tracking-widest border border-[#064e3b]/40 rounded-sm flex items-center gap-2">
                  {p}
                  <button onClick={() => removePerson(i)} className="text-gray-600 hover:text-red-500">×</button>
                </span>
              ))}
           </div>
        </div>
        <div className="space-y-4">
           <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Remaining Duties ({tasks.length})</label>
           <div className="flex gap-2">
              <input value={inputT} onChange={e=>setInputT(e.target.value)} className="flex-grow bg-[#050505] border border-gray-800 p-2 text-sm outline-none focus:border-[#d4af37] text-white rounded-sm" />
              <button onClick={addTask} className="px-4 border border-gray-800 gold-text">+</button>
           </div>
           <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
             {tasks.map((t,i) => (
                <span key={i} className="px-2 py-1 bg-[#b5a642]/20 text-[10px] uppercase tracking-widest border border-[#b5a642]/40 rounded-sm flex items-center gap-2">
                  {t}
                  <button onClick={() => removeTask(i)} className="text-gray-600 hover:text-red-500">×</button>
                </span>
              ))}
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
        onClick={isGameFinished ? restore : nextStep}
        disabled={isProcessing}
        className="w-full max-w-sm py-5 bg-[#d4af37] text-black font-bold uppercase tracking-[0.2em] hover:bg-[#b5a642] disabled:opacity-10 transition-all shadow-lg active:scale-95"
      >
        {isGameFinished ? 'Restore' : 'Draw Next Assignment'}
      </button>
    </div>
  );
};

export default HouseShuffle;
