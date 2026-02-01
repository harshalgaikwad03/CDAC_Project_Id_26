// src/pages/Services/AgencyServices/BusDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function BusDetails() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await API.get(`/buses/agency/${user.id}`);
        setBuses(res.data);
      } catch (err) {
        setError("Failed to load buses");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  const handleEdit = (busId) => {
    navigate(`/agency/services/edit-bus/${busId}`);
  };

  // ✅ DELETE HANDLER
  const handleDelete = async (busId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/buses/${busId}`);
      setBuses((prev) => prev.filter((bus) => bus.id !== busId));
    } catch (err) {
      alert("Failed to delete bus");
    }
  };

  // 🖨️ PDF DOWNLOAD
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Agency Bus Details Report", 14, 20);

    const columns = [
      "Bus Number",
      "Capacity",
      "Assigned School",
      "Driver",
    ];

    const rows = buses.map((bus) => [
      bus.busNumber,
      bus.capacity,
      bus.schoolName || "Not Assigned",
      bus.driverName || "Not Assigned",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [44, 62, 80] },
    });

    doc.save("agency_bus_details.pdf");
  };

  // 📊 EXCEL DOWNLOAD
  const handleDownloadExcel = () => {
    const excelData = buses.map((bus) => ({
      "Bus Number": bus.busNumber,
      Capacity: bus.capacity,
      "Assigned School": bus.schoolName || "Not Assigned",
      Driver: bus.driverName || "Not Assigned",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Bus Details"
    );

    XLSX.writeFile(workbook, "agency_bus_details.xlsx");
  };

  if (loading)
    return <div className="text-center py-20">Loading buses...</div>;

  if (error)
    return (
      <div className="text-center py-20 text-red-600">{error}</div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        All Buses Under Your Agency
      </h1>

      {/* 📤 Export Buttons */}
      {buses.length > 0 && (
        <div className="flex justify-end gap-4 mb-8">
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

      {buses.length === 0 ? (
        <div className="text-center text-gray-600 py-20">
          No buses found. Add a new bus from services page.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold mb-4">
                Bus No: {bus.busNumber}
              </h3>
              <p className="text-gray-700 mb-2">
                Capacity: {bus.capacity}
              </p>
              <p className="text-gray-700 mb-2">
                Assigned School: {bus.schoolName || "Not Assigned"}
              </p>
              <p className="text-gray-700 mb-6">
                Driver: {bus.driverName || "Not Assigned"}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(bus.id)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(bus.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <button
          onClick={() => navigate("/agency/services")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg"
        >
          Back to Services
        </button>
      </div>
    </div>
  );
}

export default BusDetails;
