import React from 'react';
import './App.css';
import inkFile from './assets/story/Intercept.ink.json';
import useStory, { StoryElement, StoryElementType } from './hooks/useStory';

function App() {
  const { storyElements, chooseAnswer } = useStory(inkFile);
  return (
    <div className="App">
      <h1>Ink Story Tests</h1>

      {storyElements.map((element: StoryElement, i: number) => {
        const uid = `${i}-${element.text}`;
        if (element.type === StoryElementType.TEXT)
          return (
            <div key={uid} className="story-element text">
              {element.text}
            </div>
          );
        if (element.type === StoryElementType.CHOICE)
          return (
            <div key={uid} className="story-element choice">
              <button type="button" onClick={() => chooseAnswer(element.i)}>
                {element.text}
              </button>
            </div>
          );
        return null;
      })}
    </div>
  );
}

export default App;
