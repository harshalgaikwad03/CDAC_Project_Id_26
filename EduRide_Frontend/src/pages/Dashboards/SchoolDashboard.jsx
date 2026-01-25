// src/pages/Dashboards/SchoolDashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../../services/api";

function SchoolDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get("/schools/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSummary(res.data);
      } catch (err) {
        setError("Failed to load school dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">School Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold">Total Students</h3>
          <p className="text-5xl font-bold text-purple-600 mt-2">
            {summary?.totalStudents ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold">Assigned Buses</h3>
          <p className="text-5xl font-bold text-blue-600 mt-2">
            {summary?.assignedBuses ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold">Today's Attendance</h3>
          <p className="text-5xl font-bold text-green-600 mt-2">
            {summary?.todayAttendancePercentage?.toFixed(1) ?? 0}%
          </p>
        </div>
      </div>

      <div className="text-center">
        <a
          href="/school/services"
          className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-blue-700"
        >
          View Students & Bus Assignments →
        </a>
      </div>
    </div>
  );
}

export default SchoolDashboard;