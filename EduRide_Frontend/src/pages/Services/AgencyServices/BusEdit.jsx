// src/pages/Services/AgencyServices/BusEdit.jsx (new file)
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../services/api";

function BusEdit() {
  const { busId } = useParams();  // Get bus ID from URL
  const [formData, setFormData] = useState({
    busNumber: "",
    capacity: 0,
    schoolId: null,
  });
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch bus details + schools
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bus
        const busRes = await API.get(`/buses/${busId}`);
        setFormData({
          busNumber: busRes.data.busNumber,
          capacity: busRes.data.capacity,
          schoolId: busRes.data.school?.id || null,
        });

        // Fetch schools for assignment
        const user = JSON.parse(localStorage.getItem("user"));
        const schoolsRes = await API.get(`/schools/agency/${user.id}`);
        setSchools(schoolsRes.data);
      } catch (err) {
        setError("Failed to load bus details");
      }
    };
    fetchData();
  }, [busId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await API.put(`/buses/${busId}`, formData);
      navigate("/agency/services/buses");  // Back to list after update
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Edit Bus Details</h1>

      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Bus Number</label>
          <input
            name="busNumber"
            value={formData.busNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Assign School</label>
          <select
            name="schoolId"
            value={formData.schoolId || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No School Assigned</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name || school.schoolName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating Bus..." : "Update Bus"}
        </button>
      </form>
    </div>
  );
}

export default BusEdit;
