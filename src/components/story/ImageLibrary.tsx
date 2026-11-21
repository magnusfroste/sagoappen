import { useState } from 'react';
import { Theme, ElementCategory, StoryElement } from '@/types/story';
import { DraggableElement } from './DraggableElement';

interface ImageLibraryProps {
  theme: Theme;
  /** Tryck pa en bild valjer den; sedan trycker man pa en station. */
  onSelect?: (element: StoryElement) => void;
  selectedId?: string | null;
}

const categories: { id: ElementCategory; label: string; emoji: string }[] = [
  { id: 'character', label: 'Karaktärer', emoji: '👤' },
  { id: 'place', label: 'Platser', emoji: '🏞️' },
  { id: 'object', label: 'Föremål', emoji: '🎒' },
  { id: 'problem', label: 'Problem', emoji: '⚠️' },
  { id: 'action', label: 'Handling', emoji: '💪' },
  { id: 'ending', label: 'Slut', emoji: '🎉' },
];

export function ImageLibrary({ theme, onSelect, selectedId }: ImageLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<ElementCategory>('character');
  
  const filteredElements = theme.elements.filter(e => e.category === activeCategory);

  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg border-2 border-border">
      <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
        <span className="text-2xl">{theme.emoji}</span>
        Bildbibliotek
      </h2>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium transition-all
              flex items-center gap-1
              ${activeCategory === cat.id 
                ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }
            `}
          >
            <span>{cat.emoji}</span>
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Elements Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {filteredElements.map(element => (
          <DraggableElement
            key={element.id}
            element={element}
            selected={selectedId === element.id}
            onSelect={onSelect}
          />
        ))}
      </div>
      
      {filteredElements.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-4">
          Inga element i denna kategori
        </p>
      )}
    </div>
  );
}
