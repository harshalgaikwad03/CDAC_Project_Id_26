// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role")?.toLowerCase()?.trim();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (role) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome back to EduRide</h1>
        <p className="text-xl text-gray-700 mb-10">
          Logged in as <strong className="uppercase">{role}</strong>
        </p>

        <div className="space-x-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700"
          >
            Go to My Dashboard
          </button>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to EduRide</h1>
      <p className="text-xl text-gray-600 mb-10">
        Safe & Smart School Transportation Solution
      </p>

      <div className="space-x-6">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Home;