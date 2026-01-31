// src/pages/Services/AgencyServices/AddBus.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

function AddBus() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    busNumber: "",
    capacity: "",
    schoolId: "",
    driverId: "",
  });

  const [schools, setSchools] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* ---------------- LOAD DROPDOWNS ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) throw new Error("Agency not found");

        // Schools
        const schoolsRes = await API.get(`/schools/agency/${user.id}`);
        setSchools(schoolsRes.data || []);

        // Unassigned Drivers
        const driversRes = await API.get(
          `/drivers/agency/${user.id}/unassigned`
        );
        setDrivers(driversRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dropdown data");
      }
    };

    fetchData();
  }, []);

  /* ---------------- FORM CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        busNumber: formData.busNumber.trim(),
        capacity: Number(formData.capacity),

        school: formData.schoolId
          ? { id: Number(formData.schoolId) }
          : null,

        driver: formData.driverId
          ? { id: Number(formData.driverId) }
          : null,
      };

      await API.post("/buses", payload);

      // ✅ SUCCESS
      setSuccess("Bus added successfully!");
      setTimeout(() => {
        navigate("/agency/services/buses");
      }, 1500);
    } catch (err) {
      // ✅ SHOW BACKEND MESSAGE (e.g. "Bus number already exists")
      setError(
        err.response?.data?.message ||
          "Failed to add bus. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">
        Add New Bus
      </h1>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        {/* Bus Number */}
        <input
          type="text"
          name="busNumber"
          placeholder="Bus Number"
          value={formData.busNumber}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        {/* Capacity */}
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          min="1"
          required
          className="w-full p-3 border rounded-lg"
        />

        {/* Assign School */}
        <select
          name="schoolId"
          value={formData.schoolId}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">-- Assign School (optional) --</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>

        {/* Assign Driver */}
        <select
          name="driverId"
          value={formData.driverId}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">-- Assign Driver (optional) --</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name} ({driver.licenseNumber})
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white ${
            loading
              ? "bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding Bus..." : "Add Bus"}
        </button>
      </form>
    </div>
  );
}

export default AddBus;
