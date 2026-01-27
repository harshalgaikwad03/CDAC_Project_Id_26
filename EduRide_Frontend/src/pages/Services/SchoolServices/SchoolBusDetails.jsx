// src/pages/Services/SchoolServices/SchoolBusDetails.jsx
import React, { useState, useEffect } from 'react';
import API from '../../../services/api';

function SchoolBusDetails() {
  const [buses, setBuses] = useState([]);
  const [helpers, setHelpers] = useState([]); // unassigned helpers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get school ID from localStorage (stored during login)
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const schoolId = user.id;

        if (!schoolId) {
          throw new Error("School ID not found. Please login again.");
        }

        // Get buses assigned to this school
        const busesRes = await API.get(`/buses/school/${schoolId}`);
        setBuses(busesRes.data);

        // Get helpers (you can filter unassigned in backend or here)
        // For now fetching all - you can add ?unassigned=true later
        const helpersRes = await API.get(`/helpers/school/${schoolId}`);
        setHelpers(helpersRes.data.filter(h => !h.assignedBus)); // simple client filter

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const assignHelper = async (busId, helperId) => {
    if (!helperId) return;
    try {
      await API.put(`/buses/${busId}/assign-helper/${helperId}`);
      // Refresh buses list
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const schoolId = user.id;
      const res = await API.get(`/buses/school/${schoolId}`);
      setBuses(res.data);
      alert('Helper assigned successfully!');
    } catch (err) {
      alert('Failed to assign helper: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">Loading buses...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">
        Buses Assigned to Your School
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.map((bus) => (
          <div key={bus.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">Bus: {bus.busNumber}</h3>
            <p className="mb-2">Capacity: {bus.capacity}</p>
            <p className="mb-4">
              Driver: {bus.driver?.name || 'Not Assigned'}
            </p>
            <p className="mb-4 font-medium">
              Current Helper: {bus.busHelper?.name || 'None'}
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign / Change Helper
              </label>
              <select
                onChange={(e) => assignHelper(bus.id, e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="">-- Select Helper --</option>
                {helpers.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.phone || 'No phone'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {buses.length === 0 && (
        <p className="text-center text-gray-600 text-lg mt-12">
          No buses assigned to your school yet.
        </p>
      )}
    </div>
  );
}

export default SchoolBusDetails;