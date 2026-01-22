import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function DriverSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    email: "",
    password: "",
    agencyId: ""
  });

  const [agencies, setAgencies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/agencies")
      .then(res => setAgencies(res.data))
      .catch(() => setError("Failed to load agencies"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.licenseNumber ||
      !form.email ||
      !form.password ||
      !form.agencyId
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await API.post("/drivers/signup", form);
      navigate("/login");
    } catch (err) {
      setError("Driver registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "auto" }}>
      <h2>Driver Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Driver Name"
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
        type="text"
        name="licenseNumber"
        placeholder="License Number"
        value={form.licenseNumber}
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
        name="agencyId"
        value={form.agencyId}
        onChange={handleChange}
      >
        <option value="">Select Agency</option>
        {agencies.map(a => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <button onClick={submit}>Register</button>
    </div>
  );
}

export default DriverSignup;
