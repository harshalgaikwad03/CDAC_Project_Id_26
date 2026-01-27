import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function StudentSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    className: "",
    rollNo: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    passStatus: "ACTIVE",
    schoolId: "",
    busId: ""
  });

  const [schools, setSchools] = useState([]);
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState("");

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    API.get("/schools")
      .then(res => setSchools(res.data))
      .catch(err => console.error(err));

    API.get("/buses")
      .then(res => setBuses(res.data))
      .catch(err => console.error(err));
  }, []);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- SUBMIT FORM ---------------- */
  const submit = async () => {
    setError("");

    if (!form.name || !form.className || !form.rollNo || !form.email || !form.password || !form.phone || !form.schoolId) {
      setError("Please fill all required fields");
      return;
    }

    const payload = {
      name: form.name,
      className: form.className,
      rollNo: form.rollNo,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: form.address,
      passStatus: form.passStatus,
      school: { id: form.schoolId },
      assignedBus: form.busId ? { id: form.busId } : null
    };

    try {
      await API.post("/students/signup", payload);
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Student registration failed. Please try again.");
    }
  };

  // Shared Styles
  const inputClass = "appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Student Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create an account for school transport services
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
            
            {/* --- Personal Info --- */}
            <div>
              <label className={labelClass}>Student Name</label>
              <input 
                name="name" 
                placeholder="Full Name" 
                className={inputClass}
                value={form.name} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className={labelClass}>Parent/Student Phone</label>
              <input 
                name="phone" 
                placeholder="Contact Number" 
                className={inputClass}
                value={form.phone} 
                onChange={handleChange} 
              />
            </div>

            {/* --- Academic Info --- */}
            <div>
              <label className={labelClass}>Class / Grade</label>
              <input 
                name="className" 
                placeholder="e.g. 10th - A" 
                className={inputClass}
                value={form.className} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className={labelClass}>Roll Number</label>
              <input 
                name="rollNo" 
                placeholder="e.g. 101" 
                className={inputClass}
                value={form.rollNo} 
                onChange={handleChange} 
              />
            </div>

            {/* --- Account Info --- */}
            <div>
              <label className={labelClass}>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="student@example.com" 
                className={inputClass}
                value={form.email} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Create Password" 
                className={inputClass}
                value={form.password} 
                onChange={handleChange} 
              />
            </div>

            {/* --- Transport Info --- */}
            <div>
              <label className={labelClass}>Select School</label>
              <select name="schoolId" className={inputClass} value={form.schoolId} onChange={handleChange}>
                <option value="">-- Select School --</option>
                {schools.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Assign Bus (Optional)</label>
              <select name="busId" className={inputClass} value={form.busId} onChange={handleChange}>
                <option value="">-- Select Bus --</option>
                {buses.map(b => (
                  <option key={b.id} value={b.id}>{b.busNumber}</option>
                ))}
              </select>
            </div>

             {/* --- Pass Status --- */}
             <div>
              <label className={labelClass}>Pass Status</label>
              <select name="passStatus" className={inputClass} value={form.passStatus} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* --- Address (Spans Full Width) --- */}
            <div className="col-span-1 md:col-span-2">
              <label className={labelClass}>Residential Address</label>
              <textarea 
                name="address" 
                rows="3"
                placeholder="Enter full address for pick-up/drop-off" 
                className={inputClass}
                value={form.address} 
                onChange={handleChange} 
              />
            </div>

          </div>

          {/* Submit Button */}
          <div>
            <button 
              onClick={submit} 
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Register Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentSignup;