import { Story } from 'inkjs';
import { Choice as ChoiceType } from 'inkjs/engine/Choice';
import { ErrorType } from 'inkjs/engine/Error';
import { Story as StoryType } from 'inkjs/engine/Story';
import { useCallback, useEffect, useRef, useState } from 'react';
import { storyElementDelay } from '../constants/story';
// import { decodeString, encodeString } from '../utils/utils';

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

const stringSave = `{"flows":{"DEFAULT_FLOW":{"callstack":{"threads":[{"callstack":[{"exp":false,"type":0,"temp":{"$r":{"^->":"start.waited.0.g-1.15.$r1"}}}],"threadIndex":6,"previousContentObject":"start.waited.0.g-1.21"}],"threadCounter":10},"outputStream":["^He has brought two cups of tea in metal mugs: he sets them down on the tabletop between us.","\n"],"choiceThreads":{"8":{"callstack":[{"cPath":"start.waited.0.g-1","idx":8,"exp":false,"type":0,"temp":{"$r":{"^->":"start.waited.0.g-0.c-1.$r2"}}}],"threadIndex":8,"previousContentObject":"start.waited.0.g-1.7"},"9":{"callstack":[{"cPath":"start.waited.0.g-1","idx":14,"exp":false,"type":0,"temp":{"$r":{"^->":"start.waited.0.g-0.c-1.$r2"}}}],"threadIndex":9,"previousContentObject":"start.waited.0.g-1.13"},"10":{"callstack":[{"cPath":"start.waited.0.g-1","idx":21,"exp":false,"type":0,"temp":{"$r":{"^->":"start.waited.0.g-1.15.$r1"}}}],"threadIndex":10,"previousContentObject":"start.waited.0.g-1.20"}},"currentChoices":[{"text":"Deny","index":0,"originalChoicePath":"start.waited.0.g-1.8","originalThreadIndex":8,"targetPath":"start.waited.0.g-1.c-3"},{"text":"Take one","index":1,"originalChoicePath":"start.waited.0.g-1.14","originalThreadIndex":9,"targetPath":"start.waited.0.g-1.c-4"},{"text":"Wait","index":2,"originalChoicePath":"start.waited.0.g-1.21","originalThreadIndex":10,"targetPath":"start.waited.0.g-1.c-6"}]}},"currentFlowName":"DEFAULT_FLOW","variablesState":{},"evalStack":[],"visitCounts":{"":1,"start":1,"start.0.g-0":1,"start.0.g-0.c-0":1,"start.0.opts":1,"start.0.opts.0":1,"start.0.opts.c-3":1,"start.0.g-1":1,"start.waited":1,"start.waited.0.g-0":1,"start.waited.0.g-0.c-1":1,"start.waited.0.g-1":1},"turnIndices":{},"turnIdx":2,"storySeed":63,"previousRandom":0,"inkSaveVersion":9,"inkFormatVersion":20}`;
// const saved = {
//   flows: {
//     DEFAULT_FLOW: {
//       callstack: {
//         threads: [
//           {
//             callstack: [{ exp: false, type: 0, temp: { $r: { '^->': 'start.0.g-0.2.$r1' } } }],
//             threadIndex: 0,
//             previousContentObject: 'start.0.g-0.2.8',
//           },
//         ],
//         threadCounter: 1,
//       },
//       outputStream: ['^They are keeping me waiting.', '\n'],
//       choiceThreads: {
//         '1': {
//           callstack: [
//             {
//               cPath: 'start.0.g-0.2',
//               idx: 8,
//               exp: false,
//               type: 0,
//               temp: { $r: { '^->': 'start.0.g-0.2.$r1' } },
//             },
//           ],
//           threadIndex: 1,
//           previousContentObject: 'start.0.g-0.2.7',
//         },
//       },
//       currentChoices: [
//         {
//           text: 'Hut 14',
//           index: 0,
//           originalChoicePath: 'start.0.g-0.2.8',
//           originalThreadIndex: 1,
//           targetPath: 'start.0.g-0.c-0',
//         },
//       ],
//     },
//   },
//   currentFlowName: 'DEFAULT_FLOW',
//   variablesState: {},
//   evalStack: [],
//   visitCounts: { '': 1, start: 1, 'start.0.g-0': 1 },
//   turnIndices: {},
//   turnIdx: -1,
//   storySeed: 54,
//   previousRandom: 0,
//   inkSaveVersion: 9,
//   inkFormatVersion: 20,
// };

const useStory = (inkFile: Record<string, any>): UseStory => {
  const storyRef = useRef<StoryType>(new Story(inkFile));
  // const [ticker, setTicker] = useState<boolean>(false);
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
      const save = storyRef.current.state.toJson();
      console.log(save);
      // const stringifiedSave = JSON.stringify(save);
      // const encodedSave = encodeString(stringifiedSave);
    } catch (e) {
      console.warn(e);
    }
  }

  function loadStoryFromJSON() {
    try {
      // const decoded = decodeString(saved);
      // const decodedSave = JSON.parse(decoded);
      // const parsedSave = JSON.parse(decodedSave);
      console.log(storyRef.current.state.toJson());
      storyRef.current.state.LoadJson(stringSave);
      console.log(storyRef.current.state.toJson());
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
