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

  useEffect(() => {
    API.get("/schools").then(res => setSchools(res.data));
    API.get("/buses").then(res => setBuses(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    await API.post("/helpers/signup", {
      name: form.name,
      phone: form.phone,
      email: form.email,
      password: form.password,
      school: { id: form.schoolId },
      assignedBus: form.busId ? { id: form.busId } : null
    });
    navigate("/login");
  };

  return (
    <div>
      <h2>Bus Helper Signup</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />

      <select name="schoolId" onChange={handleChange}>
        <option value="">Select School</option>
        {schools.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <select name="busId" onChange={handleChange}>
        <option value="">Assign Bus (Optional)</option>
        {buses.map(b => (
          <option key={b.id} value={b.id}>{b.busNumber}</option>
        ))}
      </select>

      <button onClick={submit}>Register</button>
    </div>
  );
}

export default BusHelperSignup;
