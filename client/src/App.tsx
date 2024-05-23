import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./Pages/Homepage";

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ paddingBottom: "90px" }}>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
};

export default App;
