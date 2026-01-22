import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function DriverSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    licenseNumber: "",
    agencyId: ""
  });

  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    API.get("/agencies").then(res => setAgencies(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    await API.post("/drivers/signup", {
      name: form.name,
      phone: form.phone,
      email: form.email,
      password: form.password,
      licenseNumber: form.licenseNumber,
      agency: { id: form.agencyId }
    });
    navigate("/login");
  };

  return (
    <div>
      <h2>Driver Signup</h2>

      <input name="name" placeholder="Driver Name" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <input name="licenseNumber" placeholder="License Number" onChange={handleChange} />

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

export default DriverSignup;
