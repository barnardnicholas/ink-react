import { useEffect, useState } from 'react';
import { StoryElement } from './useStory';

function useStoryElementHeight(element: StoryElement): number {
  const [elementHeight, setElementHeight] = useState<number>(0);
  const { text } = element;

  useEffect(() => {
    try {
      const App = document.getElementById('App');
      const div = document.createElement('div');
      const textnode = document.createTextNode(text);
      div.appendChild(textnode);
      App!.appendChild(div);
      const { height } = div.getBoundingClientRect();
      setElementHeight(height);
      App!.removeChild(div);
    } catch (e) {
      console.error(e);
    }
  }, [text]);

  return elementHeight;
}

export default useStoryElementHeight;
