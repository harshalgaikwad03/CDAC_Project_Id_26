import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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

  // 🖨️ PDF DOWNLOAD
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Today's Absent Students Report", 14, 20);

    const columns = [
      "Name",
      "Roll No",
      "Class",
      "Contact",
      "Status",
    ];

    const rows = students.map((s) => [
      s.name,
      s.rollNo || "-",
      s.className || "-",
      s.phone || "-",
      "PENDING",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [243, 156, 18] },
    });

    doc.save("today_absent_students.pdf");
  };

  // 📊 EXCEL DOWNLOAD
  const handleDownloadExcel = () => {
    const excelData = students.map((s) => ({
      Name: s.name,
      "Roll No": s.rollNo || "-",
      Class: s.className || "-",
      Contact: s.phone || "-",
      Status: "PENDING",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Absent Students"
    );

    XLSX.writeFile(workbook, "today_absent_students.xlsx");
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
      <h1 className="text-3xl font-bold text-center mb-6">
        Today&apos;s Absent Students
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
