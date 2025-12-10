import { Story } from '@/types/story';

export const demoStories: Story[] = [
  // Classic theme - Prinsessan och Draken
  {
    id: 'demo-story-classic',
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
  },
  // Animals theme - Den lilla igelkotten
  {
    id: 'demo-story-animals',
    name: 'Den lilla igelkotten',
    theme: 'animals',
    stations: [
      {
        id: 'character',
        title: 'Vem?',
        prompt: 'Vem handlar sagan om?',
        element: {
          id: 'hedgehog',
          name: 'Igelkott',
          emoji: '🦔',
          category: 'character',
        },
        text: 'I en liten håla under ett stort ekträd bodde en igelkott som hette Kansen. Han var liten men väldigt nyfiken på allt i skogen runt omkring.',
      },
      {
        id: 'problem',
        title: 'Problem',
        prompt: 'Vad händer? Vilket problem uppstår?',
        element: {
          id: 'lost',
          name: 'Vilse',
          emoji: '❓',
          category: 'problem',
        },
        text: 'En dag vandrade Kansen för långt in i skogen och gick vilse! Det började mörkna och han kunde inte hitta hem. Träden såg alla likadana ut.',
      },
      {
        id: 'solution',
        title: 'Lösning',
        prompt: 'Hur löser karaktären problemet?',
        element: {
          id: 'help',
          name: 'Hjälper',
          emoji: '🤝',
          category: 'action',
        },
        text: 'En klok uggla hörde Kansen snyfta. "Jag kan hjälpa dig," hoade hon. "Följ stjärnorna så hittar du hem!" En snäll hare erbjöd sig att följa med så Kansen inte skulle vara ensam.',
      },
      {
        id: 'ending',
        title: 'Slut',
        prompt: 'Hur slutar sagan?',
        element: {
          id: 'friends',
          name: 'Vänner',
          emoji: '💕',
          category: 'ending',
        },
        text: 'Kansen hittade hem till sin varma håla. Han hade lärt sig att be om hjälp och fått nya vänner! Från den dagen lekte ugglan, haren och igelkotten tillsammans varje dag.',
      },
    ],
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  // Adventure theme - Skatten på Mysterieön
  {
    id: 'demo-story-adventure',
    name: 'Skatten på Mysterieön',
    theme: 'adventure',
    stations: [
      {
        id: 'character',
        title: 'Vem?',
        prompt: 'Vem handlar sagan om?',
        element: {
          id: 'explorer',
          name: 'Utforskare',
          emoji: '🧭',
          category: 'character',
        },
        text: 'Kapten Elsa var den modigaste utforskaren på de sju haven. Med sin gamla skattkarta och sin trogna papegoja Pelle seglade hon mot Mysterieön.',
      },
      {
        id: 'problem',
        title: 'Problem',
        prompt: 'Vad händer? Vilket problem uppstår?',
        element: {
          id: 'storm',
          name: 'Storm',
          emoji: '⛈️',
          category: 'problem',
        },
        text: 'Plötsligt kom en väldig storm! Vågorna var höga som berg och vinden piskade seglen. Skeppet drev iväg och Elsa tappade bort sin skattkarta i havet!',
      },
      {
        id: 'solution',
        title: 'Lösning',
        prompt: 'Hur löser karaktären problemet?',
        element: {
          id: 'clever',
          name: 'Smart idé',
          emoji: '💡',
          category: 'action',
        },
        text: 'Men Elsa gav inte upp! Hon kom ihåg vad kartan visade. "Följ soluppgången till det tredje berget!" Pelle flög högt upp och hittade ön från luften.',
      },
      {
        id: 'ending',
        title: 'Slut',
        prompt: 'Hur slutar sagan?',
        element: {
          id: 'treasure',
          name: 'Skatt',
          emoji: '💎',
          category: 'ending',
        },
        text: 'De hittade skatten – men det var inte guld! Det var en bok full av äventyrskartor till nya platser. "Det bästa äventyret är det som väntar!" skrattade Elsa och seglade mot nya horisonter.',
      },
    ],
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
];

// Export first demo story for backward compatibility
export const demoStory = demoStories[0];
