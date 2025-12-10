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
}

export function StoryStationCard({ 
  station, 
  themeColor, 
  onDrop, 
  onTextChange,
  onRemoveElement 
}: StoryStationCardProps) {
  const handleDrop = (element: StoryElement) => {
    playSound('success');
    onDrop(element);
  };

  const handleRemove = () => {
    playSound('remove');
    onRemoveElement();
  };

  const { isOver, dropProps } = useDrop(handleDrop);

  return (
    <div 
      className="flex flex-col bg-card rounded-2xl p-4 shadow-lg border-2 transition-all duration-300"
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

      {/* Drop Zone */}
      <div
        {...dropProps}
        className={`
          relative min-h-[100px] rounded-xl border-2 border-dashed 
          flex items-center justify-center mb-3 transition-all duration-200
          ${isOver ? 'border-primary bg-primary/10 scale-105' : 'border-border bg-muted/30'}
          ${station.element ? 'border-solid' : ''}
        `}
      >
        {station.element ? (
          <div className="relative flex flex-col items-center p-2">
            <span className="text-6xl">{station.element.emoji}</span>
            <span className="text-sm font-medium text-foreground">{station.element.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center px-4">
            Dra hit en bild 📥
          </p>
        )}
      </div>

      {/* Text Area */}
      <Textarea
        value={station.text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Skriv din text här..."
        className="resize-none text-base min-h-[80px] border-2 focus:border-primary"
      />
    </div>
  );
}
