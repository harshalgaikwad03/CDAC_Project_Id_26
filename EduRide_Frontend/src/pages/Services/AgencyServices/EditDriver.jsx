import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import {
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaCheckCircle,
  FaUserEdit
} from "react-icons/fa";

function EditDriver() {
  const { driverId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: ""
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    API.get(`/drivers/${driverId}`)
      .then(res => {
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          licenseNumber: res.data.licenseNumber || ""
        });
      })
      .catch(() => {
        setError("Failed to load driver details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [driverId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await API.put(`/drivers/${driverId}`, formData);
      setSuccess("Driver updated successfully!");
      
      setTimeout(() => {
        navigate("/agency/services/drivers");
      }, 1500);
    } catch {
      setError("Failed to update driver. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-6">
          <FaSpinner className="text-purple-600 text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Driver Details...</h3>
        <p className="text-gray-500">Fetching driver information</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/agency/services/drivers")}
          className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Driver List</span>
        </button>

        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">
          
          <p className="text-lg text-gray-700">
            Update driver information and contact details
          </p>
        </div>

        {/* ===== ERROR ALERT ===== */}
        {error && (
          <div className="bg-gradient-to-r from-red-50/80 to-pink-50/40 rounded-2xl p-5 mb-6 border border-red-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <FaCheckCircle className="text-white text-sm" />
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
          <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Driver Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaUserTie className="text-purple-600" />
                  Driver Name
                </label>
                <div className="relative">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 hover:border-purple-400"
                    placeholder="Enter driver's full name"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaUserTie />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Full name as per official documents
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaEnvelope className="text-blue-600" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 hover:border-purple-400"
                    placeholder="driver@example.com"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaEnvelope />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Official email address for communication
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="text-green-600" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 hover:border-purple-400"
                    placeholder="+91 98765 43210"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaPhone />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Active mobile number for emergency contact
                </p>
              </div>

              {/* License Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaIdCard className="text-amber-600" />
                  License Number
                </label>
                <div className="relative">
                  <input
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 hover:border-purple-400"
                    placeholder="DL-1234567890123"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaIdCard />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  Valid driving license number
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`group w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-300 ${
                    submitting
                      ? "bg-gradient-to-r from-purple-400 to-pink-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Updating Driver...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      <span>Update Driver</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

       

        {/* Footer */}
        {/* <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>Driver Profile Management • EduRide</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default EditDriver;