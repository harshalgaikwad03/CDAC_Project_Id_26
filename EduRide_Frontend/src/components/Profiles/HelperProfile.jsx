// HelperProfile.jsx
import { FaUserTie, FaEnvelope, FaPhone, FaBus } from "react-icons/fa";

function HelperProfile({ user }) {
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
          <FaUserTie className="text-cyan-600 text-xl" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{user.name || "Helper"}</h3>
          <span className="px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-medium">
            Bus Helper
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
            <p className="text-gray-900 font-medium">{user.email || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
            <FaPhone className="text-green-600 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <p className="text-gray-900 font-medium">{user.phone || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center">
            <FaBus className="text-amber-600 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Assigned Bus</p>
            <p className="text-gray-900 font-medium">{user.busNumber || "Not Assigned"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelperProfile;