
import React from 'react';
import { GameType } from '../types';
import HouseWheel from './games/HouseWheel';
import HouseCoin from './games/HouseCoin';
import HouseDice from './games/HouseDice';
import HouseCards from './games/HouseCards';
import HouseMatch from './games/HouseMatch';
import HouseShuffle from './games/HouseShuffle';
import CupOfFate from './games/CupOfFate';
import CountdownChoice from './games/CountdownChoice';

interface GameStageProps {
  type: GameType;
  soundEnabled: boolean;
  onBack: () => void;
}

const GameStage: React.FC<GameStageProps> = ({ type, soundEnabled, onBack }) => {
  const renderGame = () => {
    switch (type) {
      case GameType.WHEEL: return <HouseWheel soundEnabled={soundEnabled} />;
      case GameType.COIN: return <HouseCoin soundEnabled={soundEnabled} />;
      case GameType.DICE: return <HouseDice soundEnabled={soundEnabled} />;
      case GameType.CARDS: return <HouseCards soundEnabled={soundEnabled} />;
      case GameType.MATCH: return <HouseMatch soundEnabled={soundEnabled} />;
      case GameType.SHUFFLE: return <HouseShuffle soundEnabled={soundEnabled} />;
      case GameType.CUP: return <CupOfFate soundEnabled={soundEnabled} />;
      case GameType.COUNTDOWN: return <CountdownChoice soundEnabled={soundEnabled} />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl min-h-[60vh] flex flex-col items-center justify-center p-4 md:p-8 bg-black border border-gray-900 rounded-lg shadow-2xl relative overflow-hidden">
      {/* Decorative Felt background effect */}
      <div className="absolute inset-0 felt-bg opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 w-full">
        {renderGame()}
      </div>
    </div>
  );
};

export default GameStage;
