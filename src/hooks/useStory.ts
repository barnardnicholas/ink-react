import { Story } from 'inkjs';
import { Choice as ChoiceType } from 'inkjs/engine/Choice';
import { Story as StoryType } from 'inkjs/engine/Story';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseStory {
  story: StoryType;
  storyElements: StoryElement[];
  storyChoices: StoryElement[];
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
  seen: boolean;
}
/* eslint-disable */
const useStory = (inkFile: Record<string, any>): UseStory => {
  /* eslint-enable */
  const storyRef = useRef<StoryType>(new Story(inkFile));
  const [storyElements, setStoryElements] = useState<StoryElement[]>([]);
  const [storyChoices, setStoryChoices] = useState<StoryElement[]>([]);

  function end() {
    setStoryChoices([]);
    console.log('THE END');
  }

  const continueToNextChoice = useCallback(() => {
    if (!storyRef.current) return;
    if (!storyRef.current?.canContinue && storyRef.current?.currentChoices.length === 0) end();

    while (storyRef.current?.canContinue) {
      const text: string = storyRef.current.Continue() as string;
      setStoryElements((prevState: StoryElement[]) => {
        return [...prevState, { text, type: StoryElementType.TEXT, i: 0, seen: false }];
      });
    }

    if (storyRef.current?.currentChoices.length > 0) {
      setStoryChoices(
        storyRef.current.currentChoices.map((choice: ChoiceType, i: number) => ({
          text: `${i + 1}. ${choice.text}`,
          type: StoryElementType.CHOICE,
          i: i + 1,
          seen: false,
        })),
      );
    } else {
      setStoryChoices([]);
      end();
    }
  }, []);

  function chooseAnswer(chosenAnswer: number) {
    if (!storyRef.current) return;
    console.log(storyRef.current);
    setStoryElements((prevState: StoryElement[]) =>
      prevState.map((choice: StoryElement) => ({ ...choice, seen: true })),
    );
    storyRef.current.ChooseChoiceIndex(chosenAnswer - 1);
    setStoryChoices([]);
    continueToNextChoice();
  }

  useEffect(() => {
    if (storyRef.current) continueToNextChoice();
  }, [continueToNextChoice]);

  return {
    story: storyRef.current,
    storyElements,
    storyChoices,
    continueToNextChoice,
    end,
    chooseAnswer,
  };
};

export default useStory;
