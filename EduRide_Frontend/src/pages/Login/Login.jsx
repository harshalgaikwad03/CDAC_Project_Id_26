import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Login() {
  const [role, setRole] = useState("agency");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const endpoint =
      role === "agency" ? "/agencies/login" : "/schools/login";

    const res = await API.post(endpoint, { email, password });

    if (res.data && res.data.id) {
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("role", role);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <select
        className="border p-2 w-full mb-3"
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="agency">Agency</option>
        <option value="school">School</option>
      </select>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 w-full"
        onClick={login}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
