import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function BusSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    busNumber: "",
    capacity: "",
    agencyId: "",
    schoolId: "",
    driverId: ""
  });

  const [agencies, setAgencies] = useState([]);
  const [schools, setSchools] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/agencies").then(res => setAgencies(res.data));
    API.get("/schools").then(res => setSchools(res.data));
    API.get("/drivers/available").then(res => setDrivers(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.busNumber || !form.capacity || !form.agencyId || !form.schoolId) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await API.post("/buses/register", form);
      navigate("/dashboard");
    } catch (err) {
      setError("Bus registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Bus Registration</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        name="busNumber"
        placeholder="Bus Number"
        value={form.busNumber}
        onChange={handleChange}
      />

      <input
        type="number"
        name="capacity"
        placeholder="Capacity"
        value={form.capacity}
        onChange={handleChange}
      />

      <select name="agencyId" value={form.agencyId} onChange={handleChange}>
        <option value="">Select Agency</option>
        {agencies.map(a => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select name="schoolId" value={form.schoolId} onChange={handleChange}>
        <option value="">Select School</option>
        {schools.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <select name="driverId" value={form.driverId} onChange={handleChange}>
        <option value="">Assign Driver (Optional)</option>
        {drivers.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>

      <button onClick={submit}>Register Bus</button>
    </div>
  );
}

export default BusSignup;
