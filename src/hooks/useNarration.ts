import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Shipholm's voice for apps: only the app's own address may call it (not localhost).
const SPEAK_URL = 'https://api.shipholm.com/speak';
const PART = 2800; // Shipholm takes at most 3000 characters a call

function parts(text: string): string[] {
  const out: string[] = [];
  let cur = '';
  for (const sentence of text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?…])\s+/)) {
    if (cur && cur.length + 1 + sentence.length > PART) { out.push(cur); cur = ''; }
    cur = cur ? `${cur} ${sentence}` : sentence;
    while (cur.length > PART) { out.push(cur.slice(0, PART)); cur = cur.slice(PART); }
  }
  if (cur) out.push(cur);
  return out;
}

async function speak(text: string): Promise<Blob> {
  const audio: Blob[] = [];
  for (const part of parts(text)) {
    const response = await fetch(SPEAK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: part, voice: 'nst', speed: 0.9 }),
    });
    if (!response.ok) {
      throw new Error(response.status === 429
        ? 'Nu har sagorna lästs upp många gånger i dag. Försök igen i morgon.'
        : 'Uppläsningen fungerar inte just nu');
    }
    audio.push(await response.blob());
  }
  return new Blob(audio, { type: 'audio/mpeg' });
}

export function useNarration() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const stopNarration = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStationIndex(null);
  }, []);

  const narrateText = useCallback(async (text: string, stationIndex?: number) => {
    if (isLoading) return;

    stopNarration();
    setIsLoading(true);
    
    if (stationIndex !== undefined) {
      setCurrentStationIndex(stationIndex);
    }

    try {
      // Shipholm reads the text aloud (its own Piper voice, POST /speak) – the app needs no
      // server of its own. A long story goes in parts, played as one.
      const audioBlob = await speak(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentStationIndex(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentStationIndex(null);
        toast({
          title: 'Kunde inte spela upp',
          description: 'Något gick fel vid uppspelningen',
          variant: 'destructive',
        });
      };

      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Narration error:', error);
      toast({
        title: 'Uppläsning misslyckades',
        description: error instanceof Error ? error.message : 'Kunde inte läsa upp texten',
        variant: 'destructive',
      });
      setCurrentStationIndex(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, stopNarration, toast]);

  const narrateStory = useCallback(async (storyTexts: { title: string; text: string }[]) => {
    // Combine all story parts into one narration
    const fullText = storyTexts
      .filter(part => part.text)
      .map(part => part.text)
      .join('\n\n');

    if (!fullText) {
      toast({
        title: 'Ingen text att läsa',
        description: 'Sagan har ingen text att läsa upp',
        variant: 'destructive',
      });
      return;
    }

    await narrateText(fullText);
  }, [narrateText, toast]);

  return {
    isPlaying,
    isLoading,
    currentStationIndex,
    narrateText,
    narrateStory,
    stopNarration,
  };
}
