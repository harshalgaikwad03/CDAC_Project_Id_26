import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "./Profiles/ProfileDropdown";
import logo from "../assets/images/logo/eduride-logo.jpeg";
import { 
  FaHome, 
  FaInfoCircle, 
  FaQuestionCircle, 
  FaUserCircle, 
  FaBus, 
  FaSignInAlt, 
  FaUserPlus,
  FaCaretDown,
  FaTachometerAlt,
  FaAddressCard  
} from "react-icons/fa";

function Navbar() {
  const role = localStorage.getItem("role")?.toLowerCase()?.trim();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine role-specific color
  const getRoleColor = () => {
    if (!role) return "bg-gradient-to-r from-blue-600 to-blue-800";
    switch(role) {
      case "school": return "bg-gradient-to-r from-green-600 to-blue-700";
      case "agency": return "bg-gradient-to-r from-purple-600 to-indigo-700";
      case "admin": return "bg-gradient-to-r from-red-600 to-orange-600";
      case "driver": return "bg-gradient-to-r from-amber-600 to-yellow-600";
      case "parent": return "bg-gradient-to-r from-cyan-600 to-teal-600";
      default: return "bg-gradient-to-r from-blue-600 to-blue-800";
    }
  };

  return (
    <nav className={`${getRoleColor()} text-white shadow-xl sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center bg-white p-1 rounded-xl shadow-lg">
                <img
                  src={logo}
                  alt="EduRide Logo"
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight">EduRide</span>
                <span className="text-xs font-light text-blue-100 opacity-90">School Bus Management</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <FaHome className="text-sm" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/about" 
              className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <FaInfoCircle className="text-sm" />
              <span>About</span>
            </Link>
            
            <Link 
              to="/contact" 
              className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <FaAddressCard className="text-sm" />
              <span>Contact</span>
            </Link>

            <Link 
              to="/help" 
              className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <FaQuestionCircle className="text-sm" />
              <span>Help</span>
            </Link>

            {role ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 font-medium"
                >
                  <FaTachometerAlt className="text-sm" />
                  <span>Dashboard</span>
                </Link>

                {(role === "school" || role === "agency") && (
                  <Link 
                    to={`/${role}/services`} 
                    className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors duration-200 font-medium border border-amber-400/30"
                  >
                    <FaBus className="text-sm" />
                    <span>Services</span>
                  </Link>
                )}

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile((p) => !p)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-blue-700 hover:bg-gray-100 hover:shadow-md transition-all duration-200 font-semibold"
                  >
                    <FaUserCircle className="text-lg" />
                    <span>Profile</span>
                    <FaCaretDown className={`transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-48">
                      <ProfileDropdown />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                >
                  <FaSignInAlt className="text-sm" />
                  <span>Login</span>
                </Link>
                
                <Link
                  to="/signup"
                  className="flex items-center space-x-1 bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 hover:shadow-md transition-all duration-200 ml-2"
                >
                  <FaUserPlus className="text-sm" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {role && (
              <div className="relative mr-4" ref={profileRef}>
                <button
                  onClick={() => setShowProfile((p) => !p)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-700 hover:bg-gray-100"
                >
                  <FaUserCircle className="text-xl" />
                </button>
                
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 z-50">
                    <ProfileDropdown />
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm text-gray-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="mobile-nav-link flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-blue-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaHome className="text-blue-600" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/about"
              className="mobile-nav-link flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-blue-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaInfoCircle className="text-blue-600" />
              <span>About</span>
            </Link>
            <Link 
              to="/contact" 
              className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <FaAddressCard className="text-sm" />
              <span>Contact</span>
            </Link>
            
            <Link
              to="/help"
              className="mobile-nav-link flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-blue-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaQuestionCircle className="text-blue-600" />
              <span>Help</span>
            </Link>

            {role ? (
              <>
                <Link
                  to="/dashboard"
                  className="mobile-nav-link flex items-center space-x-3 px-3 py-3 rounded-md bg-blue-50 hover:bg-blue-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaTachometerAlt className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>

                {(role === "school" || role === "agency") && (
                  <Link
                    to={`/${role}/services`}
                    className="mobile-nav-link flex items-center space-x-3 px-3 py-3 rounded-md bg-amber-50 hover:bg-amber-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaBus className="text-amber-600" />
                    <span>Services</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-nav-link flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaSignInAlt className="text-blue-600" />
                  <span>Login</span>
                </Link>
                
                <Link
                  to="/signup"
                  className="mobile-nav-link flex items-center space-x-3 px-3 py-3 rounded-md bg-blue-100 hover:bg-blue-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUserPlus className="text-blue-600" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;