import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function SchoolSignup() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    await API.post("/schools/signup", form);
    navigate("/login");
  };

  return (
    <div>
      <h2>School Signup</h2>
      <input placeholder="School Name" onChange={e => setForm({...form, name:e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
      <input placeholder="Password" type="password"
             onChange={e => setForm({...form, password:e.target.value})} />
      <button onClick={submit}>Register</button>
    </div>
  );
}

export default SchoolSignup;
