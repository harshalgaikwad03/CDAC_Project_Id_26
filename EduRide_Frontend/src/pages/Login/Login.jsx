// src/pages/Login/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      if (!res.data?.token) {
        throw new Error("No token received");
      }

      localStorage.setItem("token", res.data.token);

      const userData = {
        id: res.data.id,
        name: res.data.name || "User",
        email: res.data.email || email,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", (res.data.role || "").toLowerCase().trim());

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login to EduRide
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 px-6 font-medium rounded-lg text-white transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;