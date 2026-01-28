import StudentProfile from "./StudentProfile";
import SchoolProfile from "./SchoolProfile";
import AgencyProfile from "./AgencyProfile";
import DriverProfile from "./DriverProfile";
import HelperProfile from "./HelperProfile";

function ProfileModal({ onClose }) {
  const role = localStorage.getItem("role")?.toLowerCase();
  const user = JSON.parse(localStorage.getItem("user"));

  const renderProfile = () => {
    switch (role) {
      case "student":
        return <StudentProfile user={user} />;
      case "school":
        return <SchoolProfile user={user} />;
      case "agency":
        return <AgencyProfile user={user} />;
      case "driver":
        return <DriverProfile user={user} />;
      case "helper":
      case "bus_helper":
        return <HelperProfile user={user} />;
      default:
        return <p>No profile available</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          My Profile
        </h2>

        {renderProfile()}
      </div>
    </div>
  );
}

export default ProfileModal;
