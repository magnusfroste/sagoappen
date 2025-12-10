import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStoryAssistant, AssistantAction } from '@/hooks/useStoryAssistant';
import { StoryElement } from '@/types/story';
import { Wand2, HelpCircle, Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface StoryAssistantProps {
  activeStation: string;
  theme: string;
  themeName: string;
  element: StoryElement | null;
  currentText: string;
  onSuggestion?: (text: string) => void;
}

const STATION_GREETINGS: Record<string, string> = {
  character: '🧙 Hej! Vem ska din saga handla om? En bra saga börjar med att berätta VEM huvudpersonen är och VAR hen bor!',
  problem: '🧙 Nu behöver vi lite spänning! Vad händer som gör att hjälten måste göra något? 😱',
  solution: '🧙 Hur löser hjälten problemet? Använder hen list, mod eller hjälp från en vän? 💪',
  ending: '🧙 Hur slutar sagan? Blev alla glada? Lärde sig hjälten något? 🎉',
};

export function StoryAssistant({
  activeStation,
  theme,
  themeName,
  element,
  currentText,
  onSuggestion,
}: StoryAssistantProps) {
  const { isLoading, message, error, askTrollis, clearMessage } = useStoryAssistant();
  const [isMinimized, setIsMinimized] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState<string | null>(null);

  // Update greeting when station changes
  useEffect(() => {
    setDisplayedMessage(STATION_GREETINGS[activeStation] || STATION_GREETINGS.character);
    clearMessage();
  }, [activeStation, clearMessage]);

  // Update displayed message when AI responds
  useEffect(() => {
    if (message) {
      setDisplayedMessage(message);
    }
    if (error) {
      setDisplayedMessage(`😅 ${error}`);
    }
  }, [message, error]);

  const handleAction = async (action: AssistantAction) => {
    const result = await askTrollis(action, {
      station: activeStation,
      theme,
      themeName,
      element,
      currentText,
    });

    // If generate action and we got a result, offer to use it
    if (action === 'generate' && result && onSuggestion) {
      // Extract just the suggestion part if possible
      onSuggestion(result);
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:scale-110 transition-transform animate-bounce"
      >
        <span className="text-3xl">🧙</span>
      </button>
    );
  }

  return (
    <div className="bg-card border-2 border-primary/30 rounded-2xl p-4 shadow-xl relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-4xl animate-pulse">🧙</div>
          <div>
            <h3 className="font-bold text-foreground">Trollis</h3>
            <p className="text-xs text-muted-foreground">Din sagohjälpare</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMinimized(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      </div>

      {/* Speech Bubble */}
      <div className="bg-muted/50 rounded-xl p-4 mb-4 relative">
        <div className="absolute -top-2 left-6 w-4 h-4 bg-muted/50 rotate-45" />
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Trollis tänker...</span>
          </div>
        ) : (
          <p className="text-foreground text-sm leading-relaxed">
            {displayedMessage}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('tips')}
          disabled={isLoading}
          className="flex-1 min-w-[100px] border-primary/30 hover:bg-primary/10"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Tips
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('question')}
          disabled={isLoading}
          className="flex-1 min-w-[100px] border-primary/30 hover:bg-primary/10"
        >
          <HelpCircle className="w-4 h-4 mr-1" />
          Fråga mig
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => handleAction('generate')}
          disabled={isLoading}
          className="flex-1 min-w-[100px]"
        >
          <Wand2 className="w-4 h-4 mr-1" />
          Trollstaven
        </Button>
        {currentText && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAction('improve')}
            disabled={isLoading}
            className="flex-1 min-w-[100px]"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Förbättra
          </Button>
        )}
      </div>

      {/* Encouragement */}
      <p className="text-xs text-center text-muted-foreground mt-3">
        💡 Försök gärna själv först - jag finns här om du kör fast!
      </p>
    </div>
  );
}
