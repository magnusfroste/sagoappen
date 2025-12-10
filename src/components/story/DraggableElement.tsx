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
        flex flex-col items-center justify-center p-3 rounded-xl
        bg-card border-2 border-border cursor-grab active:cursor-grabbing
        transition-all duration-200 select-none touch-action-none
        hover:scale-110 hover:shadow-lg hover:border-primary
        ${isDragging ? 'opacity-50 scale-110 shadow-xl' : ''}
      `}
      title={element.name}
    >
      <span className="text-4xl md:text-5xl">{element.emoji}</span>
      <span className="text-xs font-medium text-muted-foreground mt-1 truncate max-w-full">
        {element.name}
      </span>
    </div>
  );
}
