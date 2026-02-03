import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaSchool,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaBuilding,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClipboardCheck
} from "react-icons/fa";

function SchoolSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    address: "",
    agencyId: ""
  });

  const [agencies, setAgencies] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    API.get("/agencies").then(res => setAgencies(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e?.preventDefault();

    if (!form.name || !form.contact || !form.email || !form.password || !form.agencyId) {
      setError("All required fields must be filled");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await API.post("/schools/signup", {
        name: form.name,
        phone: form.contact,
        email: form.email,
        password: form.password,
        address: form.address,
        agency: { id: form.agencyId }
      });

      setSuccess("School account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("School registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white";

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

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FaSchool className="text-3xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">School Registration</h1>
                    <p className="text-blue-100 mt-1">
                      Register your school to manage student transportation digitally
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8">

                {/* Info Box */}
                <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaClipboardCheck className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        School Account Setup
                      </h3>
                      <p className="text-blue-700">
                        Create a school account to manage students, assign buses,
                        and coordinate transportation services with a transport agency.
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
                        Please verify the entered details
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
                        You will be redirected shortly
                      </p>
                    </div>
                  </div>
                )}

                {/* FORM */}
                <form onSubmit={submit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* School Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaSchool className="text-blue-600" />
                        School Name
                      </label>
                      <input
                        name="name"
                        placeholder="e.g. St. Xavier's High School"
                        className={inputClass}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Contact */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaPhone className="text-blue-600" />
                        Contact Number
                      </label>
                      <input
                        name="contact"
                        placeholder="Office contact number"
                        className={inputClass}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaEnvelope className="text-blue-600" />
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        placeholder="admin@school.edu"
                        className={inputClass}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaLock className="text-blue-600" />
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Minimum 6 characters"
                        className={inputClass}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaMapMarkerAlt className="text-blue-600" />
                        School Address
                      </label>
                      <textarea
                        name="address"
                        rows="3"
                        placeholder="Enter complete school address"
                        className={inputClass}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Agency */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaBuilding className="text-blue-600" />
                        Transport Agency Provider
                      </label>
                      <select
                        name="agencyId"
                        className={inputClass}
                        onChange={handleChange}
                      >
                        <option value="">Select Transport Agency</option>
                        {agencies.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${
                      isSubmitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? "Registering School..." : "Create School Account"}
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
                School Benefits
              </h3>

              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex gap-3">
                  <FaCheckCircle className="text-green-500" />
                  Student transport management
                </li>
                <li className="flex gap-3">
                  <FaCheckCircle className="text-green-500" />
                  Bus and route allocation
                </li>
                <li className="flex gap-3">
                  <FaCheckCircle className="text-green-500" />
                  Attendance and safety monitoring
                </li>
                <li className="flex gap-3">
                  <FaCheckCircle className="text-green-500" />
                  Coordination with transport agency
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
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

export default SchoolSignup;
