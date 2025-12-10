import { Story } from '@/types/story';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import { themes } from '@/data/themes';

interface WelcomeScreenProps {
  stories: Story[];
  onCreateNew: () => void;
  onOpenStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
}

export function WelcomeScreen({ stories, onCreateNew, onOpenStory, onDeleteStory }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-pop">
        <div className="text-8xl mb-4 animate-float">📚</div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-4">
          Sagoappen
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-md mx-auto">
          Skapa din egen magiska saga! ✨
        </p>
      </div>

      {/* Create New Button */}
      <Button
        size="lg"
        onClick={onCreateNew}
        className="text-xl px-8 py-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mb-12 bg-primary hover:bg-primary/90"
      >
        <Plus className="w-8 h-8 mr-3" />
        Skapa ny saga
      </Button>

      {/* Saved Stories */}
      {stories.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Dina sparade sagor
          </h2>
          <div className="grid gap-4">
            {stories.map((story, index) => {
              const theme = themes.find(t => t.id === story.theme);
              return (
                <Card
                  key={story.id}
                  className="p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    borderColor: theme?.color 
                  }}
                  onClick={() => onOpenStory(story)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{theme?.emoji || '📖'}</span>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {theme?.name} • Senast redigerad {new Date(story.updatedAt).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteStory(story.id);
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className="fixed top-10 left-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>🌟</div>
      <div className="fixed top-20 right-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🦋</div>
      <div className="fixed bottom-20 left-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🌈</div>
      <div className="fixed bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>✨</div>
    </div>
  );
}
