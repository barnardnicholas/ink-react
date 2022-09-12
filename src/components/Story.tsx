import React, { useEffect, useRef } from 'react';
import useStory, { StoryElement } from '../hooks/useStory';
import inkFile from '../assets/story/Intercept.ink.json';
import StoryElementComponent from './StoryElement';
import Debug from './Debug';
import Divider from './Divider';
import usePrevious from '../hooks/usePrevious';

function Story() {
  const { story, storyElements, storyChoices, chooseAnswer } = useStory(inkFile);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevProps = usePrevious({ storyElements });

  useEffect(() => {
    if (scrollRef.current && storyElements.length !== prevProps.storyElements.length)
      scrollRef.current!.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [scrollRef, storyElements, prevProps.storyElements]);
  return (
    <>
      <main className="main-columns">
        <div className="story">
          <h2>Story</h2>
          <Divider />
          {storyElements.map((element: StoryElement, i: number) => {
            const uid = `${i}-${element.text}`;
            return <StoryElementComponent key={uid} element={element} />;
          })}
          {storyChoices.map((element: StoryElement, i: number) => {
            const uid = `${i}-${element.text}`;
            return (
              <div key={uid} className="story-element choice">
                <button
                  className="choice-button"
                  type="button"
                  onClick={() => chooseAnswer(element.i)}
                >
                  {element.text}
                </button>
              </div>
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
