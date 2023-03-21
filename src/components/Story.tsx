import React, { useEffect, useRef } from 'react';
import useStory, { StoryElement } from '../hooks/useStory';
import inkFile from '../assets/story/Intercept.ink.json';
import StoryElementComponent from './StoryElement';
import StoryChoiceComponent from './StoryChoice';
import Debug from './Debug';
import Divider from './Divider';
import usePrevious from '../hooks/usePrevious';
import { storyElementDelay, answerDelay, intermediateDelay } from '../constants/story';

function Story() {
  const { story, storyElements, storyChoices, chooseAnswer, saveStoryToJSON, loadStoryFromJSON } =
    useStory(inkFile);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevProps = usePrevious({ storyElements, storyChoices });

  useEffect(() => {
    if (
      scrollRef.current &&
      (storyElements.length !== prevProps.storyElements.length ||
        storyChoices.length !== prevProps.storyChoices.length)
    )
      setTimeout(
        () => scrollRef.current!.scrollIntoView({ behavior: 'smooth', block: 'end' }),
        storyElementDelay * (storyElements.length - prevProps.storyElements.length) +
          intermediateDelay,
      );
  }, [scrollRef, storyElements, prevProps.storyElements, storyChoices, prevProps.storyChoices]); // Scroll to last element when length of elements changes

  return (
    <>
      <main className="main-columns">
        <div className="story">
          <h2>Story</h2>
          <button className="button" type="button" onClick={saveStoryToJSON}>
            Save (WIP)
          </button>
          <button className="button" type="button" onClick={loadStoryFromJSON}>
            Load (WIP)
          </button>
          <Divider />
          {storyElements.map((element: StoryElement, i: number) => {
            const uid = `${i}-${element.text}`;
            return (
              <StoryElementComponent
                key={uid}
                element={element}
                delay={(i - prevProps.storyElements.length) * storyElementDelay}
              />
            );
          })}
          {storyChoices.map((element: StoryElement, i: number) => {
            const uid = `${i}-${element.text}-${new Date().valueOf()}`;
            if (i === storyChoices.length - 1) {
              setTimeout(
                () => scrollRef.current!.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                answerDelay + 100,
              );
            } // Scroll to last element when length of choices changes
            return (
              <StoryChoiceComponent
                key={uid}
                uid={uid}
                element={element}
                chooseAnswer={chooseAnswer}
                delay={answerDelay * 2 + i * answerDelay}
              />
            );
          })}
          <div ref={scrollRef} className="scroll-marker" />
        </div>
      </main>
      <Debug story={story} />
    </>
  );
}

export default Story;
