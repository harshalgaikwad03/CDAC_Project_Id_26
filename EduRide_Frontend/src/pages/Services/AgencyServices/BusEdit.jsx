// src/pages/Services/AgencyServices/BusEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../services/api";

function BusEdit() {
  const { busId } = useParams();
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

  // ✅ NEW: success message
  const [success, setSuccess] = useState(null);

  /* ---------------- LOAD BUS + SCHOOLS + DRIVERS ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const busRes = await API.get(`/buses/${busId}`);
        const bus = busRes.data;

        setFormData({
          busNumber: bus.busNumber || "",
          capacity: bus.capacity || "",
          schoolId: bus.schoolId ? String(bus.schoolId) : "",
          driverId: bus.driverId ? String(bus.driverId) : "",
        });

        const schoolsRes = await API.get(`/schools/agency/${user.id}`);
        setSchools(schoolsRes.data || []);

        const driversRes = await API.get(
          `/drivers/agency/${user.id}/unassigned`
        );

        let driverList = driversRes.data || [];

        if (bus.driverId) {
          const exists = driverList.some(
            (d) => String(d.id) === String(bus.driverId)
          );

          if (!exists) {
            driverList.push({
              id: bus.driverId,
              name: bus.driverName,
              licenseNumber: "Assigned",
            });
          }
        }

        setDrivers(driverList);
      } catch (err) {
        console.error(err);
        setError("Failed to load bus details");
      }
    };

    fetchData();
  }, [busId]);

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

      await API.put(`/buses/${busId}`, payload);

      // ✅ SHOW SUCCESS MESSAGE
      setSuccess("Bus updated successfully ✅");

      // ✅ REDIRECT AFTER 2 SECONDS
      setTimeout(() => {
        navigate("/agency/services/buses");
      }, 2000);

    } catch (err) {
      console.error(err);
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

      {/* ❌ ERROR MESSAGE */}
      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded text-red-700">
          {error}
        </div>
      )}

      {/* ✅ SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-50 p-4 mb-6 rounded text-green-700 text-center">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <div>
          <label className="block font-medium mb-2">Bus Number</label>
          <input
            name="busNumber"
            value={formData.busNumber}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Assign School</label>
          <select
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">No School Assigned</option>
            {schools.map((school) => (
              <option key={school.id} value={String(school.id)}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">Assign Driver</label>
          <select
            name="driverId"
            value={formData.driverId}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">No Driver Assigned</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={String(driver.id)}>
                {driver.name} ({driver.licenseNumber})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white ${
            loading
              ? "bg-blue-400"
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
