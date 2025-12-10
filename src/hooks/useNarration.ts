import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      const { data, error } = await supabase.functions.invoke('story-narration', {
        body: { text },
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate narration');
      }

      const audioUrl = URL.createObjectURL(data);
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
