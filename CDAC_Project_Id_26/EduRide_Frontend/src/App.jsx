import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import AgencySignup from "./pages/Signup/AgencySignup";
import SchoolSignup from "./pages/Signup/SchoolSignup";
import DriverSignup from "./pages/Signup/DriverSignup";
import BusHelperSignup from "./pages/Signup/BusHelperSignup";
import StudentSignup from "./pages/Signup/StudentSignup";
import About from "./pages/About";
import HelpMe from "./pages/HelpMe";
import RoleSelectSignup from "./pages/Signup/RoleSelectSignup";

import Services from "./pages/Services/AgencyServices/Services";
import BusDetails from "./pages/Services/AgencyServices/BusDetails";

import SchoolServices from "./pages/Services/SchoolServices/Services";
import SchoolBusDetails from "./pages/Services/SchoolServices/BusDetails";
function App() {
  return (
    <>
      {/* Navbar visible on all pages */}
      <Navbar />

      <div className="p-4">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<HelpMe />} />

          {/* Signup role selection */}
          <Route path="/signup" element={<RoleSelectSignup />} />

          {/* Signup Pages */}
          <Route path="/signup/agency" element={<AgencySignup />} />
          <Route path="/signup/school" element={<SchoolSignup />} />
          <Route path="/signup/driver" element={<DriverSignup />} />
          <Route path="/signup/bus-helper" element={<BusHelperSignup />} />
          <Route path="/signup/student" element={<StudentSignup />} />

          {/*Agency Services */}
          <Route path="/agency/services" element={<Services />} />
          <Route path="/agency/services/buses" element={<BusDetails />} />

          {/*School Services*/}
          <Route path="/school/services" element={<SchoolServices />} />
          <Route path="/school/services/buses" element={<SchoolBusDetails />} />

        </Routes>
      </div>
    </>
  );
}

export default App;
