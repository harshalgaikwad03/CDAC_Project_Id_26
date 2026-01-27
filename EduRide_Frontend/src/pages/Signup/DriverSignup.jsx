import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function DriverSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    licenseNumber: "",
    agencyId: ""
  });

  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    API.get("/agencies").then(res => setAgencies(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      await API.post("/drivers/signup", {
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        licenseNumber: form.licenseNumber,
        agency: { id: form.agencyId }
      });
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error);
      alert("Driver registration failed. Please check details.");
    }
  };

  // Shared Styling Constants
  const inputClass = "appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Driver Signup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register a new driver to the system
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <input 
                name="name" 
                placeholder="Driver's Name" 
                className={inputClass}
                onChange={handleChange} 
              />
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone Number</label>
              <input 
                name="phone" 
                placeholder="Contact Number" 
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
                placeholder="driver@example.com" 
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

            {/* License Number */}
            <div>
              <label className={labelClass}>License Number</label>
              <input 
                name="licenseNumber" 
                placeholder="e.g. DL-123456789" 
                className={inputClass}
                onChange={handleChange} 
              />
            </div>

            {/* Agency Selection */}
            <div>
              <label className={labelClass}>Employing Agency</label>
              <select name="agencyId" className={inputClass} onChange={handleChange}>
                <option value="">Select Agency</option>
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
              Register Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverSignup;