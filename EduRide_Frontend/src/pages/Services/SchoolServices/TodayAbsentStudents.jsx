import React, { useEffect, useState } from "react";
import API from "../../../services/api";

function TodayAbsentStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodayAbsentStudents();
  }, []);

  const fetchTodayAbsentStudents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      const schoolId = user?.id;
      if (!schoolId) {
        throw new Error("School ID not found. Please login again.");
      }

      const res = await API.get(
        `/student-status/school/${schoolId}/today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ ABSENT = PENDING
      const absentStudents = res.data.filter(
        (s) => s.pickupStatus === "PENDING"
      );

      // DTO already contains student info → no mapping needed
      setStudents(absentStudents);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load absent students"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading absent students...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">
        Today&apos;s Absent Students
      </h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No absent students today 🎉
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Roll No</th>
                <th className="px-6 py-4 text-left font-semibold">Class</th>
                <th className="px-6 py-4 text-left font-semibold">Contact</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {students.map((s) => (
                <tr key={s.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{s.name}</td>
                  <td className="px-6 py-4">{s.rollNo || "-"}</td>
                  <td className="px-6 py-4">{s.className || "-"}</td>
                  <td className="px-6 py-4">{s.phone || "-"}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                      PENDING
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TodayAbsentStudents;
