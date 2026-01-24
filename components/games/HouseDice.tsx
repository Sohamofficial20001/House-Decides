
import React, { useState } from 'react';
import { audioService } from '../AudioService';

interface HouseDiceProps {
  soundEnabled: boolean;
}

const HouseDice: React.FC<HouseDiceProps> = ({ soundEnabled }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState({ x: 20, y: 20 });

  const getRotationForResult = (res: number) => {
    switch (res) {
      case 1: return { x: 0, y: 0 };
      case 2: return { x: 0, y: 180 };
      case 3: return { x: 0, y: -90 };
      case 4: return { x: 0, y: 90 };
      case 5: return { x: -90, y: 0 };
      case 6: return { x: 90, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  const roll = () => {
    if (isRolling) return;
    setIsRolling(true);
    setResult(null);

    const startTime = performance.now();
    const duration = 2000;
    const outcome = Math.floor(Math.random() * 6) + 1;
    
    let rollInterval: number;
    if (soundEnabled) {
      rollInterval = window.setInterval(() => {
        audioService.playDiceRoll();
      }, 100);
    }

    const animate = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < duration) {
        setRotation({
          x: (Math.random() * 1440),
          y: (Math.random() * 1440)
        });
        requestAnimationFrame(animate);
      } else {
        if (rollInterval) clearInterval(rollInterval);
        setIsRolling(false);
        setResult(outcome);
        setRotation(getRotationForResult(outcome));
        if (soundEnabled) audioService.playTick(150, 0.2);
      }
    };

    requestAnimationFrame(animate);
  };

  const Dot = ({ color = "white" }) => (
    <div 
      className={`w-4 h-4 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]`}
      style={{ backgroundColor: color }}
    ></div>
  );
  
  // Rich Casino Red. Solid faces with slight overlap to prevent gaps.
  const faceBaseStyle = "absolute w-[130px] h-[130px] bg-[#b91c1c] flex items-center justify-center backface-hidden border border-[#7f1d1d]";

  return (
    <div className="flex flex-col items-center py-10">
      <h2 className="text-3xl md:text-4xl gold-text uppercase tracking-[0.4em] font-bold mb-16 text-center drop-shadow-lg">
        House Dice
      </h2>

      <div className="relative w-32 h-32 mb-24" style={{ perspective: '1200px' }}>
        <div 
          className="w-full h-full relative transition-transform duration-[400ms] ease-out"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` 
          }}
        >
          {/* FACE 1 - Center Red Dot is traditional for 1 */}
          <div className={`${faceBaseStyle}`} style={{ transform: 'translateZ(65px)', background: '#b91c1c' }}>
            <Dot color="gold" />
          </div>
          {/* FACE 2 */}
          <div className={`${faceBaseStyle}`} style={{ transform: 'rotateY(180deg) translateZ(65px)', background: '#b91c1c' }}>
            <div className="flex flex-col gap-8"><Dot /><Dot /></div>
          </div>
          {/* FACE 3 */}
          <div className={`${faceBaseStyle} flex-col justify-around py-6`} style={{ transform: 'rotateY(90deg) translateZ(65px)', background: '#b91c1c' }}>
             <div className="flex w-full justify-start pl-6"><Dot /></div>
             <div className="flex w-full justify-center"><Dot /></div>
             <div className="flex w-full justify-end pr-6"><Dot /></div>
          </div>
          {/* FACE 4 */}
          <div className={`${faceBaseStyle} flex-col justify-around py-8`} style={{ transform: 'rotateY(-90deg) translateZ(65px)', background: '#b91c1c' }}>
             <div className="flex w-full justify-around"><Dot /><Dot /></div>
             <div className="flex w-full justify-around"><Dot /><Dot /></div>
          </div>
          {/* FACE 5 */}
          <div className={`${faceBaseStyle} flex-col justify-around py-8`} style={{ transform: 'rotateX(90deg) translateZ(65px)', background: '#b91c1c' }}>
             <div className="flex w-full justify-around"><Dot /><Dot /></div>
             <div className="flex w-full justify-center"><Dot /></div>
             <div className="flex w-full justify-around"><Dot /><Dot /></div>
          </div>
          {/* FACE 6 */}
          <div className={`${faceBaseStyle} flex-col justify-around py-6`} style={{ transform: 'rotateX(-90deg) translateZ(65px)', background: '#b91c1c' }}>
             <div className="flex w-full justify-around"><Dot /><Dot /></div>
             <div className="flex w-full justify-around"><Dot /><Dot /></div>
             <div className="flex w-full justify-around"><Dot /><Dot /></div>
          </div>
        </div>
      </div>

      <div className="text-center w-full max-w-sm">
        <div className="mb-12 min-h-[100px] flex flex-col justify-center items-center">
          {result && !isRolling ? (
             <div className="animate-in slide-in-from-bottom-8 duration-700">
               <p className="text-[10px] uppercase tracking-[0.5em] text-gray-500 mb-4">Outcome Revealed</p>
               <h3 className="text-6xl font-black gold-text drop-shadow-2xl">{result}</h3>
             </div>
          ) : isRolling ? (
            <div className="animate-pulse">
              <p className="text-gray-600 italic tracking-[0.4em] text-sm uppercase">"Rolling for Fate..."</p>
            </div>
          ) : (
            <p className="text-gray-500 italic tracking-widest text-xs uppercase opacity-40">"Toss the dice to reveal the order."</p>
          )}
        </div>

        <button 
          onClick={roll}
          disabled={isRolling}
          className="w-full py-6 bg-[#d4af37] text-black font-black uppercase tracking-[0.5em] hover:bg-[#b5a642] transition-all disabled:opacity-20 shadow-[0_15px_40px_rgba(212,175,55,0.1)] active:scale-95 rounded-sm"
        >
          {isRolling ? 'The Die is in Motion' : 'Roll the Die'}
        </button>
        
        <p className="mt-10 text-[9px] uppercase tracking-[0.5em] text-gray-700 font-bold">
          House Rules • Standard Casino Red
        </p>
      </div>
    </div>
  );
};

export default HouseDice;
