// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import AgencySignup from "./pages/Signup/AgencySignup";
import SchoolSignup from "./pages/Signup/SchoolSignup";
import DriverSignup from "./pages/Signup/DriverSignup";
import BusHelperSignup from "./pages/Signup/BusHelperSignup";
import StudentSignup from "./pages/Signup/StudentSignup";
import About from "./pages/About";
import HelpMe from "./pages/HelpMe";           // assuming this exists
import RoleSelectSignup from "./pages/Signup/RoleSelectSignup";

// Dashboard components (you need to create these files)
import StudentDashboard from "./pages/Dashboards/StudentDashboard";
import AgencyDashboard   from "./pages/Dashboards/AgencyDashboard";
import SchoolDashboard   from "./pages/Dashboards/SchoolDashboard";
import DriverDashboard   from "./pages/Dashboards/DriverDashboard";
import BusHelperDashboard from "./pages/Dashboards/BusHelperDashboard";

// Existing service pages
import AgencyServices from "./pages/Services/AgencyServices/Services";
import AgencyBusDetails from "./pages/Services/AgencyServices/BusDetails";
import SchoolServices from "./pages/Services/SchoolServices/Services";
import SchoolBusDetails from "./pages/Services/SchoolServices/BusDetails";

function App() {
  return (
    <>
      <Navbar />

      <div className="p-4 min-h-[calc(100vh-64px)]">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<HelpMe />} />

          {/* Signup */}
          <Route path="/signup" element={<RoleSelectSignup />} />
          <Route path="/signup/agency" element={<AgencySignup />} />
          <Route path="/signup/school" element={<SchoolSignup />} />
          <Route path="/signup/driver" element={<DriverSignup />} />
          <Route path="/signup/bus-helper" element={<BusHelperSignup />} />
          <Route path="/signup/student" element={<StudentSignup />} />

          {/* Protected dashboard – role decides content */}
          <Route path="/dashboard" element={<RoleBasedDashboard />} />

          {/* Agency routes */}
          <Route path="/agency/services" element={<AgencyServices />} />
          <Route path="/agency/services/buses" element={<AgencyBusDetails />} />

          {/* School routes */}
          <Route path="/school/services" element={<SchoolServices />} />
          <Route path="/school/services/buses" element={<SchoolBusDetails />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<NavigateToDashboardOrLogin />} />
        </Routes>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────
// Helper Components
// ────────────────────────────────────────────────

function NavigateToDashboardOrLogin() {
  const role = localStorage.getItem("role")?.toLowerCase()?.trim();
  if (!role) return <Navigate to="/login" replace />;
  return <Navigate to="/dashboard" replace />;
}

function RoleBasedDashboard() {
  const role = localStorage.getItem("role")?.toLowerCase()?.trim();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  switch (role) {
    case "student":
      return <StudentDashboard />;
    case "agency":
      return <AgencyDashboard />;
    case "school":
      return <SchoolDashboard />;
    case "driver":
      return <DriverDashboard />;
    case "bus_helper":
    case "helper":
      return <BusHelperDashboard />;
    default:
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-600">Unknown role</h2>
          <p className="mt-4">Please log out and try again.</p>
        </div>
      );
  }
}

export default App;