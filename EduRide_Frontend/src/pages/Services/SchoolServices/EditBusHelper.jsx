import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";

function EditBusHelper() {
  const { helperId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    assignedBusId: "",
  });

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ─────────────────────────────────────────────
  // Load helper + buses
  // ─────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const schoolId = user.id;

        if (!schoolId) {
          throw new Error("Please login again");
        }

        // 1️⃣ Fetch helper (DTO)
        const helperRes = await API.get(`/helpers/${helperId}/edit`);
        const helper = helperRes.data;

        // 2️⃣ Populate form
        setFormData({
          name: helper.name || "",
          phone: helper.phone || "",
          assignedBusId: helper.assignedBusId
            ? String(helper.assignedBusId)
            : "",
        });

        // 3️⃣ Fetch buses for dropdown
        const busesRes = await API.get(`/buses/school/me`);
        setBuses(busesRes.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load helper"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [helperId]);

  // ─────────────────────────────────────────────
  // Form handlers
  // ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ─────────────────────────────────────────────
  // Submit update
  // ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone || null,
        assignedBusId: formData.assignedBusId
          ? Number(formData.assignedBusId)
          : null,
      };

      await API.put(`/helpers/${helperId}`, payload);

      alert("Bus Helper updated successfully");
      navigate("/school/services/bus-helpers");
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err.response?.data?.message || "Failed to update bus helper"
      );
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────
  // UI states
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">
        Edit Bus Helper
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block font-medium mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-2">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Assigned Bus */}
        <div>
          <label className="block font-medium mb-2">
            Assigned Bus
          </label>
          <select
            name="assignedBusId"
            value={formData.assignedBusId}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Not Assigned</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                Bus {bus.busNumber} (Capacity: {bus.capacity})
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            saving
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditBusHelper;
