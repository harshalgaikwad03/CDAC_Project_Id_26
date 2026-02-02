// src/pages/Dashboards/AgencyDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBus,
  FaUserTie,
  FaSchool,
  FaUsers,
  FaCog,
  FaChartBar,
  FaArrowRight,
  FaCommentAlt,
  FaSpinner,
  FaExclamationCircle,
  FaSignOutAlt
} from "react-icons/fa";
import API from "../../services/api";

function AgencyDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get("/agencies/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSummary(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
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

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-pink-50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
          <FaSpinner className="text-white text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-1">
          Loading Dashboard
        </h3>
        <p className="text-gray-500">Fetching agency data…</p>
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
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow hover:shadow-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Buses",
      value: summary?.totalBuses ?? 0,
      icon: <FaBus />,
      color: "from-blue-500 to-cyan-500",
      border: "border-blue-200",
    },
    {
      title: "Drivers",
      value: summary?.totalDrivers ?? 0,
      icon: <FaUserTie />,
      color: "from-green-500 to-emerald-500",
      border: "border-green-200",
    },
    {
      title: "Students",
      value: summary?.totalStudents ?? 0,
      icon: <FaUsers />,
      color: "from-purple-500 to-pink-500",
      border: "border-purple-200",
    },
    {
      title: "Partner Schools",
      value: summary?.totalSchools ?? 0,
      icon: <FaSchool />,
      color: "from-orange-500 to-amber-500",
      border: "border-orange-200",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/70 via-white to-pink-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-xl bg-white/75 border border-white/60 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10">

          {/* ---------------- Header ---------------- */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <FaChartBar className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Agency Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Fleet & partner school overview
                </p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                  Live Operations Status
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl border border-purple-200">
                <FaChartBar className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  EduRide Agency Portal
                </span>
              </div>

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

          {/* ---------------- Stats ---------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden bg-white/80 backdrop-blur-md p-6 rounded-2xl border ${stat.border}
                shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r ${stat.color} opacity-20 rounded-full blur-3xl`}
                />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">{stat.title}</h3>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl`}
                  >
                    {stat.icon}
                  </div>
                </div>

                <p className="text-5xl font-bold text-gray-900 mb-3">
                  {stat.value}
                </p>

                <div className="h-2 bg-gray-200/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    style={{ width: `${Math.min(100, stat.value * 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ---------------- Actions ---------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fleet & Services
              </h3>
              <p className="text-gray-600 mb-6">
                Manage buses, drivers, helpers, and school assignments.
              </p>
              <button
                onClick={() => navigate("/agency/services")}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <FaCog />
                Manage Services
                <FaArrowRight />
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Platform Feedback
              </h3>
              <p className="text-gray-600 mb-6">
                Share suggestions and help improve EduRide.
              </p>
              <button
                onClick={() => navigate("/feedback")}
                className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <FaCommentAlt />
                Give Feedback
                <FaArrowRight />
              </button>
            </div>
          </div>

          {/* ---------------- Footer ---------------- */}
          <div className="text-center text-xs text-gray-500 mt-14 pt-6 border-t border-gray-200/60">
            <p>Agency-level control for safe & efficient school transportation</p>
            <p className="mt-1">© {new Date().getFullYear()} EduRide</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AgencyDashboard;