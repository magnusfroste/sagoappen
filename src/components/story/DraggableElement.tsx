import { StoryElement } from '@/types/story';
import { useDrag } from '@/hooks/useDragDrop';
import { playSound } from '@/hooks/useSound';

interface DraggableElementProps {
  element: StoryElement;
  /** Tryck valjer bilden (iPad: HTML5-drag fungerar inte med fingret). */
  onSelect?: (element: StoryElement) => void;
  selected?: boolean;
}

export function DraggableElement({ element, onSelect, selected }: DraggableElementProps) {
  const { isDragging, dragProps } = useDrag(element);

  const handleDragStart = (e: React.DragEvent | React.TouchEvent) => {
    playSound('pickup');
    dragProps.onDragStart?.(e as React.DragEvent);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    playSound('pickup');
    dragProps.onTouchStart?.(e);
  };

  return (
    <div
      {...dragProps}
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      onClick={() => onSelect?.(element)}
      aria-pressed={!!selected}
      role="button"
      className={`
        flex flex-col items-center justify-center p-4 md:p-3 rounded-xl
        bg-card border-2 cursor-pointer active:cursor-grabbing
        transition-all duration-200 select-none touch-manipulation
        hover:scale-110 hover:shadow-lg hover:border-primary
        active:scale-105 active:shadow-xl
        min-w-[72px] min-h-[72px] md:min-w-[64px] md:min-h-[64px]
        ${selected ? 'border-primary ring-4 ring-primary/40 scale-105 shadow-xl' : 'border-border'}
        ${isDragging ? 'opacity-50 scale-110 shadow-xl ring-2 ring-primary' : ''}
      `}
      title={element.name}
    >
      <span className="text-4xl md:text-5xl pointer-events-none">{element.emoji}</span>
      <span className="text-xs font-medium text-muted-foreground mt-1 truncate max-w-full pointer-events-none">
        {element.name}
      </span>
    </div>
  );
}
