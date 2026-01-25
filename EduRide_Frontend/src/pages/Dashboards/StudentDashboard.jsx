// src/pages/Dashboards/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Get current student's profile
        const studentRes = await API.get("/students/me");
        const studentData = studentRes.data;
        setStudent(studentData);

        // 2. Get today's status (using student's own ID)
        if (studentData?.id) {
          const statusRes = await API.get(`/student-status/today/${studentData.id}`);
          if (statusRes.status === 200) {
            setTodayStatus(statusRes.data);
          } else if (statusRes.status === 204) {
            setTodayStatus(null); // no status today
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err.response?.data?.message ||
          "Failed to load your dashboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-medium text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded max-w-lg">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome, {student?.name || "Student"}
          </h1>
          <p className="text-gray-600 mt-2">
            {student?.className && `Class ${student.className}`} • Roll No: {student?.rollNo || "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Today's Status Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Today's Bus Status</h2>

        {todayStatus ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-medium text-gray-700">Pickup Status</h3>
              <p className="text-3xl font-bold mt-3 text-green-600">
                {todayStatus.pickupStatus || "Pending"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-medium text-gray-700">Updated By</h3>
              <p className="text-2xl font-semibold mt-3">
                {todayStatus.updatedBy?.name || "Driver / Helper"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-medium text-gray-700">Date</h3>
              <p className="text-2xl font-semibold mt-3">
                {todayStatus.date || new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <p className="text-lg text-yellow-800">
              No status recorded for today yet.
              <br />
              <span className="text-sm mt-2 block">
                Your driver or bus helper will update it soon.
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Your Details</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-medium">School:</span>{" "}
              {student?.school?.name || student?.school?.schoolName || "N/A"}
            </p>
            <p>
              <span className="font-medium">Assigned Bus:</span>{" "}
              {student?.assignedBus?.busNumber || "Not Assigned"}
            </p>
            <p>
              <span className="font-medium">Address:</span> {student?.address || "N/A"}
            </p>
            <p>
              <span className="font-medium">Pass Status:</span>{" "}
              <span className={student?.passStatus === "ACTIVE" ? "text-green-600" : "text-red-600"}>
                {student?.passStatus || "N/A"}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Quick Actions</h3>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/student/profile")} // ← add this route later if needed
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition"
            >
              Update Profile
            </button>
            <button
              onClick={() => alert("Contact school/transport feature coming soon!")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition"
            >
              Report Issue / Contact Driver
            </button>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-gray-500 text-sm mt-12">
        EduRide • Safe & Smart School Transportation • Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}

export default StudentDashboard;