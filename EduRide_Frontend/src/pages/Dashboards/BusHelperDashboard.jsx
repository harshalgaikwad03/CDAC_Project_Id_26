import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function BusHelperDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        console.error(err);
        setError("Failed to load bus helper dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">
        Bus Helper Dashboard
      </h1>

      {/* Bus Info */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10 text-center">
        <h2 className="text-xl font-semibold">
          Bus: {summary.busNumber || "Not Assigned"}
        </h2>
        <p className="text-gray-600 mt-1">
          Route: {summary.routeName || "N/A"}
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total */}
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold">
            Total Students
          </h3>
          <p className="text-4xl font-bold text-blue-600 mt-3">
            {summary.totalStudentsAssigned}
          </p>
        </div>

        {/* Picked */}
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold">
            Picked
          </h3>
          <p className="text-4xl font-bold text-green-600 mt-3">
            {summary.pickedCount}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold">
            Pending
          </h3>
          <p className="text-4xl font-bold text-yellow-500 mt-3">
            {summary.pendingCount}
          </p>
        </div>

        {/* Dropped */}
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold">
            Dropped
          </h3>
          <p className="text-4xl font-bold text-red-600 mt-3">
            {summary.droppedCount}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mt-12">
        <button
          onClick={() => navigate("/helper/mark-status")}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Mark Student Status
        </button>
      </div>
    </div>
  );
}

export default BusHelperDashboard;
