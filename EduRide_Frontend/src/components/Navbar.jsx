import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "./Profiles/ProfileDropdown";

function Navbar() {
  const role = localStorage.getItem("role")?.toLowerCase()?.trim();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

  // close profile on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-600 text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          EduRide
        </Link>

        <div className="space-x-6 flex items-center">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/help">Help</Link>

          {role && (
            <>
              <Link to="/dashboard" className="font-medium">
                Dashboard
              </Link>

              {(role === "school" || role === "agency") && (
                <Link to={`/${role}/services`} className="font-medium">
                  Services
                </Link>
              )}

              {/* Profile Button */}
              <button
                onClick={() => setShowProfile((p) => !p)}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
              >
                Profile
              </button>
            </>
          )}

          {!role && (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-4 py-2 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Profile Dropdown */}
      {showProfile && (
        <div ref={profileRef}>
          <ProfileDropdown />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
