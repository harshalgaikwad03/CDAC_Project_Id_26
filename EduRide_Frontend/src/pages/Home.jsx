import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  // 🔴 NOT LOGGED IN
  if (!userData) {
    return (
      
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to EduRide</h1>

        <button
          className="bg-blue-600 text-white px-4 py-2 mr-4"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
      </div>
    );
  }

  // 🟢 LOGGED IN
  const user = JSON.parse(userData);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">EduRide Dashboard</h1>

      <h3 className="text-lg mb-4">
        Role: <b>{role?.toUpperCase()}</b>
      </h3>

      <div className="border p-4 inline-block text-left mb-4">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>

      <br />

      <button
        className="bg-red-600 text-white px-4 py-2"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
