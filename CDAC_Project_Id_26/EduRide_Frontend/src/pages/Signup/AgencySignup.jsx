import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function AgencySignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Name, Email and Password are required");
      return;
    }

    try {
      await API.post("/agencies/signup", form);
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Email may already exist.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Agency Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Agency Name"
        value={form.name}
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

      <textarea
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <button onClick={submit}>Register</button>
    </div>
  );
}

export default AgencySignup;
