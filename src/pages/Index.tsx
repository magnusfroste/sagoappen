import { useState } from 'react';
import { Story, ThemeType } from '@/types/story';
import { useStories } from '@/hooks/useStories';
import { WelcomeScreen } from '@/components/story/WelcomeScreen';
import { ThemeSelector } from '@/components/story/ThemeSelector';
import { StoryBuilder } from '@/components/story/StoryBuilder';

type AppState = 
  | { screen: 'welcome' }
  | { screen: 'theme-selector' }
  | { screen: 'builder'; theme: ThemeType; story?: Story };

const Index = () => {
  const { stories, saveStory, deleteStory } = useStories();
  const [state, setState] = useState<AppState>({ screen: 'welcome' });

  const handleCreateNew = () => {
    setState({ screen: 'theme-selector' });
  };

  const handleSelectTheme = (theme: ThemeType) => {
    setState({ screen: 'builder', theme });
  };

  const handleOpenStory = (story: Story) => {
    setState({ screen: 'builder', theme: story.theme, story });
  };

  const handleSaveStory = (story: Story) => {
    saveStory(story);
  };

  const handleBackToWelcome = () => {
    setState({ screen: 'welcome' });
  };

  const handleBackToThemes = () => {
    setState({ screen: 'theme-selector' });
  };

  switch (state.screen) {
    case 'welcome':
      return (
        <WelcomeScreen
          stories={stories}
          onCreateNew={handleCreateNew}
          onOpenStory={handleOpenStory}
          onDeleteStory={deleteStory}
        />
      );
    
    case 'theme-selector':
      return (
        <ThemeSelector
          onSelectTheme={handleSelectTheme}
          onBack={handleBackToWelcome}
        />
      );
    
    case 'builder':
      return (
        <StoryBuilder
          initialStory={state.story}
          themeType={state.theme}
          onBack={state.story ? handleBackToWelcome : handleBackToThemes}
          onSave={handleSaveStory}
        />
      );
  }
};

export default Index;
