import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
  FaTruck,
  FaRoute,
  FaUserTie,
  FaClipboardCheck
} from "react-icons/fa";

function AgencySignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    address: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    contact: false,
    email: false,
    password: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateForm = () => {
    const errors = [];

    if (!form.name.trim()) errors.push("Agency name is required");
    if (!form.contact.trim()) errors.push("Contact number is required");
    if (!form.email.trim()) errors.push("Email address is required");
    if (!form.password.trim()) errors.push("Password is required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      errors.push("Please enter a valid email address");
    }

    if (form.password && form.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (errors.length > 0) {
      setError(errors[0]);
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await API.post("/agencies/signup", {
        name: form.name,
        phone: form.contact,
        email: form.email,
        password: form.password,
        address: form.address
      });

      setSuccess("Agency account created successfully. Redirecting to login...");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Agency registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* ===== BACK BUTTON ===== */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors duration-200 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Role Selection</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ===== LEFT PANEL ===== */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FaBuilding className="text-white text-3xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      Transport Agency Registration
                    </h1>
                    <p className="text-blue-100 mt-1">
                      Register your agency to manage school transportation digitally
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaClipboardCheck className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Agency Account Setup
                      </h3>
                      <p className="text-blue-700">
                        Create an agency account to manage buses, drivers, routes,
                        and coordinate transportation services with schools.
                        Fields marked with * are mandatory.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4 animate-fadeIn">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                    <div>
                      <p className="font-semibold text-red-800">{error}</p>
                      <p className="text-red-700 text-sm mt-1">
                        Please verify the entered information
                      </p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-4 animate-fadeIn">
                    <FaCheckCircle className="text-green-600 text-xl" />
                    <div>
                      <p className="font-semibold text-green-800">{success}</p>
                      <p className="text-green-700 text-sm mt-1">
                        Redirecting to login page
                      </p>
                    </div>
                  </div>
                )}

                {/* FORM */}
                <form
                  onSubmit={submit}
                  onKeyPress={handleKeyPress}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Agency Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaBuilding className="text-blue-600" />
                        Agency Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur("name")}
                        placeholder="e.g., City Transport Services"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Contact */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaPhone className="text-blue-600" />
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                        placeholder="e.g., 9876543210"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaEnvelope className="text-blue-600" />
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="agency@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaLock className="text-blue-600" />
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Minimum 6 characters"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-medium text-gray-700">
                      <FaMapMarkerAlt className="text-blue-600" />
                      Office Address
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Enter agency office address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl"
                  >
                    {isSubmitting
                      ? "Creating Agency Account..."
                      : "Create Agency Account"}
                  </button>
                </form>
                {/* Login Link */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-600">
                    Already registered?{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Login here
                    </button>
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* ===== RIGHT PANEL ===== */}
          <div className="lg:w-1/3">
            <div className="bg-gradient-to-b from-indigo-50 to-white rounded-3xl shadow-2xl border border-indigo-100 p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Agency Features
              </h3>

              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex gap-3">
                  <FaTruck className="text-blue-600" />
                  Bus and fleet management
                </li>
                <li className="flex gap-3">
                  <FaRoute className="text-green-600" />
                  Route assignment and tracking
                </li>
                <li className="flex gap-3">
                  <FaUserTie className="text-purple-600" />
                  Driver allocation and schedules
                </li>
                <li className="flex gap-3">
                  <FaShieldAlt className="text-orange-600" />
                  Safety and compliance monitoring
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="text-center mt-12 text-xs text-gray-400">
          © {new Date().getFullYear()} EduRide – Smart School Transportation System
        </div> */}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AgencySignup;
