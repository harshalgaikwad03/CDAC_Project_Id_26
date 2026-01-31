import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function BusHelperList() {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const schoolId = user.id;

        if (!schoolId) {
          throw new Error("Please login again");
        }

        const res = await API.get(`/helpers/school/${schoolId}`);
        setHelpers(res.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load helpers");
      } finally {
        setLoading(false);
      }
    };

    fetchHelpers();
  }, []);

  // 🗑️ Delete helper
  const handleDelete = async (helperId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus helper?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/helpers/${helperId}`);
      setHelpers((prev) => prev.filter((h) => h.id !== helperId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete helper");
    }
  };

  // 🖨️ PDF DOWNLOAD
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Bus Helpers Report", 14, 20);

    const columns = ["Name", "Email", "Phone", "Bus Number"];
    const rows = helpers.map((h) => [
      h.name,
      h.email,
      h.phone || "-",
      h.busNumber || "Not Assigned",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("bus_helpers_report.pdf");
  };

  // 📊 EXCEL DOWNLOAD
  const handleDownloadExcel = () => {
    const excelData = helpers.map((h) => ({
      Name: h.name,
      Email: h.email,
      Phone: h.phone || "-",
      "Bus Number": h.busNumber || "Not Assigned",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Bus Helpers");
    XLSX.writeFile(workbook, "bus_helpers_report.xlsx");
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Bus Helpers</h1>

      {/* 📤 Export Buttons */}
      {helpers.length > 0 && (
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Download PDF
          </button>

          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Download Excel
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {helpers.map((helper) => (
          <div key={helper.id} className="p-6 bg-white shadow rounded">
            <h3 className="font-semibold text-lg">{helper.name}</h3>

            <p className="text-sm text-gray-700">
              <b>Email:</b> {helper.email}
            </p>
            <p className="text-sm text-gray-700">
              <b>Phone:</b> {helper.phone || "-"}
            </p>
            <p className="text-sm text-gray-700">
              <b>Bus:</b> {helper.busNumber || "Not Assigned"}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() =>
                  navigate(`/school/services/bus-helpers/edit/${helper.id}`)
                }
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(helper.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {helpers.length === 0 && (
        <p className="text-center mt-10">No helpers found</p>
      )}
    </div>
  );
}

export default BusHelperList;
