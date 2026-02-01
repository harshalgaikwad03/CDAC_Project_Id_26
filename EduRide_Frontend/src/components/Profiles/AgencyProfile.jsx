import { FaBuilding, FaEnvelope, FaPhone, FaUserTie } from "react-icons/fa";

function AgencyProfile({ user }) {
  if (!user) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
          <FaBuilding className="text-purple-600 text-xl" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
          <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
            Agency
          </span>
        </div>
      </div>

      {/* Contact Info */}
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
            <p className="text-gray-900 font-medium">{user.phone || "Not provided"}</p>
          </div>
        </div>

        {/* Additional fields if available */}
        {user.ownerName && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center">
              <FaUserTie className="text-amber-600 text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Owner</p>
              <p className="text-gray-900 font-medium">{user.ownerName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Simple divider */}
      <div className="pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Agency profile • EduRide
        </p>
      </div>
    </div>
  );
}

export default AgencyProfile;