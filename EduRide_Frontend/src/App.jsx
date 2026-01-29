// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Shared Components
import Navbar from "./components/Navbar";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import About from "./pages/About";
import HelpMe from "./pages/HelpMe";

// Signup Pages
import RoleSelectSignup from "./pages/Signup/RoleSelectSignup";
import AgencySignup from "./pages/Signup/AgencySignup";
import SchoolSignup from "./pages/Signup/SchoolSignup";
import DriverSignup from "./pages/Signup/DriverSignup";
import BusHelperSignup from "./pages/Signup/BusHelperSignup";
import StudentSignup from "./pages/Signup/StudentSignup";

// Dashboards
import StudentDashboard from "./pages/Dashboards/StudentDashboard";
import AgencyDashboard from "./pages/Dashboards/AgencyDashboard";
import SchoolDashboard from "./pages/Dashboards/SchoolDashboard";
import DriverDashboard from "./pages/Dashboards/DriverDashboard";
import BusHelperDashboard from "./pages/Dashboards/BusHelperDashboard";

// Agency Services
import AgencyServices from "./pages/Services/AgencyServices/AgencyServices";
import AddBus from "./pages/Services/AgencyServices/AddBus";
import BusDetails from "./pages/Services/AgencyServices/BusDetails";
import BusEdit from "./pages/Services/AgencyServices/BusEdit";

// School Services (all new/updated files)
import SchoolServices from "./pages/Services/SchoolServices/SchoolServices";
import StudentList from "./pages/Services/SchoolServices/StudentList";
import EditStudent from "./pages/Services/SchoolServices/EditStudent";
import BusHelperList from "./pages/Services/SchoolServices/BusHelperList";
import EditBusHelper from "./pages/Services/SchoolServices/EditBusHelper";
import TodayPresentStudents from "./pages/Services/SchoolServices/TodayPresentStudents";
import TodayAbsentStudents from "./pages/Services/SchoolServices/TodayAbsentStudents";
import SchoolBusDetails from "./pages/Services/SchoolServices/SchoolBusDetails";

//BusHelperService
import HelperMarkStatus from "./pages/Services/BusHelperServices/HelperMarkStatus";

function App() {
  return (
    <>
      <Navbar />

      <div className="p-4 min-h-[calc(100vh-64px)]">
        <Routes>
          {/* ─── Public Routes ─── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<HelpMe />} />

          {/* ─── Signup Routes ─── */}
          <Route path="/signup" element={<RoleSelectSignup />} />
          <Route path="/signup/agency" element={<AgencySignup />} />
          <Route path="/signup/school" element={<SchoolSignup />} />
          <Route path="/signup/driver" element={<DriverSignup />} />
          <Route path="/signup/bus-helper" element={<BusHelperSignup />} />
          <Route path="/signup/student" element={<StudentSignup />} />

          {/* ─── Role-based Dashboard ─── */}
          <Route path="/dashboard" element={<RoleBasedDashboard />} />

          {/* ─── Agency Protected Routes ─── */}
          <Route path="/agency/services" element={<AgencyServices />} />
          <Route path="/agency/services/add-bus" element={<AddBus />} />
          <Route path="/agency/services/buses" element={<BusDetails />} />
          <Route path="/agency/services/edit-bus/:busId" element={<BusEdit />} />

          {/* ─── School Protected Routes ─── */}
          <Route path="/school/services" element={<SchoolServices />} />
          {/* Student Management */}
          <Route path="/school/services/students" element={<StudentList />} />
          <Route path="/school/services/students/edit/:studentId" element={<EditStudent />} />
          {/* Bus Helper Management */}
          <Route path="/school/services/bus-helpers" element={<BusHelperList />} />
          <Route path="/school/services/bus-helpers/edit/:helperId" element={<EditBusHelper />} />
          {/* Attendance Today */}
          <Route path="/school/services/today-present" element={<TodayPresentStudents />} />
          <Route path="/school/services/today-absent" element={<TodayAbsentStudents />} />
          {/* Bus Management */}
          <Route path="/school/services/buses" element={<SchoolBusDetails />} />

          {/* ─── Catch-all Redirect ─── */}
          <Route path="*" element={<NavigateToDashboardOrLogin />} />

          {/* ─── Bus Helper Protected Routes ─── */}
          <Route path="/helper/mark-status" element={<HelperMarkStatus />} />

        </Routes>
      </div>
    </>
  );
}

// ─── Helper Components ───
function NavigateToDashboardOrLogin() {
  const role = localStorage.getItem("role")?.toLowerCase()?.trim();
  if (!role) return <Navigate to="/login" replace />;
  return <Navigate to="/dashboard" replace />;
}

function RoleBasedDashboard() {
  const role = localStorage.getItem("role")?.toLowerCase()?.trim();

  if (!role) return <Navigate to="/login" replace />;

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
          <h2 className="text-2xl font-bold text-red-600">Unknown role detected</h2>
          <p className="mt-4">Please log out and log in again.</p>
        </div>
      );
  }
}

export default App;