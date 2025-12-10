import { Story } from '@/types/story';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, BookOpen, Trash2, Star, Sparkles } from 'lucide-react';
import { themes } from '@/data/themes';
import { demoStories } from '@/data/demoStory';

interface WelcomeScreenProps {
  stories: Story[];
  onCreateNew: () => void;
  onOpenStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
  onReadDemo: (story: Story) => void;
  onCopyDemo: (story: Story) => void;
}

const demoDescriptions: Record<string, string> = {
  'classic': 'En klassisk saga om vänskap och mod',
  'animals': 'En varm berättelse om vänskap i skogen',
  'adventure': 'Ett spännande äventyr på havet',
};

export function WelcomeScreen({ stories, onCreateNew, onOpenStory, onDeleteStory, onReadDemo, onCopyDemo }: WelcomeScreenProps) {
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

      {/* Demo Stories Section */}
      <div className="w-full max-w-2xl mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <h2 className="text-2xl font-bold text-foreground">Exempelsagor</h2>
        </div>
        <div className="grid gap-4">
          {demoStories.map((demo, index) => {
            const demoTheme = themes.find(t => t.id === demo.theme);
            return (
              <Card
                key={demo.id}
                className="p-5 border-2 bg-gradient-to-br from-primary/5 via-background to-secondary/10 hover:shadow-xl transition-all duration-300"
                style={{ 
                  borderColor: demoTheme?.color,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">{demoTheme?.emoji || '📖'}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">{demo.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {demoDescriptions[demo.theme] || 'En spännande saga'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => onReadDemo(demo)}
                    className="flex-1 min-w-[130px]"
                    size="sm"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Läs sagan
                  </Button>
                  <Button
                    onClick={() => onCopyDemo(demo)}
                    className="flex-1 min-w-[130px] bg-secondary hover:bg-secondary/80"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Använd som inspiration
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

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

      {/* Decorative elements - Hidden on small screens */}
      <div className="hidden md:block fixed top-10 left-10 text-6xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '0s' }}>🌟</div>
      <div className="hidden md:block fixed top-20 right-20 text-5xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '0.5s' }}>🦋</div>
      <div className="hidden md:block fixed bottom-20 left-20 text-5xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>🌈</div>
      <div className="hidden md:block fixed bottom-10 right-10 text-6xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}>✨</div>
    </div>
  );
}
