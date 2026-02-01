import React, { useEffect, useState } from "react";
import API from "../../../services/api";

function AgencySchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await API.get("/agencies/schools");
      setSchools(res.data);
    } catch (err) {
      console.error("Error fetching schools", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSchool = async (schoolId) => {
    if (!window.confirm("Are you sure you want to delete this school?")) return;

    try {
      await API.put(`/agencies/schools/${schoolId}/release`);
      setSchools(schools.filter((s) => s.id !== schoolId));
    } catch (err) {
      alert("Failed to delete school");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading schools...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Schools Under Your Agency
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-gray-700 font-semibold">
                School Name
              </th>
              <th className="px-6 py-4 text-gray-700 font-semibold">
                Total Students
              </th>
              <th className="px-6 py-4 text-gray-700 font-semibold">
                Assigned Buses
              </th>
              <th className="px-6 py-4 text-gray-700 font-semibold text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {schools.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No schools found
                </td>
              </tr>
            ) : (
              schools.map((school) => (
                <tr key={school.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{school.name}</td>
                  <td className="px-6 py-4">
                    {school.totalStudents}
                  </td>
                  <td className="px-6 py-4">
                    {school.totalBuses}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteSchool(school.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
                    >
                      Release School
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgencySchools;
