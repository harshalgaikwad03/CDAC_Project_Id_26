// src/pages/Dashboards/AgencyDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api"; // your axios instance

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

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Agency Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold">Total Buses</h3>
          <p className="text-5xl font-bold text-blue-600 mt-2">
            {summary?.totalBuses ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold">Total Drivers</h3>
          <p className="text-5xl font-bold text-green-600 mt-2">
            {summary?.totalDrivers ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold">Total Students</h3>
          <p className="text-5xl font-bold text-purple-600 mt-2">
            {summary?.totalStudents ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold">Total Schools</h3>
          <p className="text-5xl font-bold text-orange-600 mt-2">
            {summary?.totalSchools ?? 0}
          </p>
        </div>
      </div>

      {/* You can add more sections: recent activity, charts, etc. */}
      <div className="text-center">
        <a
          href="/agency/services"
          className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-blue-700"
        >
          Manage Services & Fleet →
        </a>
      </div>

      {/* Feedback Button */}
      <button
  onClick={() => navigate("/feedback")}
  className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition"
>
  Give Feedback
</button>


    </div>
  );
}

export default AgencyDashboard;