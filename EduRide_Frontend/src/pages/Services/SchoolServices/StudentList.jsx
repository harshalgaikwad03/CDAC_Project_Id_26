// src/pages/Services/SchoolServices/StudentList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../services/api';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Assuming backend has /api/students/school/me or similar
        const res = await API.get('/students'); // adjust endpoint if needed
        setStudents(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl">Loading students...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-10">
        All Students
      </h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No students found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Roll No</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Class</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bus</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Agency</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Helper</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.rollNo || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.className || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.assignedBus?.busNumber || 'Not Assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.assignedBus?.agency?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.assignedBus?.busHelpers?.map(h => h.name).join(', ') || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => navigate(`/school/services/students/edit/${student.id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-medium transition"
                    >
                      Edit
                    </button>
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

export default StudentList;