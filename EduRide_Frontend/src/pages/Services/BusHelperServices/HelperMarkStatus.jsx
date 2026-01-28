// src/pages/Services/BusHelperServices/HelperMarkStatus.jsx
import React, { useEffect, useState } from "react";
import API from "../../../services/api";

const STATUS_OPTIONS = ["PENDING", "PICKED", "DROPPED"];

function HelperMarkStatus() {
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await API.get("/helpers/students", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setStudents(res.data);

    res.data.forEach((s) => fetchTodayStatus(s.id));
  };

  const fetchTodayStatus = async (studentId) => {
    try {
      const res = await API.get(`/student-status/today/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setStatusMap((prev) => ({
          ...prev,
          [studentId]: res.data.pickupStatus,
        }));
      }
    } catch {
      // No status found for today
    }
  };

  const updateStatus = async (studentId, pickupStatus) => {
    // optimistic UI update
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: pickupStatus,
    }));

    await API.post(
      "/helpers/student-status",
      { studentId, pickupStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Mark Student Status</h2>

      {students.map((s) => (
        <div
          key={s.id}
          className="bg-white p-4 mb-4 rounded shadow"
        >
          {/* Student Details */}
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
              <p className="font-medium">
                {s.assignedBus?.busNumber || "N/A"}
              </p>
            </div>
          </div>

          {/* Status Radios */}
          <div className="flex gap-6">
            {STATUS_OPTIONS.map((st) => (
              <label key={st} className="flex items-center gap-1">
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
