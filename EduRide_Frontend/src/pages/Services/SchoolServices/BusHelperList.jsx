import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

function BusHelperList() {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const schoolId = user.id;

        if (!schoolId) {
          throw new Error("Please login again");
        }

        const res = await API.get(`/helpers/school/${schoolId}`);
        setHelpers(res.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load helpers");
      } finally {
        setLoading(false);
      }
    };

    fetchHelpers();
  }, []);

  // 🗑️ Delete helper
  const handleDelete = async (helperId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus helper?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/helpers/${helperId}`);
      setHelpers((prev) => prev.filter((h) => h.id !== helperId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete helper");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Bus Helpers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {helpers.map((helper) => (
          <div key={helper.id} className="p-6 bg-white shadow rounded">
            <h3 className="font-semibold text-lg">{helper.name}</h3>

            {/* ✅ Extra information */}
            <p className="text-sm text-gray-700">
              <b>Email:</b> {helper.email}
            </p>
            <p className="text-sm text-gray-700">
              <b>Phone:</b> {helper.phone || "-"}
            </p>
            <p className="text-sm text-gray-700">
              <b>Bus:</b> {helper.busNumber || "Not Assigned"}
            </p>

            {/* ✅ Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() =>
                  navigate(`/school/services/bus-helpers/edit/${helper.id}`)
                }
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(helper.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {helpers.length === 0 && (
        <p className="text-center mt-10">No helpers found</p>
      )}
    </div>
  );
}

export default BusHelperList;
