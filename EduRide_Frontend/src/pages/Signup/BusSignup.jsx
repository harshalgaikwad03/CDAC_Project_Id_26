import { useEffect, useState } from "react";
import API from "../../services/api";

function BusSignup() {
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

  useEffect(() => {
    API.get("/agencies").then(res => setAgencies(res.data));
    API.get("/schools").then(res => setSchools(res.data));
    API.get("/drivers").then(res => setDrivers(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    await API.post("/buses", {
      busNumber: form.busNumber,
      capacity: form.capacity,
      agency: { id: form.agencyId },
      school: { id: form.schoolId },
      driver: { id: form.driverId }
    });
  };

  return (
    <div>
      <h2>Bus Registration</h2>

      <input name="busNumber" placeholder="Bus Number" onChange={handleChange} />
      <input name="capacity" placeholder="Capacity" onChange={handleChange} />

      <select name="agencyId" onChange={handleChange}>
        <option value="">Select Agency</option>
        {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>

      <select name="schoolId" onChange={handleChange}>
        <option value="">Select School</option>
        {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <select name="driverId" onChange={handleChange}>
        <option value="">Select Driver</option>
        {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <button onClick={submit}>Register</button>
    </div>
  );
}

export default BusSignup;
