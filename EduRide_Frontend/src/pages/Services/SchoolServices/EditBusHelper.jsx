import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import {
  FaUserTie,
  FaPhoneAlt,
  FaBus,
  FaInfoCircle,
  FaSave,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaUserFriends,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

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

        // 1️⃣ Fetch helper
        const helperRes = await API.get(`/helpers/${helperId}/edit`);
        const helper = helperRes.data;

        setFormData({
          name: helper.name || "",
          phone: helper.phone || "",
          assignedBusId: helper.assignedBusId
            ? String(helper.assignedBusId)
            : "",
        });

        // 2️⃣ Fetch buses
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
  // Form change
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
  // Loading
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mb-6">
          <FaSpinner className="text-green-600 text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Helper Details...</h3>
        <p className="text-gray-500">Fetching bus helper information</p>
      </div>
    );
  }

  const selectedBus = buses.find(bus => String(bus.id) === formData.assignedBusId);
  const assignedBuses = buses.filter(bus => bus.assignedHelperId && bus.assignedHelperId !== helperId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/school/services/bus-helpers")}
          className="group flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Helper List</span>
        </button>

        

        

        {/* ===== ERROR ALERT ===== */}
        {error && (
          <div className="bg-gradient-to-r from-red-50/80 to-pink-50/40 rounded-2xl p-5 mb-6 border border-red-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <FaExclamationTriangle className="text-white text-sm" />
              </div>
              <div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== FORM ===== */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaUserTie className="text-green-600" />
                  Helper Name
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter helper's full name"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-300 hover:border-green-400"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaUserTie />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Full name as per official records
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaPhoneAlt className="text-blue-600" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-300 hover:border-green-400"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaPhoneAlt />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Optional - for emergency contact only
                </p>
              </div>

              {/* Assigned Bus */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaBus className="text-purple-600" />
                  Assigned Bus
                </label>
                <div className="relative">
                  <select
                    name="assignedBusId"
                    value={formData.assignedBusId}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-300 hover:border-green-400 appearance-none bg-white"
                  >
                    <option value="">Not Assigned</option>
                    {buses.map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        Bus {bus.busNumber} • Capacity {bus.capacity}
                        {bus.assignedHelperId && bus.assignedHelperId !== helperId ? ' (Already Assigned)' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FaBus />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  {selectedBus 
                    ? `Currently assigned to Bus ${selectedBus.busNumber}` 
                    : "Select a bus for assignment"}
                </p>
              </div>

              {/* Bus Info Card */}
              {selectedBus && (
                <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/30 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                      <FaBus className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Selected Bus Details</h4>
                      <p className="text-sm text-gray-700">
                        Bus {selectedBus.busNumber} • Capacity: {selectedBus.capacity} students
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className={`group w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-300 ${
                    saving
                      ? "bg-gradient-to-r from-green-400 to-emerald-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      <span>Save Changes</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        

        {/* Warning for already assigned buses */}
        {assignedBuses.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-amber-50/80 to-orange-50/40 rounded-2xl p-5 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <FaInfoCircle className="text-white text-sm" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Bus Assignment Notice</h4>
                <p className="text-sm text-amber-700">
                  Some buses are already assigned to other helpers. Please review assignments carefully.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {/* <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>School Bus Helper Management • EduRide</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default EditBusHelper;