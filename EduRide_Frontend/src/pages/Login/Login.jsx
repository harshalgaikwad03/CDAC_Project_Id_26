import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Login() {
  const [role, setRole] = useState("agency");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    setError("");

    const roleEndpoints = {
      agency: "/agencies/login",
      school: "/schools/login",
      driver: "/drivers/login",
      busHelper: "/bus-helpers/login",
      student: "/students/login"
    };

    try {
      const endpoint = roleEndpoints[role];

      const res = await API.post(endpoint, {
        email,
        password
      });

      if (res.data && res.data.id) {
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("role", role);
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <select
        className="border p-2 w-full mb-3"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="agency">Agency</option>
        <option value="school">School</option>
        <option value="driver">Driver</option>
        <option value="busHelper">Bus Helper</option>
        <option value="student">Student</option>
      </select>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 w-full rounded"
        onClick={login}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
