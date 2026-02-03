// src/pages/Services/SchoolServices/SchoolServices.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaUserFriends,
  FaUserCheck,
  FaUserTimes,
  FaBus,
  FaSchool,
  FaArrowRight,
  FaShieldAlt,
  FaUsers,
  FaClipboardCheck,
  FaCog
} from "react-icons/fa";

function SchoolServices() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Student List",
      desc: "View and manage all students registered under your school.",
      icon: <FaUserGraduate className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50/80 to-cyan-50/40",
      borderColor: "border-blue-200",
      btnColor: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
      action: () => navigate("/school/services/students"),
      btnText: "View Students"
    },
    {
      title: "Bus Helper List",
      desc: "Manage bus helpers assigned to school buses.",
      icon: <FaUserFriends className="text-2xl" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50/80 to-emerald-50/40",
      borderColor: "border-green-200",
      btnColor: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      action: () => navigate("/school/services/bus-helpers"),
      btnText: "View Helpers"
    },
    {
      title: "Today's Present Students",
      desc: "Check students marked present for today's bus travel.",
      icon: <FaUserCheck className="text-2xl" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50/80 to-pink-50/40",
      borderColor: "border-purple-200",
      btnColor: "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      action: () => navigate("/school/services/today-present"),
      btnText: "View Present"
    },
    {
      title: "Today's Absent Students",
      desc: "Review students who were absent today.",
      icon: <FaUserTimes className="text-2xl" />,
      color: "from-red-500 to-rose-500",
      bgColor: "from-red-50/80 to-rose-50/40",
      borderColor: "border-red-200",
      btnColor: "from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700",
      action: () => navigate("/school/services/today-absent"),
      btnText: "View Absent"
    },
    {
      title: "Bus Details",
      desc: "View buses assigned to your school and manage helpers.",
      icon: <FaBus className="text-2xl" />,
      color: "from-indigo-500 to-violet-500",
      bgColor: "from-indigo-50/80 to-violet-50/40",
      borderColor: "border-indigo-200",
      btnColor: "from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700",
      action: () => navigate("/school/services/buses"),
      btnText: "Manage Buses"
    },
    {
      title: "Edit School Profile",
      desc: "Update school details, contact info, and settings.",
      icon: <FaSchool className="text-2xl" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "from-amber-50/80 to-orange-50/40",
      borderColor: "border-amber-200",
      btnColor: "from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
      action: () => navigate("/school/services/edit"),
      btnText: "Edit School"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-16">
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Manage students, buses, helpers, and daily attendance records
            for your school transportation system.
          </p>
          
          {/* Stats/Info Bar */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <FaUsers className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">Student Management</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <FaClipboardCheck className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Attendance Tracking</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <FaCog className="text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Transport Administration</span>
            </div>
          </div>
        </div>

        {/* ===== SERVICES GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              desc={service.desc}
              icon={service.icon}
              color={service.color}
              bgColor={service.bgColor}
              borderColor={service.borderColor}
              btnColor={service.btnColor}
              action={service.action}
              btnText={service.btnText}
            />
          ))}
        </div>

        

        {/* ===== FOOTER ===== */}
        {/* <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>School Administration Panel • EduRide</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}

/* ---------- REUSABLE SERVICE CARD ---------- */
function ServiceCard({ title, desc, icon, color, bgColor, borderColor, btnColor, action, btnText }) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}>
      <div className="h-2 bg-gradient-to-r ${color}"></div>
      <div className="p-8">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mb-6`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-700 mb-8 leading-relaxed">
            {desc}
          </p>
          
          {/* Action Button */}
          <button
            onClick={action}
            className={`group flex items-center justify-center gap-3 bg-gradient-to-r ${btnColor} text-white px-6 py-3.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 w-full`}
          >
            <span>{btnText}</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SchoolServices;