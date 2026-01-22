import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function SchoolSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    contact: "",
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
    if (!form.name || !form.email || !form.password || !form.agencyId) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await API.post("/schools/signup", form);
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "auto" }}>
      <h2>School Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="School Name"
        value={form.name}
        onChange={handleChange}
      />

      <textarea
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
      />

      <input
        type="text"
        name="contact"
        placeholder="Contact Number"
        value={form.contact}
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
        {agencies.map(agency => (
          <option key={agency.id} value={agency.id}>
            {agency.name}
          </option>
        ))}
      </select>

      <button onClick={submit}>Register</button>
    </div>
  );
}

export default SchoolSignup;
