// src/pages/Services/AgencyServices/AddBus.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import { FaBus, FaSchool, FaUserTie, FaInfoCircle, FaSpinner, FaArrowLeft, FaArrowRight, FaUserFriends, FaClipboardCheck } from "react-icons/fa";

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
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* ---------------- LOAD DROPDOWNS ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDropdownLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) throw new Error("Agency not found");

        const schoolsRes = await API.get(`/schools/agency/${user.id}`);
        setSchools(schoolsRes.data || []);

        const driversRes = await API.get(
          `/drivers/agency/${user.id}/unassigned`
        );
        setDrivers(driversRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dropdown data");
      } finally {
        setDropdownLoading(false);
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

      setSuccess("Bus added successfully!");
      setTimeout(() => {
        navigate("/agency/services/buses");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add bus. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/agency/services")}
          className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Services</span>
        </button>

       
        {/* ===== INFO NOTE ===== */}
        <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/40 rounded-2xl p-5 mb-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <FaInfoCircle className="text-white text-lg" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Important Note</h4>
              <p className="text-sm text-blue-700">
                School and driver assignment is optional. You can assign or update
                these details later from the bus management section.
              </p>
            </div>
          </div>
        </div>

        {/* ===== ERROR ALERT ===== */}
        {error && (
          <div className="bg-gradient-to-r from-red-50/80 to-pink-50/40 rounded-2xl p-5 mb-6 border border-red-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <FaInfoCircle className="text-white text-sm" />
              </div>
              <div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== SUCCESS ALERT ===== */}
        {success && (
          <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/40 rounded-2xl p-5 mb-6 border border-green-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <FaClipboardCheck className="text-white text-sm" />
              </div>
              <div>
                <h4 className="text-green-800 font-semibold mb-1">Success!</h4>
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== FORM ===== */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Bus Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bus Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaBus />
                  </div>
                  <input
                    type="text"
                    name="busNumber"
                    placeholder="MH09AB1234"
                    value={formData.busNumber}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Enter a unique bus registration number
                </p>
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seating Capacity
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaUserFriends />
                  </div>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="e.g. 40"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Total number of students the bus can accommodate
                </p>
              </div>

              {/* Assign School */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaSchool className="text-green-600" />
                  Assign School (Optional)
                </label>
                <div className="relative">
                  <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    disabled={dropdownLoading}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 appearance-none bg-white"
                  >
                    <option value="">-- Select School --</option>
                    {dropdownLoading ? (
                      <option value="" disabled>Loading schools...</option>
                    ) : schools.length === 0 ? (
                      <option value="" disabled>No schools available</option>
                    ) : (
                      schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FaSchool />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  You may leave this empty and assign a school later
                </p>
              </div>

              {/* Assign Driver */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaUserTie className="text-purple-600" />
                  Assign Driver (Optional)
                </label>
                <div className="relative">
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    disabled={dropdownLoading}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 appearance-none bg-white"
                  >
                    <option value="">-- Select Driver --</option>
                    {dropdownLoading ? (
                      <option value="" disabled>Loading drivers...</option>
                    ) : drivers.length === 0 ? (
                      <option value="" disabled>No unassigned drivers available</option>
                    ) : (
                      drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({driver.licenseNumber})
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FaUserTie />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Only unassigned drivers are shown here
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`group w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-300 ${
                    loading
                      ? "bg-gradient-to-r from-blue-400 to-cyan-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Adding Bus...</span>
                    </>
                  ) : (
                    <>
                      <span>Add New Bus</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Form Stats */}


        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>Agency Fleet Management • EduRide</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddBus;