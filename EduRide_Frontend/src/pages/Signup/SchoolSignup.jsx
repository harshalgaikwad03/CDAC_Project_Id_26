import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    API.get("/agencies").then(res => setAgencies(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.contact || !form.email || !form.password || !form.agencyId) {
      setError("All required fields must be filled");
      return;
    }

    try {
      await API.post("/schools/signup", {
        name: form.name,
        phone: form.contact,
        email: form.email,
        password: form.password,
        address: form.address,
        agency: { id: form.agencyId }
      });
      navigate("/login");
    } catch {
      setError("School registration failed. Please try again.");
    }
  };

  // Shared styling for consistent look
  const inputClass = "appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            School Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Partner with us to manage student transport
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm text-center">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* School Name */}
            <div>
              <label className={labelClass}>School Name</label>
              <input 
                name="name" 
                placeholder="e.g. St. Xavier's High" 
                className={inputClass}
                onChange={handleChange} 
              />
            </div>

            {/* Contact */}
            <div>
              <label className={labelClass}>Contact Number</label>
              <input 
                name="contact" 
                placeholder="Office Phone Number" 
                className={inputClass}
                onChange={handleChange} 
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <input 
                name="email" 
                type="email"
                placeholder="admin@school.edu" 
                className={inputClass}
                onChange={handleChange} 
              />
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Create Password" 
                className={inputClass}
                onChange={handleChange} 
              />
            </div>

            {/* Address - Full Width */}
            <div className="col-span-1 md:col-span-2">
              <label className={labelClass}>School Address</label>
              <textarea 
                name="address" 
                rows="3"
                placeholder="Enter complete address" 
                className={inputClass}
                onChange={handleChange} 
              />
            </div>

            {/* Agency Selection - Full Width */}
            <div className="col-span-1 md:col-span-2">
              <label className={labelClass}>Transport Agency Provider</label>
              <select name="agencyId" className={inputClass} onChange={handleChange}>
                <option value="">Select Transport Agency</option>
                {agencies.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Submit Button */}
          <div>
            <button 
              onClick={submit} 
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Register School
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolSignup;