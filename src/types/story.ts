export type ThemeType = 'classic' | 'animals' | 'adventure';
export type ElementCategory = 'character' | 'place' | 'object' | 'problem' | 'action' | 'ending';

export interface StoryElement {
  id: string;
  emoji: string;
  name: string;
  category: ElementCategory;
}

export interface StoryStation {
  id: 'character' | 'problem' | 'solution' | 'ending';
  title: string;
  prompt: string;
  element: StoryElement | null;
  text: string;
}

export interface Story {
  id: string;
  name: string;
  theme: ThemeType;
  stations: StoryStation[];
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  id: ThemeType;
  name: string;
  emoji: string;
  color: string;
  elements: StoryElement[];
}
