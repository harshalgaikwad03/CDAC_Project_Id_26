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
        // ✅ ONLY STUDENTS UNDER LOGGED-IN SCHOOL
        const res = await API.get('/students/school/me');
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
      <h1 className="text-3xl font-bold text-center mb-10">All Students</h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-600">No students found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Bus</th>
                <th className="px-6 py-4">Agency</th>
                <th className="px-6 py-4">Helper</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.rollNo || '-'}</td>
                  <td className="px-6 py-4">{student.className || '-'}</td>
                  <td className="px-6 py-4">{student.phone || '-'}</td>
                  <td className="px-6 py-4">
                    {student.assignedBus?.busNumber || 'Not Assigned'}
                  </td>
                  <td className="px-6 py-4">
                    {student.assignedBus?.agency?.name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {student.assignedBus?.busHelpers?.map(h => h.name).join(', ') || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate(`/school/services/students/edit/${student.id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
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
