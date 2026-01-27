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

        // Correct: no extra /api/ (baseURL adds it)
        const res = await API.get(`/helpers/school/${schoolId}`);
        setHelpers(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load helpers");
      } finally {
        setLoading(false);
      }
    };

    fetchHelpers();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Bus Helpers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {helpers.map((helper) => (
          <div key={helper.id} className="p-6 bg-white shadow rounded">
            <h3 className="font-semibold text-lg">{helper.name}</h3>
            <p>Phone: {helper.phone || "-"}</p>
            <p>Bus: {helper.assignedBus?.busNumber || "Not Assigned"}</p>

            <button
              onClick={() =>
                navigate(`/school/services/bus-helpers/edit/${helper.id}`)
              }
              className="mt-4 w-full bg-yellow-500 text-white py-2 rounded"
            >
              Edit
            </button>
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