import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import AgencySignup from "./pages/Signup/AgencySignup";
import SchoolSignup from "./pages/Signup/SchoolSignup";
import About from "./pages/About";
import HelpMe from "./pages/HelpMe";

function App() {
  return (
    <>
      <Navbar /> {/* Always visible */}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/agency" element={<AgencySignup />} />
          <Route path="/signup/school" element={<SchoolSignup />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<HelpMe />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
