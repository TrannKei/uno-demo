import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import "./App.css";
import Index from "./component";
import Board from "./component/board";


function App() {
  return (
    <>
      <Router>
        {/* <Header /> */}
        <div >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/play" element ={<Board />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
