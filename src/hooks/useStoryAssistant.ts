import { useState, useCallback } from 'react';
import { trollisAnswer } from '@/lib/trollis';
import { StoryElement } from '@/types/story';

export type AssistantAction = 'tips' | 'question' | 'generate' | 'improve';

interface UseStoryAssistantProps {
  station: string;
  theme: string;
  themeName: string;
  element: StoryElement | null;
  currentText: string;
}

export function useStoryAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const askTrollis = useCallback(async (
    action: AssistantAction,
    context: UseStoryAssistantProps
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const answer = trollisAnswer(action, {
        station: context.station,
        theme: context.theme,
        themeName: context.themeName,
        element: context.element,
        currentText: context.currentText,
      });
      setMessage(answer);
      return answer;
    } catch (err) {
      console.error('Trollis error:', err);
      setError('Trollis snubblade på sin trollstav! Försök igen. 🪄');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
    setError(null);
  }, []);

  return {
    isLoading,
    message,
    error,
    askTrollis,
    clearMessage,
  };
}
