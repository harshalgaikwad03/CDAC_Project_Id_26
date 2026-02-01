import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaSchool,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaUserCheck,
  FaSave,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaShieldAlt
} from "react-icons/fa";

function EditSchool() {
  const navigate = useNavigate();

  const [school, setSchool] = useState({
    id: null,
    name: "",
    phone: "",
    email: "",
    address: "",
    agency: null,
  });

  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSchool();
  }, []);

  const loadSchool = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await API.get("/schools/me");
      setSchool(res.data);

      // Fetch agencies ONLY if school has no agency
      if (!res.data.agency) {
        const agencyRes = await API.get("/agencies");
        setAgencies(agencyRes.data);
      }
    } catch (err) {
      setError("Failed to load school profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchool(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear any previous errors/success when user starts typing
    if (error || success) {
      setError("");
      setSuccess("");
    }
  };

  const handleAgencyChange = (e) => {
    const agencyId = e.target.value;
    setSchool(prev => ({
      ...prev,
      agency: agencyId ? { id: Number(agencyId) } : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await API.put(`/schools/${school.id}`, school);
      setSuccess("School profile updated successfully!");
      
      // Navigate after showing success message
      setTimeout(() => {
        navigate("/school/services");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mb-4"></div>
        <div className="flex items-center gap-3 text-gray-700">
          <FaSchool className="text-xl" />
          <span className="text-lg font-medium">Loading school profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* ===== BACK BUTTON ===== */}
        <button
          onClick={() => navigate("/school/services")}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-8 transition-colors duration-200 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Services</span>
        </button>

        

        {/* ===== ALERTS ===== */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
            <div className="flex-shrink-0">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-green-800 font-medium">{success}</p>
              <p className="text-green-700 text-sm mt-1">Redirecting to services...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <p className="text-red-800">{error}</p>
          </div>
        )}

       
        {/* ===== FORM ===== */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* School Information Section */}
            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                School Information
              </h3>
              <p className="text-gray-600 text-sm">
                Basic details about your institution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                  <FaSchool className="text-orange-600" />
                  School Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={school.name}
                  onChange={handleChange}
                  placeholder="Enter school name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                  <FaPhoneAlt className="text-orange-600" />
                  Contact Phone
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={school.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Email - Full Width */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaEnvelope className="text-orange-600" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={school.email || ""}
                onChange={handleChange}
                placeholder="contact@school.edu"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
              />
            </div>

            {/* Address - Full Width */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaMapMarkerAlt className="text-orange-600" />
                School Address
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={school.address}
                onChange={handleChange}
                placeholder="123 Education Street, City, State, ZIP"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
                required
              />
            </div>

            {/* Agency Section */}
            <div className="pt-6 border-t border-gray-200">
              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Transport Agency
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage your transportation service provider
                </p>
              </div>

              {!school.agency ? (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700">
                    <FaBuilding className="text-orange-600" />
                    Select Transport Agency
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 appearance-none bg-white"
                      required
                      onChange={handleAgencyChange}
                      value={school.agency?.id || ""}
                    >
                      <option value="">Choose an agency...</option>
                      {agencies.map((agency) => (
                        <option key={agency.id} value={agency.id}>
                          {agency.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-2 h-2 border-b-2 border-r-2 border-gray-400 transform rotate-45"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    This agency will manage buses, drivers, and transportation services for your school.
                    <span className="block text-orange-600 font-medium mt-1">
                      ⚠️ Agency assignment is permanent and cannot be changed later.
                    </span>
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                      <FaBuilding className="text-green-600 text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Assigned Transport Agency
                        </h4>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          Active
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{school.agency.name}</p>
                      <p className="text-gray-600">
                        This agency manages all transportation services for your school. 
                        Agency assignment is permanent for service continuity.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 flex items-center justify-center gap-3 ${
                    isSubmitting 
                      ? 'bg-orange-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
                  } text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="text-lg" />
                      <span>Update School Profile</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/school/services")}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="text-center text-gray-500 mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm">
            School Profile Management • EduRide • All changes are logged for security
          </p>
          <p className="text-xs text-gray-400 mt-2">
            School ID: {school.id} • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default EditSchool;