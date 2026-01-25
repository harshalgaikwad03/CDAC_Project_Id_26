import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const role = localStorage.getItem("role")?.toLowerCase();

  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold">
            EduRide
          </Link>

          <div className="flex gap-6">
            <Link to="/" className="hover:underline">
              Home
            </Link>

            {role === "agency" && (
              <Link to="/agency/services" className="hover:underline">
                Services
              </Link>
            )}

            {role === "school" && (
              <Link to="/school/services" className="hover:underline">
                Services
              </Link>
            )}

            <Link to="/about" className="hover:underline">
              About
            </Link>
            <Link to="/help" className="hover:underline">
              Help
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-blue-700 px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}