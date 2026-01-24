
export enum GameType {
  WHEEL = 'wheel',
  COIN = 'coin',
  DICE = 'dice',
  CARDS = 'cards',
  MATCH = 'match',
  SHUFFLE = 'shuffle',
  CUP = 'cup',
  COUNTDOWN = 'countdown'
}

export interface GameDefinition {
  id: GameType;
  title: string;
  tagline: string;
  icon: string;
}

export interface SoundState {
  enabled: boolean;
}
