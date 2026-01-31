import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ─────────────────────────────────────────────
  // Load drivers for logged-in agency
  // ─────────────────────────────────────────────
  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const res = await API.get("/drivers/agency/me");
      setDrivers(res.data);
    } catch {
      alert("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Unassign driver from bus
  // ─────────────────────────────────────────────
  const unassignDriver = async (busId) => {
    try {
      await API.put(`/buses/${busId}/unassign-driver`);
      alert("Driver unassigned from bus");
      loadDrivers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unassign driver");
    }
  };

  // ─────────────────────────────────────────────
  // Delete driver (auto-unassign flow)
  // ─────────────────────────────────────────────
  const handleDelete = async (driver) => {
    if (driver.busId) {
      const confirmUnassign = window.confirm(
        "This driver is assigned to a bus.\n\nDo you want to unassign the bus and delete the driver?"
      );
      if (!confirmUnassign) return;

      try {
        await API.put(`/buses/${driver.busId}/unassign-driver`);

        const confirmDelete = window.confirm(
          "Driver unassigned successfully.\n\nDo you want to delete the driver now?"
        );
        if (!confirmDelete) {
          loadDrivers();
          return;
        }

        await API.delete(`/drivers/${driver.id}`);
        alert("Driver deleted successfully");
        loadDrivers();
        return;
      } catch (err) {
        alert(err.response?.data?.message || "Operation failed");
        return;
      }
    }

    if (!window.confirm("Delete this driver?")) return;

    try {
      await API.delete(`/drivers/${driver.id}`);
      alert("Driver deleted successfully");
      loadDrivers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // 🖨️ PDF DOWNLOAD
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Agency Driver List Report", 14, 20);

    const columns = [
      "Name",
      "Phone",
      "License No",
      "Bus Number",
      "School",
    ];

    const rows = drivers.map((d) => [
      d.name,
      d.phone,
      d.licenseNumber,
      d.busNumber || "Not Assigned",
      d.schoolName || "Not Assigned",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("agency_driver_list.pdf");
  };

  // 📊 EXCEL DOWNLOAD
  const handleDownloadExcel = () => {
    const excelData = drivers.map((d) => ({
      Name: d.name,
      Phone: d.phone,
      "License No": d.licenseNumber,
      "Bus Number": d.busNumber || "Not Assigned",
      School: d.schoolName || "Not Assigned",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");

    XLSX.writeFile(workbook, "agency_driver_list.xlsx");
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Drivers</h1>

        {/* 📤 Export Buttons */}
        {drivers.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Download PDF
            </button>
            <button
              onClick={handleDownloadExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              Download Excel
            </button>
          </div>
        )}
      </div>

      {drivers.length === 0 ? (
        <p className="text-center text-gray-600">No drivers found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drivers.map((d) => (
            <div
              key={d.id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold mb-2">{d.name}</h3>

              <p>📞 {d.phone}</p>
              <p>🪪 {d.licenseNumber}</p>

              <p className="mt-2">
                🚌 Bus: {d.busNumber || "Not Assigned"}
              </p>
              <p>
                🏫 School: {d.schoolName || "Not Assigned"}
              </p>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() =>
                    navigate(`/agency/services/edit-driver/${d.id}`)
                  }
                  className="bg-yellow-600 text-white py-2 rounded-lg"
                >
                  Edit
                </button>

                {d.busId && (
                  <button
                    onClick={() => unassignDriver(d.busId)}
                    className="bg-orange-600 text-white py-2 rounded-lg"
                  >
                    Unassign from Bus
                  </button>
                )}

                <button
                  onClick={() => handleDelete(d)}
                  className="bg-red-600 text-white py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DriverList;
