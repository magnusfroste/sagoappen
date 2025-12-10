import { useState, useRef, useCallback } from 'react';
import { StoryElement } from '@/types/story';

// Global state for drag and drop
let currentDraggedElement: StoryElement | null = null;

export function useDrag(element: StoryElement) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((e: React.DragEvent | React.TouchEvent) => {
    currentDraggedElement = element;
    setIsDragging(true);
    
    if ('dataTransfer' in e) {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('text/plain', element.id);
    }
  }, [element]);

  const handleDragEnd = useCallback(() => {
    currentDraggedElement = null;
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    currentDraggedElement = element;
    setIsDragging(true);
  }, [element]);

  const handleTouchEnd = useCallback(() => {
    currentDraggedElement = null;
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    dragProps: {
      draggable: true,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  };
}

export function useDrop(onDrop: (element: StoryElement) => void) {
  const [isOver, setIsOver] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    if (currentDraggedElement) {
      onDrop(currentDraggedElement);
      currentDraggedElement = null;
    }
  }, [onDrop]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!currentDraggedElement || !dropRef.current) return;
    
    const touch = e.touches[0];
    const rect = dropRef.current.getBoundingClientRect();
    
    const isInside = 
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom;
    
    setIsOver(isInside);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (isOver && currentDraggedElement) {
      onDrop(currentDraggedElement);
    }
    setIsOver(false);
  }, [isOver, onDrop]);

  return {
    isOver,
    dropRef,
    dropProps: {
      ref: dropRef,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

export function getCurrentDraggedElement() {
  return currentDraggedElement;
}
