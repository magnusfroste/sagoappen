import { useState, useEffect } from 'react';
import { Story } from '@/types/story';

const STORAGE_KEY = 'sagoappen-stories';

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStories(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved stories:', e);
      }
    }
  }, []);

  const saveStory = (story: Story) => {
    const updated = stories.some(s => s.id === story.id)
      ? stories.map(s => s.id === story.id ? { ...story, updatedAt: new Date().toISOString() } : s)
      : [...stories, story];
    
    setStories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteStory = (id: string) => {
    const updated = stories.filter(s => s.id !== id);
    setStories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { stories, saveStory, deleteStory };
}
