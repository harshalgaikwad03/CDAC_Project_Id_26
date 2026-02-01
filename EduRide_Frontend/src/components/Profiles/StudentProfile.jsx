// StudentProfile.jsx
import { FaUserGraduate, FaEnvelope, FaPhone, FaSchool, FaBook, FaHashtag } from "react-icons/fa";

function StudentProfile({ user }) {
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
          <FaUserGraduate className="text-blue-600 text-xl" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
            Student
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
            <p className="text-gray-900 font-medium">{user.phone || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center">
            <FaBook className="text-purple-600 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Class</p>
            <p className="text-gray-900 font-medium">{user.className || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center">
            <FaHashtag className="text-amber-600 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Roll No</p>
            <p className="text-gray-900 font-medium">{user.rollNo || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
            <FaSchool className="text-green-600 text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">School</p>
            <p className="text-gray-900 font-medium">{user.schoolName || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;