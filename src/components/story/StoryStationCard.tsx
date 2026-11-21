import { useRef, useEffect } from 'react';
import { StoryStation, StoryElement } from '@/types/story';
import { useDrop } from '@/hooks/useDragDrop';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playSound } from '@/hooks/useSound';

interface StoryStationCardProps {
  station: StoryStation;
  themeColor: string;
  onDrop: (element: StoryElement) => void;
  onTextChange: (text: string) => void;
  onRemoveElement: () => void;
  onFocus?: () => void;
  isActive?: boolean;
  /** Bild vald i biblioteket - da racker det att trycka pa zonen. */
  valdBild?: StoryElement | null;
  onPlaceSelected?: () => void;
}

export function StoryStationCard({ 
  station, 
  themeColor, 
  onDrop, 
  onTextChange,
  onRemoveElement,
  onFocus,
  isActive = false,
  valdBild = null,
  onPlaceSelected,
}: StoryStationCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDrop = (element: StoryElement) => {
    playSound('success');
    onDrop(element);
  };

  const handleRemove = () => {
    playSound('remove');
    onRemoveElement();
  };

  const { isOver, dropProps } = useDrop(handleDrop);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [station.text]);

  return (
    <div 
      className={`flex flex-col bg-card rounded-2xl p-4 shadow-lg border-2 transition-all duration-300 ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      style={{ borderColor: themeColor }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg"
          style={{ backgroundColor: themeColor }}
        >
          {station.id === 'character' ? '1' : station.id === 'problem' ? '2' : station.id === 'solution' ? '3' : '4'}
        </div>
        <div>
          <h3 className="font-bold text-foreground">{station.title}</h3>
          <p className="text-xs text-muted-foreground">{station.prompt}</p>
        </div>
      </div>

      {/* Drop Zone - Touch optimized */}
      <div
        {...dropProps}
        onClick={() => {
          if (valdBild) {
            onPlaceSelected?.();
            handleDrop(valdBild);
          }
        }}
        className={`
          relative min-h-[120px] md:min-h-[100px] rounded-xl border-3 border-dashed 
          flex items-center justify-center mb-3 transition-all duration-200
          ${isOver ? 'border-primary bg-primary/20 scale-105 shadow-lg' : 'border-border bg-muted/30'}
          ${station.element ? 'border-solid border-2' : ''}
          ${valdBild ? 'border-primary bg-primary/10 cursor-pointer' : ''}
          touch-manipulation
        `}
      >
        {station.element ? (
          <div className="relative flex flex-col items-center p-3">
            <span className="text-6xl md:text-6xl">{station.element.emoji}</span>
            <span className="text-sm font-medium text-foreground mt-1">{station.element.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="absolute -top-3 -right-3 w-10 h-10 md:w-8 md:h-8 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95 transition-transform touch-manipulation shadow-md"
            >
              <X className="w-5 h-5 md:w-4 md:h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center px-4 py-2">
            <p className="text-muted-foreground text-sm">Dra hit en bild 📥</p>
            <p className="text-muted-foreground/60 text-xs mt-1 hidden md:block">eller tryck på en bild ovan</p>
          </div>
        )}
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={station.text}
        onChange={(e) => onTextChange(e.target.value)}
        onFocus={onFocus}
        placeholder="Skriv din text här..."
        className="text-base min-h-[80px] max-h-[200px] border-2 focus:border-primary transition-all duration-200 overflow-y-auto"
      />
    </div>
  );
}
