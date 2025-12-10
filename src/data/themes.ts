import { Theme, StoryStation } from '@/types/story';

export const themes: Theme[] = [
  {
    id: 'classic',
    name: 'Klassisk saga',
    emoji: '🏰',
    color: 'hsl(280, 70%, 60%)',
    elements: [
      // Karaktärer
      { id: 'princess', emoji: '👸', name: 'Prinsessa', category: 'character' },
      { id: 'prince', emoji: '🤴', name: 'Prins', category: 'character' },
      { id: 'dragon', emoji: '🐉', name: 'Drake', category: 'character' },
      { id: 'wizard', emoji: '🧙', name: 'Trollkarl', category: 'character' },
      { id: 'fairy', emoji: '🧚', name: 'Älva', category: 'character' },
      { id: 'knight', emoji: '🤺', name: 'Riddare', category: 'character' },
      // Platser
      { id: 'castle', emoji: '🏰', name: 'Slott', category: 'place' },
      { id: 'forest', emoji: '🌲', name: 'Skog', category: 'place' },
      { id: 'tower', emoji: '🗼', name: 'Torn', category: 'place' },
      { id: 'cave', emoji: '🕳️', name: 'Grotta', category: 'place' },
      // Föremål
      { id: 'crown', emoji: '👑', name: 'Krona', category: 'object' },
      { id: 'sword', emoji: '⚔️', name: 'Svärd', category: 'object' },
      { id: 'wand', emoji: '🪄', name: 'Trollstav', category: 'object' },
      { id: 'potion', emoji: '🧪', name: 'Trolldryck', category: 'object' },
      // Problem
      { id: 'fire', emoji: '🔥', name: 'Eld', category: 'problem' },
      { id: 'evil-wizard', emoji: '😈', name: 'Ond trollkarl', category: 'problem' },
      { id: 'web', emoji: '🕸️', name: 'Spindelnät', category: 'problem' },
      { id: 'darkness', emoji: '🌑', name: 'Mörker', category: 'problem' },
      { id: 'sad', emoji: '😢', name: 'Ledsen', category: 'problem' },
      { id: 'locked', emoji: '🔒', name: 'Fängslad', category: 'problem' },
      // Handling
      { id: 'helps', emoji: '🤝', name: 'Hjälper', category: 'action' },
      { id: 'idea', emoji: '💡', name: 'Idé', category: 'action' },
      { id: 'runs', emoji: '🏃', name: 'Springer', category: 'action' },
      { id: 'talks', emoji: '🗣️', name: 'Pratar', category: 'action' },
      { id: 'fights', emoji: '⚔️', name: 'Strider', category: 'action' },
      { id: 'flies', emoji: '🦅', name: 'Flyger', category: 'action' },
      // Slut
      { id: 'party', emoji: '🎉', name: 'Fest', category: 'ending' },
      { id: 'love', emoji: '💕', name: 'Kärlek', category: 'ending' },
      { id: 'coronation', emoji: '👑', name: 'Kröning', category: 'ending' },
      { id: 'rainbow', emoji: '🌈', name: 'Lycka', category: 'ending' },
      { id: 'peace', emoji: '☮️', name: 'Fred', category: 'ending' },
    ],
  },
  {
    id: 'animals',
    name: 'Djur & natur',
    emoji: '🦁',
    color: 'hsl(140, 60%, 45%)',
    elements: [
      // Karaktärer
      { id: 'lion', emoji: '🦁', name: 'Lejon', category: 'character' },
      { id: 'rabbit', emoji: '🐰', name: 'Kanin', category: 'character' },
      { id: 'fox', emoji: '🦊', name: 'Räv', category: 'character' },
      { id: 'owl', emoji: '🦉', name: 'Uggla', category: 'character' },
      { id: 'bear', emoji: '🐻', name: 'Björn', category: 'character' },
      { id: 'deer', emoji: '🦌', name: 'Hjort', category: 'character' },
      // Platser
      { id: 'tree', emoji: '🌳', name: 'Träd', category: 'place' },
      { id: 'river', emoji: '🏞️', name: 'Flod', category: 'place' },
      { id: 'meadow', emoji: '🌿', name: 'Äng', category: 'place' },
      { id: 'mountain', emoji: '⛰️', name: 'Berg', category: 'place' },
      // Föremål
      { id: 'mushroom', emoji: '🍄', name: 'Svamp', category: 'object' },
      { id: 'flower', emoji: '🌸', name: 'Blomma', category: 'object' },
      { id: 'acorn', emoji: '🌰', name: 'Ekollon', category: 'object' },
      { id: 'honey', emoji: '🍯', name: 'Honung', category: 'object' },
      // Problem
      { id: 'storm', emoji: '⛈️', name: 'Storm', category: 'problem' },
      { id: 'wolf', emoji: '🐺', name: 'Varg', category: 'problem' },
      { id: 'cat-sad', emoji: '😿', name: 'Ledsen', category: 'problem' },
      { id: 'broken-home', emoji: '🏚️', name: 'Förstört bo', category: 'problem' },
      { id: 'lonely', emoji: '💔', name: 'Ensam', category: 'problem' },
      { id: 'cold', emoji: '🥶', name: 'Kallt', category: 'problem' },
      // Handling
      { id: 'hug', emoji: '🤗', name: 'Kram', category: 'action' },
      { id: 'builds', emoji: '🏠', name: 'Bygger', category: 'action' },
      { id: 'searches', emoji: '🔍', name: 'Letar', category: 'action' },
      { id: 'gives', emoji: '🎁', name: 'Ger', category: 'action' },
      { id: 'shares', emoji: '🤲', name: 'Delar', category: 'action' },
      { id: 'protects', emoji: '🛡️', name: 'Skyddar', category: 'action' },
      // Slut
      { id: 'sun', emoji: '🌞', name: 'Sol', category: 'ending' },
      { id: 'family', emoji: '👨‍👩‍👧‍👦', name: 'Familj', category: 'ending' },
      { id: 'celebrates', emoji: '🎊', name: 'Firar', category: 'ending' },
      { id: 'happy', emoji: '😊', name: 'Glad', category: 'ending' },
      { id: 'friends', emoji: '🫂', name: 'Vänner', category: 'ending' },
    ],
  },
  {
    id: 'adventure',
    name: 'Äventyr',
    emoji: '🏴‍☠️',
    color: 'hsl(25, 80%, 55%)',
    elements: [
      // Karaktärer
      { id: 'pirate', emoji: '🏴‍☠️', name: 'Pirat', category: 'character' },
      { id: 'astronaut', emoji: '👨‍🚀', name: 'Astronaut', category: 'character' },
      { id: 'dinosaur', emoji: '🦖', name: 'Dinosaurie', category: 'character' },
      { id: 'explorer', emoji: '🧭', name: 'Upptäckare', category: 'character' },
      { id: 'robot', emoji: '🤖', name: 'Robot', category: 'character' },
      { id: 'superhero', emoji: '🦸', name: 'Superhjälte', category: 'character' },
      // Platser
      { id: 'island', emoji: '🏝️', name: 'Ö', category: 'place' },
      { id: 'rocket', emoji: '🚀', name: 'Raket', category: 'place' },
      { id: 'jungle', emoji: '🌴', name: 'Djungel', category: 'place' },
      { id: 'space', emoji: '🌌', name: 'Rymden', category: 'place' },
      // Föremål
      { id: 'treasure', emoji: '💎', name: 'Skatt', category: 'object' },
      { id: 'map', emoji: '🗺️', name: 'Karta', category: 'object' },
      { id: 'compass', emoji: '🧭', name: 'Kompass', category: 'object' },
      { id: 'telescope', emoji: '🔭', name: 'Teleskop', category: 'object' },
      // Problem
      { id: 'shark', emoji: '🦈', name: 'Haj', category: 'problem' },
      { id: 'volcano', emoji: '🌋', name: 'Vulkan', category: 'problem' },
      { id: 'alien', emoji: '👽', name: 'Utomjording', category: 'problem' },
      { id: 'danger', emoji: '💀', name: 'Fara', category: 'problem' },
      { id: 'vortex', emoji: '🌀', name: 'Virvel', category: 'problem' },
      { id: 'lightning', emoji: '⚡', name: 'Blixt', category: 'problem' },
      // Handling
      { id: 'shields', emoji: '🛡️', name: 'Skyddar', category: 'action' },
      { id: 'key', emoji: '🔑', name: 'Nyckel', category: 'action' },
      { id: 'climbs', emoji: '🧗', name: 'Klättrar', category: 'action' },
      { id: 'teamwork', emoji: '🤜🤛', name: 'Lagarbete', category: 'action' },
      { id: 'escapes', emoji: '🏃‍♂️', name: 'Flyr', category: 'action' },
      { id: 'discovers', emoji: '🔬', name: 'Upptäcker', category: 'action' },
      // Slut
      { id: 'victory', emoji: '🏆', name: 'Vinst', category: 'ending' },
      { id: 'hero', emoji: '🎖️', name: 'Hjälte', category: 'ending' },
      { id: 'sunset', emoji: '🌅', name: 'Solnedgång', category: 'ending' },
      { id: 'party-time', emoji: '🥳', name: 'Firar', category: 'ending' },
      { id: 'home', emoji: '🏡', name: 'Hem', category: 'ending' },
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
