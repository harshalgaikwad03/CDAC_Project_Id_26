import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function StudentSignup() {
  const navigate = useNavigate();

  // ───────── FORM STATE (DTO-COMPATIBLE) ─────────
  const [form, setForm] = useState({
    name: "",
    className: "",
    rollNo: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    schoolId: ""
  });

  const [schools, setSchools] = useState([]);
  const [error, setError] = useState("");

  // ───────── LOAD SCHOOLS ─────────
  useEffect(() => {
    API.get("/schools")
      .then(res => setSchools(res.data))
      .catch(err => console.error("School load error:", err));
  }, []);

  // ───────── HANDLE INPUT ─────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: name === "schoolId" ? Number(value) : value
    }));
  };

  // ───────── SUBMIT FORM ─────────
  const submit = async () => {
    setError("");

    if (
      !form.name ||
      !form.className ||
      !form.rollNo ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.address ||
      !form.schoolId
    ) {
      setError("Please fill all required fields");
      return;
    }

    // ✅ EXACTLY MATCHES StudentSignupDTO (busId removed)
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      rollNo: form.rollNo,
      className: form.className,
      address: form.address,
      schoolId: form.schoolId
    };

    try {
      await API.post("/students/signup", payload);
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message ||
        "Student registration failed. Please try again."
      );
    }
  };

  // ───────── STYLES ─────────
  const inputClass =
    "appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white";

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1";

  // ───────── UI ─────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-3xl w-full bg-white p-10 rounded-xl shadow-lg">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Student Registration
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Create an account for school transport services
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className={labelClass}>Student Name</label>
            <input
              name="name"
              className={inputClass}
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input
              name="phone"
              className={inputClass}
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelClass}>Class</label>
            <input
              name="className"
              className={inputClass}
              value={form.className}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelClass}>Roll No</label>
            <input
              name="rollNo"
              className={inputClass}
              value={form.rollNo}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
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
              className={inputClass}
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelClass}>Select School</label>
            <select
              name="schoolId"
              className={inputClass}
              value={form.schoolId}
              onChange={handleChange}
            >
              <option value="">-- Select School --</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea
              name="address"
              rows="3"
              className={inputClass}
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          onClick={submit}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Register Student
        </button>
      </div>
    </div>
  );
}

export default StudentSignup;
