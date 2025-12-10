import { useEffect, useState } from 'react';
import { StoryElement } from '@/types/story';
import { getCurrentDraggedElement, subscribeToDragState } from '@/hooks/useDragDrop';

export function DragGhost() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [element, setElement] = useState<StoryElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const draggedElement = getCurrentDraggedElement();
      if (draggedElement && e.touches.length > 0) {
        const touch = e.touches[0];
        setPosition({ x: touch.clientX, y: touch.clientY });
        setElement(draggedElement);
        setIsVisible(true);
      }
    };

    const handleTouchEnd = () => {
      setIsVisible(false);
      setElement(null);
      setPosition(null);
    };

    const handleDragStateChange = (isDragging: boolean, draggedElement: StoryElement | null) => {
      if (!isDragging) {
        setIsVisible(false);
        setElement(null);
        setPosition(null);
      } else if (draggedElement) {
        setElement(draggedElement);
      }
    };

    // Subscribe to drag state changes
    const unsubscribe = subscribeToDragState(handleDragStateChange);

    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      unsubscribe();
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  if (!isVisible || !element || !position) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75"
      style={{
        left: position.x - 40,
        top: position.y - 50,
        transform: 'scale(1.2)',
      }}
    >
      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-card border-2 border-primary shadow-2xl animate-pulse">
        <span className="text-5xl">{element.emoji}</span>
        <span className="text-xs font-medium text-foreground mt-1">
          {element.name}
        </span>
      </div>
    </div>
  );
}
