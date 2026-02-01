// src/pages/Services/AgencyServices/BusEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../services/api";
import {
  FaBus,
  FaSchool,
  FaUserTie,
  FaInfoCircle,
  FaCheckCircle,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaUsers,
  FaIdCard,
  FaClipboardCheck
} from "react-icons/fa";

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
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* ---------------- LOAD BUS + SCHOOLS + DRIVERS ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
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
              licenseNumber: "Currently Assigned",
            });
          }
        }

        setDrivers(driverList);
      } catch (err) {
        console.error(err);
        setError("Failed to load bus details");
      } finally {
        setFetching(false);
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

      setSuccess("Bus updated successfully");

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

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mb-6">
          <FaSpinner className="text-blue-600 text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Bus Details...</h3>
        <p className="text-gray-500">Fetching bus information</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/agency/services/buses")}
          className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Bus List</span>
        </button>

       

        {/* ===== INFO NOTE ===== */}
        <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/40 rounded-2xl p-5 mb-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <FaInfoCircle className="text-white text-lg" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Update Information</h4>
              <p className="text-sm text-blue-700">
                Changing driver or school assignments will immediately reflect in
                daily transportation schedules. Please review changes carefully.
              </p>
            </div>
          </div>
        </div>

        {/* ❌ ERROR ALERT */}
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

        {/* ✅ SUCCESS ALERT */}
        {success && (
          <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/40 rounded-2xl p-5 mb-6 border border-green-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <FaCheckCircle className="text-white text-sm" />
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
                    name="busNumber"
                    value={formData.busNumber}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400"
                    placeholder="Enter bus registration number"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Unique registration number of the bus
                </p>
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seating Capacity
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaUsers />
                  </div>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400"
                    placeholder="Enter seating capacity"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Maximum number of students allowed
                </p>
              </div>

              {/* Assign School */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaSchool className="text-green-600" />
                  Assign School
                </label>
                <div className="relative">
                  <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 appearance-none bg-white"
                  >
                    <option value="">No School Assigned</option>
                    {schools.map((school) => (
                      <option key={school.id} value={String(school.id)}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FaSchool />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  {formData.schoolId ? "Currently assigned to school" : "No school assigned"}
                </p>
              </div>

              {/* Assign Driver */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaUserTie className="text-purple-600" />
                  Assign Driver
                </label>
                <div className="relative">
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 appearance-none bg-white"
                  >
                    <option value="">No Driver Assigned</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={String(driver.id)}>
                        {driver.name} ({driver.licenseNumber})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FaIdCard />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  {formData.driverId ? "Driver currently assigned" : "No driver assigned"}
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
                      <span>Updating Bus...</span>
                    </>
                  ) : (
                    <>
                      <FaClipboardCheck />
                      <span>Update Bus Details</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        

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

export default BusEdit;