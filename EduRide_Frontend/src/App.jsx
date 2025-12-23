import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import AgencySignup from "./pages/Signup/AgencySignup";
import SchoolSignup from "./pages/Signup/SchoolSignup";
import About from "./pages/About";
import HelpMe from "./pages/HelpMe";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/agency" element={<AgencySignup />} />
      <Route path="/signup/school" element={<SchoolSignup />} />
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<HelpMe />} />
    </Routes>
  );
}

export default App;
