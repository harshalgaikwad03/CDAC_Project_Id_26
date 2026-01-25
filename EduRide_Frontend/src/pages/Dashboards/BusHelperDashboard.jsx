// src/pages/Dashboards/BusHelperDashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../../services/api";

function BusHelperDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Failed to load bus helper dashboard");
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Bus Helper Dashboard</h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-semibold">
              Bus: {summary?.busNumber || "Not Assigned"}
            </h2>
            <p className="text-gray-600 mt-1">
              Route: {summary?.routeName || "N/A"}
            </p>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
            Active Duty
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold">Total Students Assigned</h3>
          <p className="text-5xl font-bold text-blue-600 mt-2">
            {summary?.totalStudentsAssigned ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold">Checked In</h3>
          <p className="text-5xl font-bold text-green-600 mt-2">
            {summary?.checkedInCount ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BusHelperDashboard;