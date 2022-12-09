import React, { useState, useEffect } from 'react';
import { useSpring, config, animated } from 'react-spring';
import { StoryElement } from '../hooks/useStory';
import useStoryElementHeight from '../hooks/useStoryElementHeight';

interface StoryElementItemProps {
  element: StoryElement;
  delay: number;
}

function StoryElementItem({ element, delay }: StoryElementItemProps) {
  const [style, animate] = useSpring(
    { from: { transform: `scale(60%)`, opacity: 0 }, config: config.default },
    [],
  );

  useEffect(() => {
    setTimeout(() => animate({ transform: `scale(100%)`, opacity: element.seen ? 0.5 : 1 }), delay);
  }, [animate, element.seen, delay]);

  return (
    <animated.div
      style={style}
      className={`story-element text ${element.seen ? 'seen' : ''}`}
      dangerouslySetInnerHTML={{ __html: element.text }}
    />
  );
}

interface StoryElementComponentProps {
  element: StoryElement;
  delay: number;
}

function StoryElementComponent({ element, delay }: StoryElementComponentProps) {
  const [visible, setVisible] = useState<boolean>(true);
  const height = useStoryElementHeight(element);

  useEffect(() => {
    setVisible(true);
  }, []);

  return visible ? (
    <StoryElementItem element={element} delay={delay} />
  ) : (
    <div style={{ minHeight: `${height}px` }} />
  );
}

export default StoryElementComponent;
