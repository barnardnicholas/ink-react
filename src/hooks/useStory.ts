import { Story } from 'inkjs';
import { Choice as ChoiceType } from 'inkjs/engine/Choice';
import { ErrorType } from 'inkjs/engine/Error';
import { Story as StoryType } from 'inkjs/engine/Story';
import { useCallback, useEffect, useRef, useState } from 'react';
import usePrevious from './usePrevious';

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
  const prevProps = usePrevious({ story: storyRef.current });

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
    setStoryElements((prevState: StoryElement[]) =>
      prevState.map((choice: StoryElement) => ({ ...choice, seen: true })),
    );
    storyRef.current.ChooseChoiceIndex(chosenAnswer - 1);
    setStoryChoices([]);
    continueToNextChoice();
  }

  useEffect(() => {
    if (storyRef.current) {
      storyRef.current.onError = (msg, type) => {
        if (type === ErrorType.Warning) console.warn(msg);
        else console.error(msg);
      }; // Handle story errors
      // storyRef.current.BindExternalFunction(
      //   'playSound',
      //   (audioName: string) => {
      //     console.log(`Playing ${audioName}`);
      //   },
      //   true,
      // ); // Trigger external funciton from within ink
    }
  }, []);

  useEffect(() => {
    console.log(storyRef?.current?.currentTags);
  }, [storyRef?.current?.currentTags, prevProps.story.currentTags]);

  useEffect(() => {
    if (storyRef.current) continueToNextChoice();
  }, [continueToNextChoice]); // Advance story on mount

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

// story.ObserveVariable('variableName', (varName, newValue) => {})
// story.state.VisitCountAtPathString("...") How many times was a know visited?
// story.currentTags // tags
// story.state.ToJson() // Save State
// story.state.LoadJson(savedJSON) // Restore State
