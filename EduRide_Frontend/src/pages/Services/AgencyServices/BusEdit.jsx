// src/pages/Services/AgencyServices/BusEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../services/api";

function BusEdit() {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    busNumber: "",
    capacity: 0,
    schoolId: "",
    driverId: "",
  });

  const [schools, setSchools] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        // 1️⃣ Fetch bus
        const busRes = await API.get(`/buses/${busId}`);
        const bus = busRes.data;

        setFormData({
          busNumber: bus.busNumber,
          capacity: bus.capacity,
          schoolId: bus.school?.id || "",
          driverId: bus.driver?.id || "",
        });

        // 2️⃣ Fetch schools
        const schoolsRes = await API.get(`/schools/agency/${user.id}`);
        setSchools(schoolsRes.data || []);

        // 3️⃣ Fetch unassigned drivers
        const driversRes = await API.get(
          `/drivers/agency/${user.id}/unassigned`
        );

        // Include currently assigned driver (important for edit)
        const driverList = driversRes.data || [];
        if (bus.driver) {
          driverList.push(bus.driver);
        }

        setDrivers(driverList);
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
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        busNumber: formData.busNumber,
        capacity: Number(formData.capacity),
        school: formData.schoolId ? { id: Number(formData.schoolId) } : null,
        driver: formData.driverId ? { id: Number(formData.driverId) } : null,
      };

      await API.put(`/buses/${busId}`, payload);
      navigate("/agency/services/buses");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">
        Edit Bus Details
      </h1>

      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        {/* Bus Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Bus Number
          </label>
          <input
            name="busNumber"
            value={formData.busNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Assign School */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Assign School
          </label>
          <select
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No School Assigned</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Assign Driver */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Assign Driver
          </label>
          <select
            name="driverId"
            value={formData.driverId}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No Driver Assigned</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.licenseNumber})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating Bus..." : "Update Bus"}
        </button>
      </form>
    </div>
  );
}

export default BusEdit;
