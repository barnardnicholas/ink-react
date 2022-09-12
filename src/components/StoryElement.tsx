import React, { useState, useEffect } from 'react';
import { useSpring, config, animated } from 'react-spring';
import { StoryElement } from '../hooks/useStory';
import useStoryElementHeight from '../hooks/useStoryElementHeight';

interface StoryElementItemProps {
  element: StoryElement;
}

function StoryElementItem({ element }: StoryElementItemProps) {
  const [style, animate] = useSpring(
    { from: { transform: `scale(60%)`, opacity: 0 }, config: config.stiff },
    [],
  );

  useEffect(() => {
    animate({ transform: `scale(100%)`, opacity: element.seen ? 0.5 : 1 });
  }, [animate, element.seen]);

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
}

function StoryElementComponent({ element }: StoryElementComponentProps) {
  const [visible, setVisible] = useState<boolean>(true);
  const height = useStoryElementHeight(element);

  useEffect(() => {
    setVisible(true);
  }, []);

  return visible ? (
    <StoryElementItem element={element} />
  ) : (
    <div style={{ minHeight: `${height}px` }} />
  );
}

export default StoryElementComponent;
