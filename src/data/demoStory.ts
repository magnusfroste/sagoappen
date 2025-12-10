import { Story, StoryStation } from '@/types/story';

export const demoStory: Story = {
  id: 'demo-story',
  name: 'Prinsessan och Draken',
  theme: 'classic',
  stations: [
    {
      id: 'character',
      title: 'Vem?',
      prompt: 'Vem handlar sagan om?',
      element: {
        id: 'princess',
        name: 'Prinsessa',
        emoji: '👸',
        category: 'character',
      },
      text: 'Det var en gång en modig prinsessa som hette Stella. Hon bodde i ett vackert slott högt uppe på ett berg. Varje dag tittade hon ut genom fönstret och drömde om äventyr.',
    },
    {
      id: 'problem',
      title: 'Problem',
      prompt: 'Vad händer? Vilket problem uppstår?',
      element: {
        id: 'dragon',
        name: 'Drake',
        emoji: '🐉',
        category: 'problem',
      },
      text: 'En dag kom en stor drake flygande över bergen! Den satte sig utanför slottet och ville inte flytta på sig. Alla i kungariket blev rädda och gömde sig i sina hus.',
    },
    {
      id: 'solution',
      title: 'Lösning',
      prompt: 'Hur löser karaktären problemet?',
      element: {
        id: 'talk',
        name: 'Pratar',
        emoji: '🗣️',
        category: 'action',
      },
      text: 'Men prinsessan Stella var inte rädd. Hon gick modigt ut och pratade med draken. "Varför är du här?" frågade hon. Det visade sig att draken var ensam och letade efter en vän!',
    },
    {
      id: 'ending',
      title: 'Slut',
      prompt: 'Hur slutar sagan?',
      element: {
        id: 'party',
        name: 'Fest',
        emoji: '🎉',
        category: 'ending',
      },
      text: 'Prinsessan och draken blev bästa vänner. De hade en stor fest på slottet där alla i kungariket var välkomna. Draken visade sig vara snäll och hjälpsam. Och så levde de lyckliga i alla sina dagar!',
    },
  ],
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-01').toISOString(),
};
