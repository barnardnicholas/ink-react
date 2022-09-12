import React from 'react';
import Divider from './components/Divider';
import Story from './components/Story';
import './_styles/App.scss';

function App() {
  return (
    <div id="App" className="App">
      <h1>Ink Story Tests</h1>
      <Divider />
      <Story />
    </div>
  );
}

export default App;
