
import React from 'react';
import { GAMES } from '../constants';
import { GameType } from '../types';

interface CasinoFloorProps {
  onSelectGame: (type: GameType) => void;
}

const CasinoFloor: React.FC<CasinoFloorProps> = ({ onSelectGame }) => {
  return (
    <div className="w-full max-w-6xl animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl mb-2 gold-text">Choose Your Table</h2>
        <p className="text-gray-500 uppercase tracking-widest text-sm">Place your stakes. Let the house resolve the matter.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className="group relative flex flex-col items-center p-8 bg-[#111] border border-gray-800 transition-all hover:border-[#d4af37] hover:bg-[#1a1a1a] card-shadow rounded-sm"
          >
            <div className="text-4xl mb-4 transition-transform group-hover:scale-110 duration-500">
              {game.icon}
            </div>
            <h3 className="text-xl mb-1 gold-text">{game.title}</h3>
            <p className="text-xs text-gray-500 text-center tracking-wide leading-relaxed">
              {game.tagline}
            </p>
            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] gold-text tracking-[0.3em] uppercase">
              Enter
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CasinoFloor;
