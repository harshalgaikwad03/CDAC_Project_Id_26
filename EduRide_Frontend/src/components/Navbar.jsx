// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const role = localStorage.getItem("role")?.toLowerCase();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          EduRide
        </Link>

        <div className="space-x-6">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/help" className="hover:underline">Help</Link>

          {role && (
            <>
              {role === "school" && (
                <Link to="/school/services" className="hover:underline font-medium">
                  Services
                </Link>
              )}
              {role === "agency" && (
                <Link to="/agency/services" className="hover:underline font-medium">
                  Services
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}

          {!role && (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;