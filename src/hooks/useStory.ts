import { Story } from 'inkjs';
import { Choice as ChoiceType } from 'inkjs/engine/Choice';
import { ErrorType } from 'inkjs/engine/Error';
import { Story as StoryType } from 'inkjs/engine/Story';
import { useCallback, useEffect, useRef, useState } from 'react';
import { storyElementDelay } from '../constants/story';
import saveFile from '../assets/saves/dummySave.json';

interface UseStory {
  story: StoryType;
  storyElements: StoryElement[];
  storyChoices: StoryElement[];
  continueToNextChoice: () => void;
  end: () => void;
  chooseAnswer: (chosenAnswer: number) => void;
  saveStoryToJSON: VoidFunction;
  loadStoryFromJSON: VoidFunction;
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

export interface StorySave {
  inkJSON: string;
  storyElements: StoryElement[];
}

const useStory = (inkFile: Record<string, any>): UseStory => {
  const storyRef = useRef<StoryType>(new Story(inkFile));
  const [storyElements, setStoryElements] = useState<StoryElement[]>([]);
  const [storyChoices, setStoryChoices] = useState<StoryElement[]>([]);

  function end() {
    setStoryChoices([]);
    setStoryElements((prevState: StoryElement[]) => {
      return [...prevState, { text: 'THE END', type: StoryElementType.TEXT, i: 0, seen: false }];
    });
  }

  const continueToNextChoice = useCallback(() => {
    if (!storyRef.current.canContinue && storyRef.current.currentChoices.length === 0) end(); // End if there are no choices

    const nextStoryElements: StoryElement[] = []; // Accumulate new story elements here

    while (storyRef.current.canContinue) {
      const text: string = storyRef.current.Continue() as string;
      nextStoryElements.push({ text, type: StoryElementType.TEXT, i: 0, seen: false });
    } // Continue story to next choice & save new elements

    setStoryElements((prevState: StoryElement[]) => {
      return [...prevState, ...nextStoryElements];
    }); // Update storyElements state

    if (storyRef.current.currentChoices.length > 0) {
      setTimeout(
        () =>
          setStoryChoices(
            storyRef.current.currentChoices.map((choice: ChoiceType, i: number) => ({
              text: `${i + 1}. ${choice.text}`,
              type: StoryElementType.CHOICE,
              i: i + 1,
              seen: false,
            })),
          ),
        storyElementDelay * nextStoryElements.length,
      ); // Wait for animations on new storyElements, then update choices
    } else {
      end(); // End story
    }
  }, []);

  function chooseAnswer(chosenAnswer: number) {
    setStoryElements((prevState: StoryElement[]) =>
      prevState.map((choice: StoryElement) => ({ ...choice, seen: true })),
    ); // Mark existing story elements as seen
    storyRef.current.ChooseChoiceIndex(chosenAnswer - 1); // Make selection in story
    setStoryChoices([]); // Clear out choices
    continueToNextChoice(); // Continue story
  }

  function saveStoryToJSON() {
    try {
      const inkJSON = storyRef.current.state.toJson();
      const storySave: StorySave = {
        inkJSON,
        storyElements,
      };
      console.dir(storySave); // Print save file to console for now
    } catch (e) {
      console.warn(e);
    }
  }

  function loadStoryFromJSON() {
    try {
      // Clear out old text and choices
      setStoryElements([]);
      setStoryChoices([]);

      // Import save file from dummy Data for now
      const { inkJSON, storyElements: newStoryElements }: StorySave = { ...saveFile };
      const textElements: StoryElement[] = newStoryElements.filter(
        (element: StoryElement) => element.type === StoryElementType.TEXT,
      ); // Filter text elements from save data
      const choiceElements: StoryElement[] = newStoryElements.filter(
        (element: StoryElement) => element.type === StoryElementType.CHOICE,
      ); // Filter Choices from save data

      storyRef.current.state.LoadJson(inkJSON); // Update Story object

      setStoryElements(textElements); // Update storyElements state
      setTimeout(() => {
        setStoryChoices(choiceElements);
      }, storyElementDelay * textElements.length); // Update storyElements state after a delay
    } catch (e) {
      console.warn(e);
    }
  }

  useEffect(() => {
    if (storyRef.current) {
      storyRef.current.onError = (msg, type) => {
        if (type === ErrorType.Warning) console.warn(msg);
        else console.error(msg);
      }; // Handle story errors
    }
  }, []);

  useEffect(() => {
    if (storyRef.current) continueToNextChoice();
  }, [continueToNextChoice]); // Advance story on component mount

  return {
    story: storyRef.current,
    storyElements,
    storyChoices,
    continueToNextChoice,
    end,
    chooseAnswer,
    saveStoryToJSON,
    loadStoryFromJSON,
  };
};

export default useStory;

// story.ObserveVariable('variableName', (varName, newValue) => {})
// story.state.VisitCountAtPathString("...") How many times was a knot visited?
// story.currentTags // tags
// story.state.ToJson() // Save State
// story.state.LoadJson(savedJSON) // Restore State
