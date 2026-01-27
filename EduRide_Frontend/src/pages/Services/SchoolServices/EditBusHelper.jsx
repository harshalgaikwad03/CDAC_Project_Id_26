import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../services/api';

function EditBusHelper() {
  const { helperId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    assignedBusId: '',
  });

  const [helperData, setHelperData] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const schoolId = user.id;

        if (!schoolId) throw new Error("Please login again");

        console.log(`Fetching helper ${helperId} for school ${schoolId}`);

        const helperRes = await API.get(`/helpers/${helperId}`);
        const helper = helperRes.data;

        if (helper.school?.id && helper.school.id !== schoolId) {
          throw new Error("You are not authorized to edit this helper");
        }

        setHelperData(helper);
        setFormData({
          name: helper.name || '',
          phone: helper.phone || '',
          assignedBusId: helper.assignedBus?.id ? String(helper.assignedBus.id) : '', // string for <select>
        });

        const busesRes = await API.get(`/buses/school/${schoolId}`);
        setBuses(busesRes.data || []);

        console.log("Helper loaded:", helper);
      } catch (err) {
        console.error("Fetch error:", err.response || err);
        setError(err.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [helperId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone || null,
        assignedBusId: formData.assignedBusId ? Number(formData.assignedBusId) : null, // ← send number or null
        email: helperData?.email,
      };

      await API.put(`/helpers/${helperId}`, payload);
      alert('Helper updated successfully!');
      navigate('/school/services/bus-helpers');
    } catch (err) {
      console.error("Update error:", err.response || err);
      setError(err.response?.data?.message || 'Failed to update helper');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Edit Bus Helper
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Assigned Bus</label>
          <select
            name="assignedBusId"
            value={formData.assignedBusId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Not Assigned</option>
            {buses.map(bus => (
              <option key={bus.id} value={bus.id}>
                Bus {bus.busNumber} (Capacity: {bus.capacity})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-4 px-6 text-white font-medium rounded-xl transition-all transform ${
            saving
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-xl"
          }`}
        >
          {saving ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}

export default EditBusHelper;