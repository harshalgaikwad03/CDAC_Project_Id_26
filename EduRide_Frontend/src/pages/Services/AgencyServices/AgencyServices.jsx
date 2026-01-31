// src/pages/Services/AgencyServices/AgencyServices.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function AgencyServices() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Agency Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Add Bus Block */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-100">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-6 text-blue-800">
              Add New Bus
            </h3>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Register a new bus with number, capacity, and optionally assign it to a school right away.
            </p>
            <button
              onClick={() => navigate("/agency/services/add-bus")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-4 px-10 rounded-xl shadow-md transition transform hover:-translate-y-1"
            >
              Add Bus Now
            </button>
          </div>
        </div>

        {/* Bus Details Block */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-100">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-6 text-green-800">
              View & Manage Buses
            </h3>
            <p className="text-gray-700 mb-8 leading-relaxed">
              See all buses under your agency, edit details, change school assignments, and more.
            </p>
            <button
              onClick={() => navigate("/agency/services/buses")}
              className="bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-4 px-10 rounded-xl shadow-md transition transform hover:-translate-y-1"
            >
              View All Buses
            </button>
          </div>
        </div>
      </div>

      {/* Driver Management Block */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-6 text-purple-800">
            Manage Drivers
          </h3>
          <p className="text-gray-700 mb-8 leading-relaxed">
            View all drivers under your agency, edit driver details, or remove drivers when needed.
          </p>
          <button
            onClick={() => navigate("/agency/services/drivers")}
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium py-4 px-10 rounded-xl shadow-md transition transform hover:-translate-y-1"
          >
            View Drivers
          </button>
        </div>
      </div>

    </div>
  );
}

export default AgencyServices;