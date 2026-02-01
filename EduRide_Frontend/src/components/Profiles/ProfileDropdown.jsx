import { useEffect, useState } from "react";
import API from "../../services/api";
import StudentProfile from "./StudentProfile";
import SchoolProfile from "./SchoolProfile";
import AgencyProfile from "./AgencyProfile";
import DriverProfile from "./DriverProfile";
import HelperProfile from "./HelperProfile";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaSchool, 
  FaBuilding, 
  FaBus, 
  FaUserTie, 
  FaSignOutAlt, 
  FaSpinner,
  FaUserCircle,
  FaUserShield
} from "react-icons/fa";

function ProfileDropdown() {
  const role = localStorage
    .getItem("role")
    ?.toLowerCase()
    ?.replace("role_", "");

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(true); // Add state to control dropdown visibility
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      let url = "";

      switch (role) {
        case "student":
          url = "/students/me";
          break;
        case "school":
          url = "/schools/me";
          break;
        case "agency":
          url = "/agencies/me";
          break;
        case "driver":
          url = "/drivers/me";
          break;
        case "helper":
        case "bus_helper":
          url = "/helpers/me";
          break;
        default:
          return;
      }

      const res = await API.get(url);
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
  // Clear auth
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  // Redirect to Home
  navigate("/", { replace: true });
};


  const getRoleIcon = () => {
    switch (role) {
      case "student": return <FaUser className="text-blue-500" />;
      case "school": return <FaSchool className="text-green-500" />;
      case "agency": return <FaBuilding className="text-purple-500" />;
      case "driver": return <FaBus className="text-amber-500" />;
      case "helper": return <FaUserTie className="text-cyan-500" />;
      default: return <FaUserCircle className="text-gray-500" />;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case "student": return "border-blue-200 bg-blue-50";
      case "school": return "border-green-200 bg-green-50";
      case "agency": return "border-purple-200 bg-purple-50";
      case "driver": return "border-amber-200 bg-amber-50";
      case "helper": return "border-cyan-200 bg-cyan-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  // Don't render if dropdown should be hidden
  if (!showDropdown) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mb-4">
                <FaSpinner className="text-blue-500 text-2xl animate-spin" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Profile</h3>
            <p className="text-sm text-gray-500">Please wait a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <FaUserCircle className="text-red-500 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Profile Unavailable</h3>
            <p className="text-sm text-gray-500 text-center">Unable to load profile data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className={`p-5 border-b ${getRoleColor()}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-white flex items-center justify-center border border-gray-200">
            <div className="text-2xl">
              {getRoleIcon()}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FaUserShield className="text-gray-400" />
              My Profile
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                role === "student" ? "bg-blue-100 text-blue-700" :
                role === "school" ? "bg-green-100 text-green-700" :
                role === "agency" ? "bg-purple-100 text-purple-700" :
                role === "driver" ? "bg-amber-100 text-amber-700" :
                "bg-cyan-100 text-cyan-700"
              }`}>
                {role?.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-5">
          {role === "student" && <StudentProfile user={profile} />}
          {role === "school" && <SchoolProfile user={profile} />}
          {role === "agency" && <AgencyProfile user={profile} />}
          {role === "driver" && <DriverProfile user={profile} />}
          {(role === "helper" || role === "bus_helper") && (
            <HelperProfile user={profile} />
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-white">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          Click to securely log out of your account
        </p>
      </div>
    </div>
  );
}

export default ProfileDropdown;