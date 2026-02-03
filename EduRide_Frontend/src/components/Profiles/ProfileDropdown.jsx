import { useEffect, useState } from "react";
import API from "../../services/api";
import StudentProfile from "./StudentProfile";
import SchoolProfile from "./SchoolProfile";
import AgencyProfile from "./AgencyProfile";
import DriverProfile from "./DriverProfile";
import HelperProfile from "./HelperProfile";
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

function ProfileDropdown({ onLogout }) {
  const role = localStorage
    .getItem("role")
    ?.toLowerCase()
    ?.replace("role_", "");

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="w-80 bg-white rounded-xl shadow-2xl border border-gray-100">
        <div className="p-8 text-center">
          <FaSpinner className="mx-auto text-2xl text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`p-5 border-b ${getRoleColor()}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border">
            {getRoleIcon()}
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FaUserShield className="text-gray-400" />
              My Profile
            </h3>
            <span className="text-xs capitalize text-gray-600">
              {role?.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto p-5">
        {role === "student" && <StudentProfile user={profile} />}
        {role === "school" && <SchoolProfile user={profile} />}
        {role === "agency" && <AgencyProfile user={profile} />}
        {role === "driver" && <DriverProfile user={profile} />}
        {(role === "helper" || role === "bus_helper") && (
          <HelperProfile user={profile} />
        )}
      </div>

      {/* Logout */}
      {/* <div className="border-t p-4 bg-gray-50">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div> */}

      
    </div>
  );
}

export default ProfileDropdown;
