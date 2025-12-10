import { Theme, StoryStation } from '@/types/story';

export const themes: Theme[] = [
  {
    id: 'classic',
    name: 'Klassisk saga',
    emoji: '🏰',
    color: 'hsl(280, 70%, 60%)',
    elements: [
      { id: 'princess', emoji: '👸', name: 'Prinsessa', category: 'character' },
      { id: 'prince', emoji: '🤴', name: 'Prins', category: 'character' },
      { id: 'dragon', emoji: '🐉', name: 'Drake', category: 'character' },
      { id: 'wizard', emoji: '🧙', name: 'Trollkarl', category: 'character' },
      { id: 'fairy', emoji: '🧚', name: 'Älva', category: 'character' },
      { id: 'knight', emoji: '🤺', name: 'Riddare', category: 'character' },
      { id: 'castle', emoji: '🏰', name: 'Slott', category: 'place' },
      { id: 'forest', emoji: '🌲', name: 'Skog', category: 'place' },
      { id: 'crown', emoji: '👑', name: 'Krona', category: 'object' },
      { id: 'sword', emoji: '⚔️', name: 'Svärd', category: 'object' },
      { id: 'wand', emoji: '🪄', name: 'Trollstav', category: 'object' },
      { id: 'potion', emoji: '🧪', name: 'Trolldryck', category: 'object' },
    ],
  },
  {
    id: 'animals',
    name: 'Djur & natur',
    emoji: '🦁',
    color: 'hsl(140, 60%, 45%)',
    elements: [
      { id: 'lion', emoji: '🦁', name: 'Lejon', category: 'character' },
      { id: 'rabbit', emoji: '🐰', name: 'Kanin', category: 'character' },
      { id: 'fox', emoji: '🦊', name: 'Räv', category: 'character' },
      { id: 'owl', emoji: '🦉', name: 'Uggla', category: 'character' },
      { id: 'bear', emoji: '🐻', name: 'Björn', category: 'character' },
      { id: 'deer', emoji: '🦌', name: 'Hjort', category: 'character' },
      { id: 'tree', emoji: '🌳', name: 'Träd', category: 'place' },
      { id: 'river', emoji: '🏞️', name: 'Flod', category: 'place' },
      { id: 'mushroom', emoji: '🍄', name: 'Svamp', category: 'object' },
      { id: 'flower', emoji: '🌸', name: 'Blomma', category: 'object' },
      { id: 'acorn', emoji: '🌰', name: 'Ekollon', category: 'object' },
      { id: 'honey', emoji: '🍯', name: 'Honung', category: 'object' },
    ],
  },
  {
    id: 'adventure',
    name: 'Äventyr',
    emoji: '🏴‍☠️',
    color: 'hsl(25, 80%, 55%)',
    elements: [
      { id: 'pirate', emoji: '🏴‍☠️', name: 'Pirat', category: 'character' },
      { id: 'astronaut', emoji: '👨‍🚀', name: 'Astronaut', category: 'character' },
      { id: 'dinosaur', emoji: '🦖', name: 'Dinosaurie', category: 'character' },
      { id: 'explorer', emoji: '🧭', name: 'Upptäckare', category: 'character' },
      { id: 'robot', emoji: '🤖', name: 'Robot', category: 'character' },
      { id: 'superhero', emoji: '🦸', name: 'Superhjälte', category: 'character' },
      { id: 'island', emoji: '🏝️', name: 'Ö', category: 'place' },
      { id: 'rocket', emoji: '🚀', name: 'Raket', category: 'place' },
      { id: 'treasure', emoji: '💎', name: 'Skatt', category: 'object' },
      { id: 'map', emoji: '🗺️', name: 'Karta', category: 'object' },
      { id: 'compass', emoji: '🧭', name: 'Kompass', category: 'object' },
      { id: 'telescope', emoji: '🔭', name: 'Teleskop', category: 'object' },
    ],
  },
];

export const defaultStations: Omit<StoryStation, 'element' | 'text'>[] = [
  {
    id: 'character',
    title: 'Vem?',
    prompt: 'Vem handlar sagan om?',
  },
  {
    id: 'problem',
    title: 'Problem',
    prompt: 'Vad händer? Vilket problem uppstår?',
  },
  {
    id: 'solution',
    title: 'Lösning',
    prompt: 'Hur löser hjälten problemet?',
  },
  {
    id: 'ending',
    title: 'Slut',
    prompt: 'Hur slutar sagan?',
  },
];

export const createEmptyStations = (): StoryStation[] => 
  defaultStations.map(station => ({
    ...station,
    element: null,
    text: '',
  }));
