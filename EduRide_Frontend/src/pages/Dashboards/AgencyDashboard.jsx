// src/pages/Dashboards/AgencyDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBus, FaUserTie, FaSchool, FaUsers, FaCog, FaChartBar, FaArrowRight, FaCommentAlt, FaSpinner, FaExclamationCircle } from "react-icons/fa";
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
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-6">
          <FaSpinner className="text-purple-600 text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Dashboard...</h3>
        <p className="text-gray-500">Fetching your agency data</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center mb-6">
          <FaExclamationCircle className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow"
        >
          Try Again
        </button>
      </div>
    );

  const stats = [
    { 
      title: "Total Buses", 
      value: summary?.totalBuses ?? 0, 
      icon: <FaBus className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50/80 to-cyan-50/40",
      borderColor: "border-blue-200"
    },
    { 
      title: "Drivers", 
      value: summary?.totalDrivers ?? 0, 
      icon: <FaUserTie className="text-2xl" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50/80 to-emerald-50/40",
      borderColor: "border-green-200"
    },
    { 
      title: "Students", 
      value: summary?.totalStudents ?? 0, 
      icon: <FaUsers className="text-2xl" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50/80 to-pink-50/40",
      borderColor: "border-purple-200"
    },
    { 
      title: "Partner Schools", 
      value: summary?.totalSchools ?? 0, 
      icon: <FaSchool className="text-2xl" />,
      color: "from-orange-500 to-amber-500",
      bgColor: "from-orange-50/80 to-amber-50/40",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-10 lg:mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
            <FaChartBar className="text-purple-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Agency Dashboard
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Monitor and manage your transportation fleet and partner schools
            </p>
          </div>
        </div>
        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:mb-16">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${stat.bgColor} p-6 rounded-2xl shadow-sm border ${stat.borderColor} hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">{stat.title}</h3>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-2">
              {stat.value}
            </p>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                style={{ width: `${Math.min(100, (stat.value / (stat.title === 'Students' ? 100 : 10)) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
              <FaCog className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Fleet & Services
              </h3>
              <p className="text-gray-600 text-sm">
                Complete management control
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Manage buses, drivers, helpers, and school assignments from one centralized platform.
          </p>
          <button
            onClick={() => navigate("/agency/services")}
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <FaCog />
            <span>Manage Services</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
              <FaCommentAlt className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Platform Feedback
              </h3>
              <p className="text-gray-600 text-sm">
                Help us improve
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Share your experience and suggestions to help improve the EduRide platform for all users.
          </p>
          <button
            onClick={() => navigate("/feedback")}
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <FaCommentAlt />
            <span>Give Feedback</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-gray-700 font-medium">
              Need help managing your agency? Check out our documentation or contact support.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              View Docs
            </button>
            <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-md transition-shadow font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
        <p className="flex items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} EduRide</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>Agency-level overview for secure and efficient school transportation management</span>
        </p>
      </div>
    </div>
  );
}

export default AgencyDashboard;