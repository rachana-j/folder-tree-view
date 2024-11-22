import React from 'react';
import ReactDOM from 'react-dom';
import MenuBuilder from './MenuBuilder';  

const App = () => {
  return (
    <div>
      <MenuBuilder />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

export default App;