import './App.css';
import Game from './components/Game/Game';
import React from 'react';
import HomePage from './components/HomePage/HomePage';
import Tutorial from './components/Tutorial/Tutorial';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Routes } from 'react-router';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/game" element={<Game/>}/>
          <Route path="/tutorial" element={<Tutorial/>}/>
        </Routes>
      </div>
    </Router>
    // <div>
    //   <Game></Game>
    //   {/* <Tile tileArr={[['a', 'e']]}></Tile>
    //   <Tile tileArr={[['a']]}></Tile>
    //   <Tile tileArr={[['a', 'c','e'],[0, 0,'b']]}></Tile>
    //   <Tile tileArr={[['a', 0, 0], ['m', 'e', 0],[0, 'b', 'c']]}></Tile> */}
    // </div>
  );
}

export default App;
