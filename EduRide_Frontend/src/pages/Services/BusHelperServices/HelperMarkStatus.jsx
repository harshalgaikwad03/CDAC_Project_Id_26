import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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

  // ✅ Fetch students with today’s status
  const fetchStudents = async () => {
    try {
      const res = await API.get("/helpers/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(res.data);

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

  // ✅ Update status
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
      alert("Failed to update status. Please retry.");
    }
  };

  // 🖨️ PDF DOWNLOAD
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Helper Student Status Report", 14, 20);

    const columns = [
      "Name",
      "Roll No",
      "Class",
      "Contact",
      "Bus No",
      "Status",
    ];

    const rows = students.map((s) => [
      s.name,
      s.rollNo || "-",
      s.className || "-",
      s.phone || "-",
      s.busNumber || "N/A",
      statusMap[s.id] || "PENDING",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 73, 94] },
    });

    doc.save("helper_student_status.pdf");
  };

  // 📊 EXCEL DOWNLOAD
  const handleDownloadExcel = () => {
    const excelData = students.map((s) => ({
      Name: s.name,
      "Roll No": s.rollNo || "-",
      Class: s.className || "-",
      Contact: s.phone || "-",
      "Bus No": s.busNumber || "N/A",
      Status: statusMap[s.id] || "PENDING",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Student Status"
    );

    XLSX.writeFile(workbook, "helper_student_status.xlsx");
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
      <h2 className="text-2xl font-bold mb-4 text-center">
        Mark Student Status
      </h2>

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

      {students.length === 0 && (
        <p className="text-center text-gray-600">
          No students assigned to your bus
        </p>
      )}

      {students.map((s) => (
        <div key={s.id} className="bg-white p-4 mb-4 rounded shadow">
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

          <div className="flex gap-6">
            {STATUS_OPTIONS.map((st) => (
              <label key={st} className="flex items-center gap-2 cursor-pointer">
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
