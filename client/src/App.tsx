import React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./Pages/Homepage";

const App = () => {
  return (
    <main>
      <Navbar />
      <Homepage />
    </main>
  );
};

export default App;
