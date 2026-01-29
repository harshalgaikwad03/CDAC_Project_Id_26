// src/pages/Services/AgencyServices/BusDetails.jsx (update your existing – now shows list with edit)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

function BusDetails() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await API.get(`/buses/agency/${user.id}`);
        setBuses(res.data);
      } catch (err) {
        setError("Failed to load buses");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  const handleEdit = (busId) => {
    navigate(`/agency/services/edit-bus/${busId}`);
  };

  if (loading) return <div className="text-center py-20">Loading buses...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">All Buses Under Your Agency</h1>

      {buses.length === 0 ? (
        <div className="text-center text-gray-600 py-20">
          No buses found. Add a new bus from services page.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buses.map((bus) => (
            <div key={bus.id} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Bus No: {bus.busNumber}</h3>
              <p className="text-gray-700 mb-2">Capacity: {bus.capacity}</p>
              <p className="text-gray-700 mb-2">
                Assigned School: {bus.schoolName || "Not Assigned"}
              </p>
              <p className="text-gray-700 mb-6">
                Driver: {bus.driverName || "Not Assigned"}
              </p>

              <button
                onClick={() => handleEdit(bus.id)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-medium transition"
              >
                Edit Bus Details
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <button
          onClick={() => navigate("/agency/services")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition"
        >
          Back to Services
        </button>
      </div>
    </div>
  );
}

export default BusDetails;