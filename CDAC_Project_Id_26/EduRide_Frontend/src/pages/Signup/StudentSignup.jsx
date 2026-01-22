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
    address: "",
    passStatus: "ACTIVE",
    schoolId: "",
    busId: ""
  });

  const [schools, setSchools] = useState([]);
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/schools").then(res => setSchools(res.data));
    API.get("/buses").then(res => setBuses(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (
      !form.name ||
      !form.className ||
      !form.rollNo ||
      !form.email ||
      !form.password ||
      !form.schoolId
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await API.post("/students/signup", form);
      navigate("/login");
    } catch (err) {
      setError("Student registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Student Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Student Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="className"
        placeholder="Class"
        value={form.className}
        onChange={handleChange}
      />

      <input
        type="text"
        name="rollNo"
        placeholder="Roll Number"
        value={form.rollNo}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <textarea
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
      />

      <select
        name="passStatus"
        value={form.passStatus}
        onChange={handleChange}
      >
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>

      <select
        name="schoolId"
        value={form.schoolId}
        onChange={handleChange}
      >
        <option value="">Select School</option>
        {schools.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        name="busId"
        value={form.busId}
        onChange={handleChange}
      >
        <option value="">Assign Bus (Optional)</option>
        {buses.map(b => (
          <option key={b.id} value={b.id}>
            {b.busNumber}
          </option>
        ))}
      </select>

      <button onClick={submit}>Register</button>
    </div>
  );
}

export default StudentSignup;
