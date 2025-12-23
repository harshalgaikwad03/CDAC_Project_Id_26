import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function AgencySignup() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    await API.post("/agencies/signup", form);
    navigate("/login");
  };

  return (
    <div>
      <h2>Agency Signup</h2>
      <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
      <input placeholder="Password" type="password"
             onChange={e => setForm({...form, password:e.target.value})} />
      <button onClick={submit}>Register</button>
    </div>
  );
}

export default AgencySignup;
