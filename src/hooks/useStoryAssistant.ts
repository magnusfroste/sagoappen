import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error: invokeError } = await supabase.functions.invoke('story-assistant', {
        body: {
          action,
          station: context.station,
          theme: context.theme,
          themeName: context.themeName,
          element: context.element,
          currentText: context.currentText,
        },
      });

      if (invokeError) {
        throw invokeError;
      }

      if (data.error) {
        setError(data.error);
        return null;
      }

      setMessage(data.message);
      return data.message;
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
