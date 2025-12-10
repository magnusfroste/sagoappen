import { Theme } from '@/types/story';
import { DraggableElement } from './DraggableElement';

interface ImageLibraryProps {
  theme: Theme;
}

export function ImageLibrary({ theme }: ImageLibraryProps) {
  const characters = theme.elements.filter(e => e.category === 'character');
  const places = theme.elements.filter(e => e.category === 'place');
  const objects = theme.elements.filter(e => e.category === 'object');

  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg border-2 border-border">
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="text-2xl">{theme.emoji}</span>
        Bildbibliotek
      </h2>
      
      <div className="space-y-4">
        {/* Characters */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Karaktärer</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 story-elements-scroll">
            {characters.map(element => (
              <DraggableElement key={element.id} element={element} />
            ))}
          </div>
        </div>

        {/* Places */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Platser</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 story-elements-scroll">
            {places.map(element => (
              <DraggableElement key={element.id} element={element} />
            ))}
          </div>
        </div>

        {/* Objects */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Föremål</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 story-elements-scroll">
            {objects.map(element => (
              <DraggableElement key={element.id} element={element} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
