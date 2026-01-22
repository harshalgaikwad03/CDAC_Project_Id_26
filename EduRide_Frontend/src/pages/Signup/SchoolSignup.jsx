import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function SchoolSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    address: "",
    agencyId: ""
  });

  const [agencies, setAgencies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/agencies").then(res => setAgencies(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.contact || !form.email || !form.password || !form.agencyId) {
      setError("All required fields must be filled");
      return;
    }

    try {
      await API.post("/schools/signup", {
        name: form.name,
        phone: form.contact,
        email: form.email,
        password: form.password,
        address: form.address,
        agency: { id: form.agencyId }
      });
      navigate("/login");
    } catch {
      setError("School registration failed");
    }
  };

  return (
    <div>
      <h2>School Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input name="name" placeholder="School Name" onChange={handleChange} />
      <input name="contact" placeholder="Contact" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <textarea name="address" placeholder="Address" onChange={handleChange} />

      <select name="agencyId" onChange={handleChange}>
        <option value="">Select Agency</option>
        {agencies.map(a => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <button onClick={submit}>Register</button>
    </div>
  );
}

export default SchoolSignup;
