// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import {
  FaSchool,
  FaBus,
  FaShieldAlt,
  FaUserCheck,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaTachometerAlt,
  FaClipboardCheck
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role")?.toLowerCase()?.trim();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const getRoleColor = () => {
    switch (role) {
      case "school": return "bg-gradient-to-r from-green-500 to-emerald-600";
      case "agency": return "bg-gradient-to-r from-purple-500 to-indigo-600";
      case "admin": return "bg-gradient-to-r from-red-500 to-orange-500";
      case "helper": return "bg-gradient-to-r from-amber-500 to-yellow-500";
      default: return "bg-gradient-to-r from-blue-500 to-blue-600";
    }
  };

  /* ================= LOGGED IN USERS ================= */
  if (role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-xl opacity-30"></div>
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl">
                <FaSchool className="text-white text-5xl transform transition-transform hover:scale-110" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">EduRide</span>
            </h1>

            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-gray-200 mb-10 animate-pulse-subtle">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <FaUserCheck className="text-blue-500 text-lg" />
              <span className="text-gray-700 font-medium">Logged in as</span>
              <span className={`font-bold uppercase px-5 py-1.5 rounded-full ${getRoleColor()} text-white shadow-md`}>
                {role}
              </span>
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Manage daily school transportation operations from your personalized dashboard with real-time monitoring and analytics.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:border-blue-200">
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <FaTachometerAlt className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Dashboard Control
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                View students, buses, helpers, and daily transportation status in one unified dashboard with real-time updates.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:border-green-200">
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <FaBus className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Transport Management
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Assign buses and helpers to schools and manage transportation records efficiently with automated scheduling.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:border-purple-200">
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <FaClipboardCheck className="text-purple-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Attendance & Safety
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Helpers can securely mark student pickup and drop-off status daily with geolocation verification.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="group relative flex items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-5 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-w-[220px] justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaTachometerAlt className="relative text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="relative">Go to Dashboard</span>
            </button>

            <button
              onClick={logout}
              className="group relative flex items-center gap-4 bg-white text-gray-800 px-12 py-5 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-w-[220px] justify-center border border-gray-300 hover:border-red-300"
            >
              <FaSignOutAlt className="text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
              <span className="group-hover:text-red-600 transition-colors duration-300">Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= PUBLIC USERS ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="relative inline-flex mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl">
              <FaSchool className="text-white text-6xl transform transition-transform hover:scale-110" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
              EduRide
            </span>
          </h1>

          <p className="text-3xl text-gray-800 mb-8 font-semibold">
            Smart School Transportation Management System
          </p>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A secure, scalable platform to manage students, buses, helpers, and daily transport attendance for schools and agencies with real-time tracking.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 hover:border-blue-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <FaBus className="relative text-blue-600 text-5xl mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Centralized Transport</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Manage multiple schools, buses, and helpers from one unified system with automated routing and scheduling.
            </p>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 hover:border-green-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <FaClipboardCheck className="relative text-green-600 text-5xl mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Daily Attendance</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Track student pickup and drop-off securely using helper dashboards with QR code verification.
            </p>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 hover:border-amber-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <FaShieldAlt className="relative text-amber-600 text-5xl mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Secure & Reliable</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Role-based access ensures safety, accountability, and data protection with end-to-end encryption.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
            <button
              onClick={() => navigate("/login")}
              className="group relative flex items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-14 py-6 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 min-w-[240px] justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaSignInAlt className="relative text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="relative">Login</span>
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="group relative flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-14 py-6 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 min-w-[240px] justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaUserPlus className="relative text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="relative">Create Account</span>
            </button>
          </div>

          <p className="text-gray-500 text-sm font-medium tracking-wide">
            Built for academic projects and real-world school transport management • Secure • Scalable • User-Friendly
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;