import { StoryElement } from '@/types/story';
import { useDrag } from '@/hooks/useDragDrop';
import { playSound } from '@/hooks/useSound';

interface DraggableElementProps {
  element: StoryElement;
}

export function DraggableElement({ element }: DraggableElementProps) {
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
      className={`
        flex flex-col items-center justify-center p-4 md:p-3 rounded-xl
        bg-card border-2 border-border cursor-grab active:cursor-grabbing
        transition-all duration-200 select-none touch-action-none touch-manipulation
        hover:scale-110 hover:shadow-lg hover:border-primary
        active:scale-105 active:shadow-xl active:border-primary
        min-w-[72px] min-h-[72px] md:min-w-[64px] md:min-h-[64px]
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
