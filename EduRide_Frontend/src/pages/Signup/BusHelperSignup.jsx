import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function BusHelperSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    schoolId: ""
  });

  const [schools, setSchools] = useState([]);

  useEffect(() => {
    API.get("/schools").then(res => setSchools(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      await API.post("/helpers/signup", {
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        school: { id: form.schoolId }
      });
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error);
      alert("Registration failed. Please check your details.");
    }
  };

  // Shared class for both inputs and select boxes
  const inputClass =
    "appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">

        {/* Header */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Bus Helper Signup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register a new helper and assign them to a school
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="name"
                placeholder="Enter helper's name"
                className={inputClass}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                placeholder="Enter phone number"
                className={inputClass}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                placeholder="Enter email address"
                className={inputClass}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                className={inputClass}
                onChange={handleChange}
              />
            </div>

            {/* School Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign School
              </label>
              <select
                name="schoolId"
                className={inputClass}
                onChange={handleChange}
              >
                <option value="">Select School</option>
                {schools.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
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
              Register Helper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusHelperSignup;
