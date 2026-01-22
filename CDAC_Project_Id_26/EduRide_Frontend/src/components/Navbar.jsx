import { Link } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role"); //Get Role
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/" className="font-semibold hover:underline">
          Home
        </Link>

        {/* Services only for Agency */}
        {role === "agency" && (
          <Link to="/agency/services" className="hover:underline">
            Services
          </Link>
        )}

        {/* Services only for School */}
        {role === "school" && (
          <Link to="/school/services">Services</Link>
        )}
        <Link to="/about" className="hover:underline">
          About
        </Link>
        <Link to="/help" className="hover:underline">
          HelpMe
        </Link>
      </div>
      <div className="flex gap-4">
        {user ? (
          <>
            <span className="font-semibold">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              SignUp
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
