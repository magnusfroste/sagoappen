import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useStoryAssistant, AssistantAction } from '@/hooks/useStoryAssistant';
import { useNarration } from '@/hooks/useNarration';
import { StoryElement } from '@/types/story';
import { Wand2, HelpCircle, Sparkles, ChevronDown, Loader2, Volume2, VolumeX } from 'lucide-react';

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
  const { isPlaying: isSpeaking, isLoading: isSpeechLoading, narrateText, stopNarration } = useNarration();
  const [isMinimized, setIsMinimized] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState<string | null>(null);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Clean text for TTS (remove emojis)
  const cleanTextForSpeech = (text: string) => {
    return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopNarration();
    } else if (displayedMessage) {
      narrateText(cleanTextForSpeech(displayedMessage));
    }
  };

  // Typing animation effect
  const animateTyping = (text: string) => {
    setIsTyping(true);
    setTypingText('');
    setHasNewMessage(true);
    
    let index = 0;
    const speed = 25; // ms per character
    
    if (typingRef.current) clearInterval(typingRef.current);
    
    typingRef.current = setInterval(() => {
      if (index < text.length) {
        setTypingText(text.slice(0, index + 1));
        index++;
      } else {
        if (typingRef.current) clearInterval(typingRef.current);
        setIsTyping(false);
        setTimeout(() => setHasNewMessage(false), 500);
      }
    }, speed);
  };

  // Update greeting when station changes
  useEffect(() => {
    const greeting = STATION_GREETINGS[activeStation] || STATION_GREETINGS.character;
    setDisplayedMessage(greeting);
    animateTyping(greeting);
    clearMessage();
    
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [activeStation, clearMessage]);

  // Update displayed message when AI responds
  useEffect(() => {
    if (message) {
      setDisplayedMessage(message);
      animateTyping(message);
    }
    if (error) {
      const errorMsg = `😅 ${error}`;
      setDisplayedMessage(errorMsg);
      animateTyping(errorMsg);
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

    if (action === 'generate' && result && onSuggestion) {
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
    <div className={`bg-card border-2 border-primary/30 rounded-2xl p-4 shadow-xl relative transition-all duration-300 ${hasNewMessage ? 'animate-pop' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`text-4xl transition-transform duration-300 ${isLoading ? 'animate-wiggle' : isTyping ? 'animate-bounce-soft' : 'hover:animate-wiggle'}`}>
            🧙
          </div>
          <div>
            <h3 className="font-bold text-foreground">Trollis</h3>
            <p className="text-xs text-muted-foreground">Din sagohjälpare</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMinimized(true)}
          className="text-muted-foreground hover:text-foreground hover:scale-110 transition-transform"
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      </div>

      {/* Speech Bubble */}
      <div className={`bg-muted/50 rounded-xl p-4 mb-4 relative transition-all duration-200 ${hasNewMessage ? 'scale-[1.02]' : 'scale-100'}`}>
        <div className="absolute -top-2 left-6 w-4 h-4 bg-muted/50 rotate-45" />
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="animate-pulse">Trollis tänker...</span>
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        ) : (
          <div className="flex gap-2">
            <p className="text-foreground text-sm leading-relaxed min-h-[3rem] flex-1">
              {typingText}
              {isTyping && <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />}
            </p>
            {displayedMessage && !isTyping && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeak}
                disabled={isSpeechLoading}
                className="shrink-0 text-muted-foreground hover:text-primary transition-colors h-8 w-8"
                title={isSpeaking ? 'Stoppa uppläsning' : 'Lyssna på Trollis'}
              >
                {isSpeechLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isSpeaking ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('tips')}
          disabled={isLoading}
          className="flex-1 min-w-[100px] border-primary/30 hover:bg-primary/10 hover:scale-105 active:scale-95 transition-transform"
        >
          <Sparkles className={`w-4 h-4 mr-1 ${isLoading ? '' : 'group-hover:animate-spin'}`} />
          Tips
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('question')}
          disabled={isLoading}
          className="flex-1 min-w-[100px] border-primary/30 hover:bg-primary/10 hover:scale-105 active:scale-95 transition-transform"
        >
          <HelpCircle className="w-4 h-4 mr-1" />
          Fråga mig
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => handleAction('generate')}
          disabled={isLoading}
          className="flex-1 min-w-[100px] hover:scale-105 active:scale-95 transition-transform group"
        >
          <Wand2 className="w-4 h-4 mr-1 group-hover:rotate-12 transition-transform" />
          Trollstaven
        </Button>
        {currentText && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAction('improve')}
            disabled={isLoading}
            className="flex-1 min-w-[100px] hover:scale-105 active:scale-95 transition-transform animate-fade-in"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Förbättra
          </Button>
        )}
      </div>

      {/* Encouragement */}
      <p className="text-xs text-center text-muted-foreground mt-3 animate-fade-in">
        💡 Försök gärna själv först - jag finns här om du kör fast!
      </p>
    </div>
  );
}