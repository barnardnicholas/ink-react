import React from 'react';
import './_styles/App.scss';
import inkFile from './assets/story/Intercept.ink.json';
import useStory, { StoryElement } from './hooks/useStory';

function App() {
  const { storyElements, storyChoices, chooseAnswer } = useStory(inkFile);
  return (
    <div className="App">
      <h1>Ink Story Tests</h1>

      {storyElements.map((element: StoryElement, i: number) => {
        const uid = `${i}-${element.text}`;
        return (
          <div
            key={uid}
            className={`story-element text ${element.seen ? 'seen' : ''}`}
            dangerouslySetInnerHTML={{ __html: element.text }}
          />
        );
      })}
      {storyChoices.map((element: StoryElement, i: number) => {
        const uid = `${i}-${element.text}`;
        return (
          <div key={uid} className="story-element choice">
            <button className="button" type="button" onClick={() => chooseAnswer(element.i)}>
              {element.text}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
