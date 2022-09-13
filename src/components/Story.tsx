import React, { useEffect, useRef } from 'react';
import useStory, { StoryElement } from '../hooks/useStory';
import inkFile from '../assets/story/Intercept.ink.json';
import StoryElementComponent from './StoryElement';
import StoryChoiceComponent from './StoryChoice';
import Debug from './Debug';
import Divider from './Divider';
import usePrevious from '../hooks/usePrevious';
import { answerDelay } from '../constants/story';

function Story() {
  const { story, storyElements, storyChoices, chooseAnswer } = useStory(inkFile);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevProps = usePrevious({ storyElements });

  useEffect(() => {
    if (scrollRef.current && storyElements.length !== prevProps.storyElements.length)
      scrollRef.current!.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
            const uid = `${i}-${element.text}-${new Date().valueOf()}`;
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
