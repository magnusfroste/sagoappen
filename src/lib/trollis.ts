import type { AssistantAction } from '@/hooks/useStoryAssistant';
import type { StoryElement } from '@/types/story';

/**
 * Trollis utan moln: alla svar skapas lokalt av små regler och ordlistor.
 * Inget skickas någonstans och inget behöver logga in.
 */

type Ctx = {
  station: string;
  theme: string;
  themeName: string;
  element: StoryElement | null;
  currentText: string;
};

const rnd = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const name = (c: Ctx) => (c.element ? c.element.name.toLowerCase() : 'huvudpersonen');

const STATION_HINTS: Record<string, string[]> = {
  character: [
    'Berätta vad {n} heter och hur {n} ser ut.',
    'Vad tycker {n} om att göra på dagarna?',
    'Ge {n} en hemlighet som ingen annan vet.',
  ],
  problem: [
    'Vad är det som går fel för {n}? Gör problemet stort och tydligt.',
    'Vem eller vad ställer till det? Berätta med en mening.',
    'Hur känns det när problemet händer? Arg, rädd eller ledsen?',
  ],
  solution: [
    'Låt {n} prova en idé som inte fungerar först.',
    'Någon annan kan hjälpa till – vem då?',
    'Skriv hur {n} löser problemet steg för steg.',
  ],
  ending: [
    'Hur slutar det? Berätta vad alla gör efteråt.',
    'Låt sista meningen vara glad och tydlig.',
    'Vad har {n} lärt sig av äventyret?',
  ],
};

const STATION_QUESTIONS: Record<string, string[]> = {
  character: ['Vad heter din huvudperson?', 'Vad har den för sig helst?', 'Hur ser den ut?'],
  problem: ['Vad är det värsta som kan hända?', 'Vad vill huvudpersonen ha som den inte får?', 'Vem är i vägen?'],
  solution: ['Vem kan hjälpa till?', 'Vad provar den först?', 'Vad gör att det till slut går?'],
  ending: ['Hur känns det på slutet?', 'Vad gör alla sedan?', 'Vad kommer du ihåg från sagan?'],
};

const OPENERS = [
  'Det var en gång',
  'För länge sedan',
  'En morgon, alldeles nyss',
  'I ett land långt bort',
];

const MIDDLES = [
  'Men plötsligt hände något som ingen hade räknat med.',
  'Då kom en idé som ingen annan hade tänkt på.',
  'Ingen vågade först, men sedan tog någon mod till sig.',
  'Det blev tyst, och alla tittade på varandra.',
];

const ENDINGS = [
  'Och sedan levde de lyckliga i alla sina dagar.',
  'Alla firade hela natten, och ingen var ledsen längre.',
  'Så blev det lugnt igen, och solen gick upp över taken.',
  'Ingen glömde den dagen, allra minst huvudpersonen.',
];

const THEME_WORDS: Record<string, string[]> = {
  classic: ['slott', 'skog', 'torn', 'grotta', 'krona', 'svärd', 'trollstav'],
  animals: ['skog', 'äng', 'sjö', 'hage', 'bo', 'lya', 'träd'],
  adventure: ['öken', 'berg', 'flod', 'karta', 'skepp', 'grotta', 'bro'],
};

const pickWord = (theme: string) => rnd(THEME_WORDS[theme] ?? THEME_WORDS.classic);

const fill = (tpl: string, c: Ctx) => tpl.replace(/\{n\}/g, name(c));

export function trollisAnswer(action: AssistantAction, c: Ctx): string {
  if (action === 'tips') {
    return fill(rnd(STATION_HINTS[c.station] ?? STATION_HINTS.character), c);
  }
  if (action === 'question') {
    return rnd(STATION_QUESTIONS[c.station] ?? STATION_QUESTIONS.character);
  }
  if (action === 'improve') {
    const words = c.currentText.trim().split(/\s+/).filter(Boolean).length;
    if (words === 0) return 'Skriv en mening först, så hjälper jag dig att göra den längre. ✍️';
    if (words < 6) return 'Bra början! Lägg till hur det ser ut eller låter, så blir det lättare att se framför sig.';
    if (!/[.!?]$/.test(c.currentText.trim())) return 'Fint! Sätt punkt eller frågetecken på slutet, så blir det lättare att läsa.';
    return 'Bra skrivet! Prova att byta ut ett ord mot ett mer spännande – till exempel "gick" mot "smög". ✨';
  }

  // generate
  if (c.station === 'character') {
    return `${rnd(OPENERS)} en ${name(c)} som bodde vid ${pickWord(c.theme)} och längtade efter något spännande.`;
  }
  if (c.station === 'problem') {
    return `Men en dag blev det problem: ${name(c)} kunde inte komma vidare, och ingen visste hur det skulle gå.`;
  }
  if (c.station === 'solution') {
    return `${rnd(MIDDLES)} ${name(c)} tog mod till sig och frågade om hjälp, och tillsammans hittade de en väg framåt.`;
  }
  return rnd(ENDINGS);
}