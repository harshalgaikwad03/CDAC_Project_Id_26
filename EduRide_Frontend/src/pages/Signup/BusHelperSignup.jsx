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
    if (!form.name || !form.phone || !form.email || !form.password || !form.schoolId) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await API.post("/bus-helpers/signup", form);
      navigate("/login");
    } catch (err) {
      setError("Bus Helper registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "auto" }}>
      <h2>Bus Helper Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Helper Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
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

export default BusHelperSignup;
