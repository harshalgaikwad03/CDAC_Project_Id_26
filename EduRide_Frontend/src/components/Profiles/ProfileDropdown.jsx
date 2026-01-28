import { useEffect, useState } from "react";
import API from "../../services/api";
import StudentProfile from "./StudentProfile";
import SchoolProfile from "./SchoolProfile";
import AgencyProfile from "./AgencyProfile";
import DriverProfile from "./DriverProfile";
import HelperProfile from "./HelperProfile";
import { useNavigate } from "react-router-dom";

function ProfileDropdown() {
  const role = localStorage.getItem("role")?.toLowerCase()?.replace("role_", "");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
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
          console.warn("Unknown role:", role);
          return;
      }

      // ✅ NO headers here
      const res = await API.get(url);
      setProfile(res.data);

    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!profile) {
    return (
      <div className="absolute right-4 top-16 bg-white p-4 rounded shadow">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-xl border z-50">
      <div className="p-4">
        <h3 className="text-lg font-bold mb-3">My Profile</h3>

        {role === "student" && <StudentProfile user={profile} />}
        {role === "school" && <SchoolProfile user={profile} />}
        {role === "agency" && <AgencyProfile user={profile} />}
        {role === "driver" && <DriverProfile user={profile} />}
        {(role === "helper" || role === "bus_helper") && (
          <HelperProfile user={profile} />
        )}
      </div>

      <div className="border-t p-3">
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileDropdown;
