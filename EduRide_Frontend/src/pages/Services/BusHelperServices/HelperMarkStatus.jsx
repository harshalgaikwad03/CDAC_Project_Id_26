import React, { useEffect, useState } from "react";
import API from "../../../services/api";

const STATUS_OPTIONS = ["PENDING", "PICKED", "DROPPED"];

function HelperMarkStatus() {
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Fetch students WITH today's status from DB
  const fetchStudents = async () => {
    try {
      const res = await API.get("/helpers/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(res.data);

      // ✅ Initialize radio states from DB
      const initialStatus = {};
      res.data.forEach((s) => {
        initialStatus[s.id] = s.pickupStatus || "PENDING";
      });

      setStatusMap(initialStatus);
    } catch (err) {
      console.error(err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Optimistic update + safe backend call
  const updateStatus = async (studentId, pickupStatus) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: pickupStatus,
    }));

    try {
      await API.post(
        "/helpers/student-status",
        { studentId, pickupStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Please retry.");
    }
  };

  // ───────── UI STATES ─────────

  if (loading) {
    return <div className="text-center py-20">Loading students...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Mark Student Status
      </h2>

      {students.length === 0 && (
        <p className="text-center text-gray-600">
          No students assigned to your bus
        </p>
      )}

      {students.map((s) => (
        <div
          key={s.id}
          className="bg-white p-4 mb-4 rounded shadow"
        >
          {/* ─── Student Details ─── */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{s.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Roll No</p>
              <p className="font-medium">{s.rollNo}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Class</p>
              <p className="font-medium">{s.className}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{s.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Bus No</p>
              <p className="font-medium">{s.busNumber || "N/A"}</p>
            </div>
          </div>

          {/* ─── Status Radios ─── */}
          <div className="flex gap-6">
            {STATUS_OPTIONS.map((st) => (
              <label
                key={st}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`status-${s.id}`}
                  checked={statusMap[s.id] === st}
                  onChange={() => updateStatus(s.id, st)}
                />
                <span className="text-sm font-medium">{st}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HelperMarkStatus;
