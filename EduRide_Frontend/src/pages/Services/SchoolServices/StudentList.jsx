import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students/school/me");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE STUDENT
  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/students/${studentId}`);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete student");
    }
  };

  // 🖨️ PDF DOWNLOAD
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Student List Report", 14, 20);

    const columns = [
      "Name",
      "Email",
      "Roll No",
      "Class",
      "Phone",
      "Bus",
      "Pass Status",
    ];

    const rows = students.map((s) => [
      s.name,
      s.email,
      s.rollNo || "-",
      s.className || "-",
      s.phone || "-",
      s.assignedBusNumber || "Not Assigned",
      s.passStatus,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("students_list.pdf");
  };

  // 📊 EXCEL DOWNLOAD
  const handleDownloadExcel = () => {
    const excelData = students.map((s) => ({
      Name: s.name,
      Email: s.email,
      "Roll No": s.rollNo || "-",
      Class: s.className || "-",
      Phone: s.phone || "-",
      Bus: s.assignedBusNumber || "Not Assigned",
      "Pass Status": s.passStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students_list.xlsx");
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading students...
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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Students of Your School
      </h1>

      {/* 📤 Export Buttons */}
      {students.length > 0 && (
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Download PDF
          </button>

          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Download Excel
          </button>
        </div>
      )}

      {students.length === 0 ? (
        <p className="text-center text-gray-600">No students found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Roll No</th>
                <th className="px-6 py-4 text-left">Class</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Bus</th>
                <th className="px-6 py-4 text-left">Pass Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.rollNo || "-"}</td>
                  <td className="px-6 py-4">{student.className || "-"}</td>
                  <td className="px-6 py-4">{student.phone || "-"}</td>
                  <td className="px-6 py-4">
                    {student.assignedBusNumber || "Not Assigned"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        student.passStatus === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.passStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button
                      onClick={() =>
                        navigate(
                          `/school/services/students/edit/${student.id}`
                        )
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
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
