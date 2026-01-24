
import React from 'react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onHome: () => void;
  isAtHome: boolean;
}

const Header: React.FC<HeaderProps> = ({ soundEnabled, onToggleSound, onHome, isAtHome }) => {
  return (
    <header className="flex justify-between items-center p-6 border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-50">
      <div 
        onClick={onHome}
        className="cursor-pointer group flex flex-col"
      >
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter gold-text leading-none transition-transform group-hover:scale-105">
          HOUSE DECIDES
        </h1>
        <span className="text-[10px] tracking-[0.3em] uppercase opacity-50">The House Always Decides</span>
      </div>

      <div className="flex gap-4 items-center">
        <button 
          onClick={onToggleSound}
          className="p-2 transition-colors hover:text-[#d4af37]"
          title={soundEnabled ? "Mute" : "Unmute"}
        >
          {soundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          )}
        </button>
        
        {!isAtHome && (
          <button 
            onClick={onHome}
            className="text-xs uppercase tracking-widest border border-gray-700 px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            Leave Table
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
