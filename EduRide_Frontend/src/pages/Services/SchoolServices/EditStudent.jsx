import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import {
  FaUserGraduate,
  FaEnvelope,
  FaPhoneAlt,
  FaBus,
  FaInfoCircle,
  FaSave,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaIdBadge,
  FaArrowLeft,
  FaCheck,
  FaExclamationTriangle
} from "react-icons/fa";

function EditStudent() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200";

  const [formData, setFormData] = useState({
    name: "",
    className: "",
    rollNo: "",
    email: "",
    phone: "",
    address: "",
    passStatus: "ACTIVE",
    assignedBusId: ""
  });

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1️⃣ Load student
        const studentRes = await API.get(`/students/${studentId}`);
        const student = studentRes.data;

        setFormData({
          name: student.name ?? "",
          className: student.className ?? "",
          rollNo: student.rollNo ?? "",
          email: student.email ?? "",
          phone: student.phone ?? "",
          address: student.address ?? "",
          passStatus: student.passStatus ?? "ACTIVE",
          assignedBusId: student.assignedBus?.id ?? ""
        });

        // 2️⃣ Load buses of school
        const busesRes = await API.get("/buses/school/me");
        setBuses(Array.isArray(busesRes.data) ? busesRes.data : []);
      } catch (err) {
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [studentId]);

  /* ---------------- CHANGE ---------------- */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      name: formData.name,
      className: formData.className,
      rollNo: formData.rollNo,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      passStatus: formData.passStatus,
      assignedBus: formData.assignedBusId
        ? { id: formData.assignedBusId }
        : null,
    };

    try {
      await API.put(`/students/${studentId}`, payload);
      setSuccess("Student updated successfully!");
      
      // Redirect after 1.5 seconds to show success message
      setTimeout(() => {
        navigate("/school/services/students");
      }, 1500);
    } catch (err) {
      setError("Update failed. Please check your data and try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <div className="flex items-center gap-3 text-gray-700">
          <FaUserGraduate className="text-xl" />
          <span className="text-lg font-medium">Loading student details...</span>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* ===== BACK BUTTON ===== */}
        <button
          onClick={() => navigate("/school/services/students")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
        >
          <FaArrowLeft />
          <span className="font-medium">Back to Students</span>
        </button>

       
        

        {/* ===== ALERTS ===== */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
            <div className="flex-shrink-0">
              <FaCheck className="text-green-600 text-lg" />
            </div>
            <div>
              <p className="text-green-800 font-medium">{success}</p>
              <p className="text-green-700 text-sm mt-1">Redirecting to students list...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="text-red-600 text-lg" />
            </div>
            <p className="text-red-800">{error}</p>
          </div>
        )}

        

        {/* ===== FORM ===== */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Student Information Section */}
            <Section title="Student Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field 
                  icon={<FaUserGraduate className="text-blue-600" />} 
                  label="Full Name"
                  required
                >
                  <input
                    className={inputClass}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student's full name"
                    required
                  />
                </Field>

                <Field 
                  icon={<FaLayerGroup className="text-blue-600" />} 
                  label="Class & Section"
                >
                  <input
                    className={inputClass}
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    placeholder="e.g., 8-A, 9-B"
                  />
                </Field>

                <Field 
                  icon={<FaIdBadge className="text-blue-600" />} 
                  label="Roll Number"
                >
                  <input
                    className={inputClass}
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    placeholder="Enter roll number"
                  />
                </Field>

                <Field 
                  icon={<FaEnvelope className="text-blue-600" />} 
                  label="Email Address"
                >
                  <input
                    type="email"
                    className={inputClass}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                  />
                </Field>
              </div>
            </Section>

            {/* Contact Information Section */}
            <Section title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field 
                  icon={<FaPhoneAlt className="text-blue-600" />} 
                  label="Phone Number"
                >
                  <input
                    type="tel"
                    className={inputClass}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </Field>

                <Field 
                  icon={<FaMapMarkerAlt className="text-blue-600" />} 
                  label="Address"
                >
                  <textarea
                    className={`${inputClass} min-h-[100px] resize-none`}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter residential address"
                    rows="3"
                  />
                </Field>
              </div>
            </Section>

            {/* Transportation Section */}
            <Section title="Transportation Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Bus Pass Status">
                  <div className="relative">
                    <select
                      className={`${inputClass} appearance-none`}
                      name="passStatus"
                      value={formData.passStatus}
                      onChange={handleChange}
                    >
                      <option value="ACTIVE" className="text-green-700">Active</option>
                      <option value="INACTIVE" className="text-red-700">Inactive</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className={`w-2 h-2 rounded-full ${formData.passStatus === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                  </div>
                </Field>

                <Field 
                  icon={<FaBus className="text-blue-600" />} 
                  label="Assigned Bus"
                >
                  <select
                    className={inputClass}
                    name="assignedBusId"
                    value={formData.assignedBusId}
                    onChange={handleChange}
                  >
                    <option value="">Select a bus (Optional)</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        Bus {b.busNumber} 
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </Section>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FaSave className="text-lg" />
                  Save Changes
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/school/services/students")}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="text-center text-gray-500 mt-10 pt-6 border-t border-gray-200">
          <p className="text-sm">
            School Student Management • EduRide • All changes are logged for security
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- SECTION COMPONENT ---------- */
function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ---------- FIELD WRAPPER ---------- */
function Field({ label, icon, children, required }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 font-medium text-gray-700">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// Add some CSS animations
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default EditStudent;