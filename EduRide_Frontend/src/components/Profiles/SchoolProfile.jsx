// SchoolProfile.jsx
import { FaSchool, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

function SchoolProfile({ user }) {
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
          <FaSchool className="text-green-600 text-xl" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            School
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
            <FaEnvelope className="text-blue-600 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
            <FaPhone className="text-green-600 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <p className="text-gray-900 font-medium">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-red-100 flex items-center justify-center">
            <FaMapMarkerAlt className="text-red-600 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Address</p>
            <p className="text-gray-900 font-medium">{user.address || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolProfile;