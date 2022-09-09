import { Story } from 'inkjs';
import { Choice as ChoiceType } from 'inkjs/engine/Choice';
import { Story as StoryType } from 'inkjs/engine/Story';
import { useCallback, useEffect, useState } from 'react';
import usePrevious from './usePrevious';

let story: StoryType | null;

interface UseStory {
  story: StoryType | null;
  storyElements: StoryElement[];
  continueToNextChoice: () => void;
  end: () => void;
  chooseAnswer: (chosenAnswer: number) => void;
}

export enum StoryElementType {
  TEXT = 0,
  CHOICE = 1,
}

export interface StoryElement {
  text: string;
  type: StoryElementType;
  i: number;
}
/* eslint-disable */
const useStory = (inkFile: Record<string, any>): UseStory => {
  /* eslint-enable */
  const [storyElements, setStoryElements] = useState<StoryElement[]>([]);
  const prevProps = usePrevious({ story });

  function end() {
    console.log('THE END');
  }

  const continueToNextChoice = useCallback(() => {
    if (!story) return;
    if (!story.canContinue && story.currentChoices.length === 0) end();

    while (story.canContinue) {
      const text: string = story.Continue() as string;
      setStoryElements((prevState: StoryElement[]) => {
        return [...prevState, { text, type: StoryElementType.TEXT, i: 0 }];
      });
    }

    if (story.currentChoices.length > 0) {
      story.currentChoices.forEach((choice: ChoiceType, i: number) => {
        // console.log(`${i + 1}. ${choice.text}`); // Display answer
        setStoryElements((prevState: StoryElement[]) => {
          return [
            ...prevState,
            { text: `${i + 1}. ${choice.text}`, type: StoryElementType.CHOICE, i: i + 1 },
          ];
        });
      });
    } else {
      end();
    }
  }, []);

  function chooseAnswer(chosenAnswer: number) {
    if (!story) return;
    story.ChooseChoiceIndex(chosenAnswer - 1);
    continueToNextChoice();
  }

  useEffect(() => {
    if (inkFile && !story) story = new Story(inkFile);
  }, [inkFile]);

  useEffect(() => {
    if (story && !prevProps.story) continueToNextChoice();
  }, [prevProps.story, continueToNextChoice]);

  return { story, storyElements, continueToNextChoice, end, chooseAnswer };
};

export default useStory;
