import React, { useState, useEffect } from 'react';
import { useSpring, config, animated } from 'react-spring';
import { StoryElement } from '../hooks/useStory';
import useStoryElementHeight from '../hooks/useStoryElementHeight';

interface StoryChoiceItemProps {
  element: StoryElement;
  delay: number;
  chooseAnswer: (chosenAnswer: number) => void;
  uid: string;
}

function StoryChoiceItem({ element, delay, chooseAnswer, uid }: StoryChoiceItemProps) {
  const [style, animate] = useSpring(
    { from: { transform: `scale(60%)`, opacity: 0 }, config: config.default },
    [],
  );

  useEffect(() => {
    setTimeout(() => animate({ transform: `scale(100%)`, opacity: 1 }), delay);
  }, [animate, delay, uid]);

  return (
    <animated.div style={style} className="story-element choice">
      <button className="choice-button" type="button" onClick={() => chooseAnswer(element.i)}>
        {element.text}
      </button>
    </animated.div>
  );
}

interface StoryChoiceComponentProps {
  element: StoryElement;
  delay: number;
  chooseAnswer: (chosenAnswer: number) => void;
  uid: string;
}

function StoryChoiceComponent({ element, delay, chooseAnswer, uid }: StoryChoiceComponentProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const height = useStoryElementHeight(element);

  useEffect(() => {
    setVisible(true);
  }, []);

  return visible ? (
    <StoryChoiceItem element={element} delay={delay} chooseAnswer={chooseAnswer} uid={uid} />
  ) : (
    <div style={{ minHeight: `${height}px` }} />
  );
}

export default StoryChoiceComponent;
