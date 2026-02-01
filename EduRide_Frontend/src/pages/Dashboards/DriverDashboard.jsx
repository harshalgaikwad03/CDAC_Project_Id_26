import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaBus,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaRoute,
  FaComments,
  FaInfoCircle,
  FaSpinner,
  FaExclamationCircle,
  FaArrowRight,
  FaRoad,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaSignOutAlt
} from "react-icons/fa";

const ROUTES = {
  HOME_TO_SCHOOL: "HOME_TO_SCHOOL",
  SCHOOL_TO_HOME: "SCHOOL_TO_HOME",
};

function DriverDashboard() {
  const [summary, setSummary] = useState(null);
  const [route, setRoute] = useState(ROUTES.HOME_TO_SCHOOL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/drivers/dashboard/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Driver dashboard error:", err);
      const status = err.response?.status;
      if (status === 403 || status === 409) setSummary(null);
      else setError("Failed to load driver dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-cyan-50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
          <FaSpinner className="text-white text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-1">
          Loading Dashboard
        </h3>
        <p className="text-gray-500">Fetching your driving details</p>
      </div>
    );
  }

  /* ---------------- Error ---------------- */
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-100 via-white to-pink-50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
          <FaExclamationCircle className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Something went wrong
        </h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow hover:shadow-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ---------------- No Data ---------------- */
  if (!summary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-white to-gray-50">
        <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center mb-6">
          <FaBus className="text-gray-400 text-3xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-3">
          No Bus Assigned
        </h3>
        <p className="text-gray-600 max-w-md text-center mb-6">
          Your bus may not be assigned yet. Please contact your transportation agency for assistance.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={handleLogout}
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
          >
            <FaSignOutAlt />
            <span>Logout</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow hover:shadow-lg transition">
            Contact Agency
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- Derived ---------------- */
  const totalStudents = summary.totalStudents ?? 0;
  const pickedCount =
    route === ROUTES.HOME_TO_SCHOOL
      ? summary.pickedHomeToSchool ?? 0
      : summary.droppedSchoolToHome ?? 0;
  const remainingCount = Math.max(totalStudents - pickedCount, 0);
  const progressPercentage =
    totalStudents > 0 ? (pickedCount / totalStudents) * 100 : 0;

  const routeInfo = {
    [ROUTES.HOME_TO_SCHOOL]: {
      title: "Home → School",
      subtitle: "Morning Pickup Route",
      color: "from-blue-500 to-cyan-500",
      activeColor: "bg-gradient-to-r from-blue-600 to-cyan-600"
    },
    [ROUTES.SCHOOL_TO_HOME]: {
      title: "School → Home",
      subtitle: "Afternoon Drop-off Route",
      color: "from-amber-500 to-orange-500",
      activeColor: "bg-gradient-to-r from-amber-600 to-orange-600"
    }
  };

  const currentRoute = routeInfo[route];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/70 via-white to-cyan-50/60 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-xl bg-white/75 border border-white/60 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <FaBus className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Driver Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Track student pickup and drop status for your assigned bus
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <FaRoad className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Driver Portal
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/40 border border-blue-200 rounded-2xl p-5 mb-10 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <FaInfoCircle className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">
                Route Information
              </h4>
              <p className="text-sm text-blue-700">
                Select the route type below to view student pickup (morning) or drop-off (afternoon) status for today.
              </p>
            </div>
          </div>

          {/* Bus Info */}
          <div className="bg-gradient-to-br from-white to-blue-50/50 border border-blue-200 rounded-2xl p-8 mb-12 shadow-md text-center">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 mb-4">
              <FaBus className="text-blue-600" />
              Assigned Bus
            </span>
            <h2 className="text-5xl font-bold text-blue-600 mb-2">
              {summary.busNumber}
            </h2>
            <p className="text-gray-600">
              This bus is assigned to you for today's transportation duties
            </p>
          </div>

          {/* Route Toggle */}
          <div className="mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaRoute className="text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700">Select Route Type</h3>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              {Object.values(ROUTES).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoute(r)}
                  className={`flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-medium transition-all duration-300 shadow-sm ${
                    route === r
                      ? routeInfo[r].activeColor + " text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:shadow"
                  }`}
                >
                  <FaRoute />
                  <span>{routeInfo[r].title}</span>
                  {route === r && <FaCheckCircle className="text-white" />}
                </button>
              ))}
            </div>
            <div className="text-center mt-3">
              <p className="text-sm text-gray-600">
                Currently viewing: <span className="font-semibold text-blue-600">{currentRoute.title}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{currentRoute.subtitle}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            <StatCard
              title="Total Students"
              value={totalStudents}
              icon={<FaUsers className="text-2xl" />}
              color="from-blue-500 to-cyan-500"
              bgColor="from-white to-blue-50/30"
              borderColor="border-blue-200"
              desc="Total students assigned to this bus"
            />
            <StatCard
              title={route === ROUTES.HOME_TO_SCHOOL ? "Picked Up" : "Dropped"}
              value={pickedCount}
              icon={<FaUserCheck className="text-2xl" />}
              color="from-green-500 to-emerald-500"
              bgColor="from-white to-green-50/30"
              borderColor="border-green-200"
              desc="Students successfully marked for this route"
              progress={`${Math.round(progressPercentage)}% complete`}
            />
            <StatCard
              title="Remaining"
              value={remainingCount}
              icon={<FaUserTimes className="text-2xl" />}
              color="from-red-500 to-rose-500"
              bgColor="from-white to-red-50/30"
              borderColor="border-red-200"
              desc="Students yet to be marked"
            />
          </div>

          {/* Progress Bar */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-sm border border-gray-200 mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-700">Route Completion Progress</span>
              <span className="font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${currentRoute.color} transition-all duration-500`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>0 students</span>
              <span>{totalStudents} students</span>
            </div>
          </div>

          {/* Feedback */}
          <div className="text-center">
            <button
              onClick={() => navigate("/feedback")}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
            >
              <FaComments />
              <span>Give Feedback</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Help us improve the driver experience
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-14 pt-6 border-t border-gray-200/60">
            <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span>Dashboard designed to help drivers ensure accurate and safe student transportation</span>
              <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>© {new Date().getFullYear()} EduRide</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------------- Card ---------------- */
function StatCard({ title, value, color, icon, desc, progress, bgColor, borderColor }) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} p-6 rounded-2xl shadow-sm border ${borderColor} hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
      <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-sm text-gray-600">{desc}</p>
      {progress && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs font-medium text-green-600">{progress}</span>
        </div>
      )}
    </div>
  );
}

export default DriverDashboard;