
import { GameType, GameDefinition } from './types';

export const GAMES: GameDefinition[] = [
  { id: GameType.WHEEL, title: 'House Wheel', tagline: 'The wheel turns for all.', icon: '🎡' },
  { id: GameType.COIN, title: 'House Coin', tagline: 'A simple truth revealed.', icon: '🪙' },
  { id: GameType.DICE, title: 'House Dice', tagline: 'Fortune in numbers.', icon: '🎲' },
  { id: GameType.CARDS, title: 'House Cards', tagline: 'The deck knows your fate.', icon: '🃏' },
  { id: GameType.MATCH, title: 'House Match', tagline: 'Perfectly paired outcomes.', icon: '🔀' },
  { id: GameType.SHUFFLE, title: 'House Shuffle', tagline: 'Assignment without bias.', icon: '🎡' },
  { id: GameType.CUP, title: 'Cup of Fate', tagline: 'Watch closely.', icon: '🥃' },
  { id: GameType.COUNTDOWN, title: 'Countdown', tagline: 'Decide or be decided.', icon: '💣' },
];

export const COLORS = {
  charcoal: '#1a1a1a',
  deepGreen: '#064e3b',
  gold: '#d4af37',
  brass: '#b5a642',
  text: '#e5e5e5'
};
