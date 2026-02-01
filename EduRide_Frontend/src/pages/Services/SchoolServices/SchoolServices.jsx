// src/pages/Services/SchoolServices/SchoolServices.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SchoolServices() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
        School Transport Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 1. Student List */}
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
            Student List
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            View all students registered with your school
          </p>
          <button
            onClick={() => navigate('/school/services/students')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            View Students
          </button>
        </div>

        {/* 2. Bus Helper List */}
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Bus Helper List
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Manage bus helpers assigned to your school
          </p>
          <button
            onClick={() => navigate('/school/services/bus-helpers')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            View Helpers
          </button>
        </div>

        {/* 3. Today's Present Students */}
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4 text-center">
            Today's Present Students
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Students marked present today
          </p>
          <button
            onClick={() => navigate('/school/services/today-present')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            View Present
          </button>
        </div>

        {/* 4. Today's Absent Students */}
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-semibold text-red-700 mb-4 text-center">
            Today's Absent Students
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Students not marked present today
          </p>
          <button
            onClick={() => navigate('/school/services/today-absent')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            View Absent
          </button>
        </div>

        {/* 5. Bus Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">
            Bus Details
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            View buses assigned to your school & assign helpers
          </p>
          <button
            onClick={() => navigate('/school/services/buses')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            Manage Buses
          </button>
        </div>


        {/* 6. Edit School Profile */}
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-semibold text-orange-700 mb-4 text-center">
            Edit School Profile
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Update your school information
          </p>
          <button
            onClick={() => navigate('/school/services/edit')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            Edit School
          </button>
        </div>
      </div>
    </div>
  );
}

export default SchoolServices;