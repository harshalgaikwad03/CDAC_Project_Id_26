// src/pages/Services/AgencyServices/AgencyServices.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBus,
  FaSchool,
  FaUserTie,
  FaPlusCircle,
  FaCogs,
  FaArrowRight,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaRoute
} from "react-icons/fa";

function AgencyServices() {
  const navigate = useNavigate();

  const services = [
    {
      icon: <FaPlusCircle className="text-3xl" />,
      title: "Add New Bus",
      desc: "Register a new bus by entering bus number, capacity, and assigning it to a school for daily operations.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50/80 to-cyan-50/40",
      borderColor: "border-blue-200",
      btnColor: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
      actionText: "Add Bus",
      onClick: () => navigate("/agency/services/add-bus")
    },
    {
      icon: <FaBus className="text-3xl" />,
      title: "View & Manage Buses",
      desc: "View all buses under your agency, update bus details, assign or change school mappings, and manage availability.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50/80 to-emerald-50/40",
      borderColor: "border-green-200",
      btnColor: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      actionText: "View Buses",
      onClick: () => navigate("/agency/services/buses")
    },
    {
      icon: <FaUserTie className="text-3xl" />,
      title: "Manage Drivers",
      desc: "Add, update, or remove drivers. Ensure each driver is correctly assigned to a bus for safe transportation.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50/80 to-pink-50/40",
      borderColor: "border-purple-200",
      btnColor: "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      actionText: "View Drivers",
      onClick: () => navigate("/agency/services/drivers")
    },
    {
      icon: <FaSchool className="text-3xl" />,
      title: "Manage Schools",
      desc: "View all partner schools, check assigned buses, and monitor student counts under each school.",
      color: "from-amber-500 to-orange-500",
      bgColor: "from-amber-50/80 to-orange-50/40",
      borderColor: "border-amber-200",
      btnColor: "from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
      actionText: "View Schools",
      onClick: () => navigate("/agency/services/schools")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-16">
         
          <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Manage buses, drivers, and schools under your agency from one centralized control panel.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <FaRoute className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Fleet Management</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <FaUsers className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">Driver Management</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <FaShieldAlt className="text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Safety & Compliance</span>
            </div>
          </div>
        </div>

        {/* ===== SERVICES GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              desc={service.desc}
              color={service.color}
              bgColor={service.bgColor}
              borderColor={service.borderColor}
              btnColor={service.btnColor}
              actionText={service.actionText}
              onClick={service.onClick}
            />
          ))}
        </div>

        

        {/* ===== FOOTER NOTE ===== */}
        {/* <div className="text-center text-sm text-gray-500 mt-16 pt-8 border-t border-gray-100">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>Agency-level service management designed for efficiency, safety, and scalability</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>© {new Date().getFullYear()} EduRide</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}

/* ===== REUSABLE SERVICE CARD ===== */
function ServiceCard({ icon, title, desc, color, bgColor, borderColor, btnColor, actionText, onClick }) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-2xl shadow-lg border ${borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}>
      <div className="h-2 bg-gradient-to-r ${color}"></div>
      <div className="p-8">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mb-6`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h3>
          
          <p className="text-gray-700 mb-8 leading-relaxed">
            {desc}
          </p>
          
          <button
            onClick={onClick}
            className={`group flex items-center justify-center gap-3 bg-gradient-to-r ${btnColor} text-white px-8 py-3.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-xs`}
          >
            <span>{actionText}</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgencyServices;