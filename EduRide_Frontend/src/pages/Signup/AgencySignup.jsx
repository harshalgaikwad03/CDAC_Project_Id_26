import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function AgencySignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    address: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");

    if (!form.name || !form.contact || !form.email || !form.password) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await API.post("/agencies/signup", {
        name: form.name,
        phone: form.contact,
        email: form.email,
        password: form.password,
        address: form.address
      });
      navigate("/login");
    } catch {
      setError("Agency registration failed");
    }
  };

  return (
    <div>
      <h2>Agency Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input name="name" placeholder="Agency Name" onChange={handleChange} />
      <input name="contact" placeholder="Contact Number" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <textarea name="address" placeholder="Address" onChange={handleChange} />

      <button onClick={submit}>Register</button>
    </div>
  );
}

export default AgencySignup;
