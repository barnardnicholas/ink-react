import { InkObject } from 'inkjs/engine/Object';
import { Story } from 'inkjs/engine/Story';
import React from 'react';
import Divider from './Divider';

interface DebugProps {
  story: Story;
}

const variablesToGet = [
  'forceful',
  'evasive',
  'teacup',
  'gotcomponent',
  'drugged',
  'hooper_mentioned',
  'losttemper',
  'admitblackmail',
  'hooperClueType',
  'smashingWindowItem',
  'notraitor',
  'revealedhooperasculprit',
  'smashedglass',
  'muddyshoes',
  'framedhooper',
  'putcomponentintent',
  'throwncomponentaway',
  'piecereturned',
  'longgrasshooperframe',
];
interface Variable extends InkObject {
  valueObject: unknown;
}

function Debug({ story }: DebugProps) {
  return (
    <div>
      <h2>Debug</h2>
      <Divider />
      <h3>Current Tags</h3>
      {story!.currentTags!.map((tag: string) => (
        <div key={tag}>{tag}</div>
      ))}
      <Divider />
      <h3>Story State</h3>
      {variablesToGet.map((variable: string) => {
        const value: unknown = (story.variablesState.GetVariableWithName(variable) as Variable)
          .valueObject;
        return <div key={variable}>{`${variable}: ${value !== undefined ? value : ''}`}</div>;
      })}
    </div>
  );
}

export default Debug;
