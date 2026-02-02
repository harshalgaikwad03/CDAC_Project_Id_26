import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaBus,
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaClipboardCheck,
  FaComments,
  FaExclamationCircle,
  FaRoute,
  FaCheckCircle,
  FaSpinner,
  FaArrowRight,
  FaShieldAlt,
  FaTasks,
  FaSignOutAlt
} from "react-icons/fa";

const ROUTES = {
  HOME_TO_SCHOOL: "HOME_TO_SCHOOL",
  SCHOOL_TO_HOME: "SCHOOL_TO_HOME",
};

function BusHelperDashboard() {
  const [summary, setSummary] = useState(null);
  const [route, setRoute] = useState(ROUTES.HOME_TO_SCHOOL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get("/helpers/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSummary(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load bus helper dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-cyan-50/50 to-blue-50/50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center mb-6">
          <FaSpinner className="text-cyan-600 text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Dashboard...</h3>
        <p className="text-gray-500">Fetching your helper details</p>
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-cyan-50/50 to-blue-50/50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center mb-6">
          <FaExclamationCircle className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow"
        >
          Try Again
        </button>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-b from-cyan-50/50 to-blue-50/50 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          
          <div className="p-6 sm:p-8 lg:p-10">
            {/* ===== HEADER + PRIMARY ACTION ===== */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center">
                  <FaShieldAlt className="text-cyan-600 text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Bus Helper Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Track and update student pickup & drop-off status
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-4">
                  {/* Logout Button - Same style as StudentDashboard */}
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
            </div>

            {/* ===== BUS INFO ===== */}
            <div className="bg-gradient-to-br from-white to-cyan-50/50 p-8 rounded-2xl shadow-sm border border-cyan-200 mb-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center">
                    <FaBus className="text-cyan-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Assigned Bus
                    </h3>
                    <p className="text-3xl font-bold text-cyan-600">
                      {summary.busNumber || "Not Assigned"}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-lg border border-blue-200">
                 <button
                    onClick={() => navigate("/helper/mark-status")}
                    className="group flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FaClipboardCheck />
                    <span>Mark Student Status</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-2 text-sm font-medium text-cyan-700">
                  <FaExclamationCircle />
                  <span>Mandatory before trip completion</span>
                </div>
                </div>
              </div>
            </div>

            {/* ===== ROUTE TOGGLE ===== */}
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
                        : "bg-white text-gray-700 border border-gray-300 hover:border-cyan-300 hover:shadow"
                    }`}
                  >
                    <FaRoute />
                    <span>
                      {r === ROUTES.HOME_TO_SCHOOL
                        ? "Home → School"
                        : "School → Home"}
                    </span>
                    {route === r && <FaCheckCircle className="text-white" />}
                  </button>
                ))}
              </div>
              <div className="text-center mt-3">
                <p className="text-sm text-gray-600">
                  Currently viewing: <span className="font-semibold text-cyan-600">{currentRoute.title}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{currentRoute.subtitle}</p>
              </div>
            </div>

            {/* ===== INFO NOTE ===== */}
            <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/40 rounded-2xl p-5 mb-8 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FaTasks className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Your Responsibility</h4>
                  <p className="text-sm text-blue-700">
                    You are responsible for accurately marking each student's pickup and
                    drop-off. This data is used by schools and agencies for safety tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* ===== STATS GRID ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {/* TOTAL STUDENTS */}
              <StatCard
                title="Total Students"
                value={summary.totalStudentsAssigned}
                icon={<FaUsers className="text-2xl" />}
                color="from-blue-500 to-cyan-500"
                desc="Assigned to this bus"
                borderColor="border-blue-200"
                bgColor="from-white to-blue-50/30"
              />

              {/* CONDITIONAL CARDS */}
              {route === ROUTES.HOME_TO_SCHOOL ? (
                <>
                  <StatCard
                    title="Pending"
                    value={summary.pendingCount}
                    icon={<FaUserClock className="text-2xl" />}
                    color="from-amber-500 to-orange-500"
                    desc="Yet to be marked"
                    borderColor="border-amber-200"
                    bgColor="from-white to-amber-50/30"
                  />
                  <StatCard
                    title="Picked"
                    value={summary.pickedCount}
                    icon={<FaUserCheck className="text-2xl" />}
                    color="from-green-500 to-emerald-500"
                    desc="Picked up successfully"
                    borderColor="border-green-200"
                    bgColor="from-white to-green-50/30"
                  />
                </>
              ) : (
                <>
                  <StatCard
                    title="Picked"
                    value={summary.pickedCount}
                    icon={<FaUserCheck className="text-2xl" />}
                    color="from-green-500 to-emerald-500"
                    desc="Picked up successfully"
                    borderColor="border-green-200"
                    bgColor="from-white to-green-50/30"
                  />
                  <StatCard
                    title="Dropped"
                    value={summary.droppedCount}
                    icon={<FaUserTimes className="text-2xl" />}
                    color="from-red-500 to-rose-500"
                    desc="Dropped safely"
                    borderColor="border-red-200"
                    bgColor="from-white to-red-50/30"
                  />
                </>
              )}
            </div>

            {/* ===== PROGRESS SECTION ===== */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-2xl shadow-sm border border-gray-200 mb-10">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Route Completion Progress</span>
                <span className="font-bold text-cyan-600">
                  {summary.totalStudentsAssigned > 0 
                    ? Math.round(((route === ROUTES.HOME_TO_SCHOOL ? summary.pickedCount : summary.droppedCount) / summary.totalStudentsAssigned) * 100)
                    : 0}%
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${currentRoute.color} transition-all duration-500`}
                  style={{ 
                    width: `${summary.totalStudentsAssigned > 0 
                      ? ((route === ROUTES.HOME_TO_SCHOOL ? summary.pickedCount : summary.droppedCount) / summary.totalStudentsAssigned) * 100 
                      : 0}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0 students</span>
                <span>{summary.totalStudentsAssigned} students</span>
              </div>
            </div>

            {/* ===== FEEDBACK ===== */}
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
                Help us improve the bus helper experience
              </p>
            </div>

            {/* FOOTER */}
            <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-200">
              <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <span>Bus helpers are a key part of student safety and attendance accuracy</span>
                <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>© {new Date().getFullYear()} EduRide</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- STAT CARD COMPONENT ---------- */
function StatCard({ title, value, icon, color, desc, borderColor, bgColor }) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} p-6 rounded-2xl shadow-sm border ${borderColor} hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
      <p className="text-4xl font-bold text-gray-900 mb-2">
        {value}
      </p>
      <p className="text-sm text-gray-600">
        {desc}
      </p>
    </div>
  );
}

export default BusHelperDashboard;