// src/pages/Services/SchoolServices/TodayPresentStudents.jsx
import React, { useState, useEffect } from "react";
import API from "../../../services/api";

function TodayPresentStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPresent = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const schoolId = user?.id;

        if (!schoolId) throw new Error("School ID not found. Please login again.");

        const res = await API.get(`/student-status/school/${schoolId}/today`);

        // Present = PICKED or DROPPED
        const present = res.data.filter(
          s => s.pickupStatus === "PICKED" || s.pickupStatus === "DROPPED"
        );

        setStudents(present.map(s => s.student));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load present students");
      } finally {
        setLoading(false);
      }
    };

    fetchPresent();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl">Loading present students...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">
        Today's Present Students
      </h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No students marked present today.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Roll No</th>
                <th className="px-6 py-4 text-left">Class</th>
                <th className="px-6 py-4 text-left">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map(s => (
                <tr key={s.id}>
                  <td className="px-6 py-4">{s.name}</td>
                  <td className="px-6 py-4">{s.rollNo || "-"}</td>
                  <td className="px-6 py-4">{s.className || "-"}</td>
                  <td className="px-6 py-4">{s.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TodayPresentStudents;
