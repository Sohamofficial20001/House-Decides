
import React, { useState, useCallback } from 'react';
import { GameType } from './types';
import CasinoFloor from './components/CasinoFloor';
import GameStage from './components/GameStage';
import Header from './components/Header';

const App: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSelectGame = (game: GameType) => {
    setCurrentGame(game);
  };

  const handleBack = () => {
    setCurrentGame(null);
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-200">
      <Header 
        soundEnabled={soundEnabled} 
        onToggleSound={toggleSound} 
        onHome={handleBack}
        isAtHome={!currentGame}
      />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        {!currentGame ? (
          <CasinoFloor onSelectGame={handleSelectGame} />
        ) : (
          <GameStage 
            type={currentGame} 
            soundEnabled={soundEnabled} 
            onBack={handleBack} 
          />
        )}
      </main>

      <footer className="p-4 text-center opacity-40 text-xs tracking-widest uppercase">
        © The House Decides • No Second Chances
      </footer>
    </div>
  );
};

export default App;
