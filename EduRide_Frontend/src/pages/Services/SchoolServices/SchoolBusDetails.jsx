// src/pages/Services/SchoolServices/SchoolBusDetails.jsx
import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function SchoolBusDetails() {
  const [buses, setBuses] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ schoolId in component scope
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const schoolId = user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const busesRes = await API.get(
          `/buses/school/bus-detail/${schoolId}`
        );
        setBuses(busesRes.data);

        const helpersRes = await API.get(`/helpers/school/${schoolId}`);
        setHelpers(helpersRes.data.filter((h) => !h.assignedBus));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId]);

  const assignHelper = async (busId, helperId) => {
    if (!helperId) return;

    try {
      await API.put(`/buses/${busId}/assign-helper/${helperId}`);

      const res = await API.get(
        `/buses/school/bus-detail/${schoolId}`
      );
      setBuses(res.data);

      alert("Helper updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign helper");
    }
  };

  // 🖨️ PDF DOWNLOAD
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("School Bus Details Report", 14, 20);

    const columns = [
      "Bus Number",
      "Capacity",
      "Driver",
      "Driver Phone",
      "Helper",
      "Helper Phone",
    ];

    const rows = buses.map((bus) => [
      bus.busNumber,
      bus.capacity,
      bus.driverName || "Not Assigned",
      bus.driverPhone || "-",
      bus.helperName || "None",
      bus.helperPhone || "-",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 139, 230] },
    });

    doc.save("school_bus_details.pdf");
  };

  // 📊 EXCEL DOWNLOAD
  const handleDownloadExcel = () => {
    const excelData = buses.map((bus) => ({
      "Bus Number": bus.busNumber,
      Capacity: bus.capacity,
      Driver: bus.driverName || "Not Assigned",
      "Driver Phone": bus.driverPhone || "-",
      Helper: bus.helperName || "None",
      "Helper Phone": bus.helperPhone || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "School Bus Details"
    );

    XLSX.writeFile(workbook, "school_bus_details.xlsx");
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Buses Assigned to Your School
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.map((bus) => (
          <div key={bus.id} className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Bus: {bus.busNumber}
            </h3>

            <p>Capacity: {bus.capacity}</p>

            <p className="mt-2">
              <strong>Driver:</strong>{" "}
              {bus.driverName
                ? `${bus.driverName} (${bus.driverPhone || "No contact"})`
                : "Not Assigned"}
            </p>

            <p className="mt-2">
              <strong>Current Helper:</strong>{" "}
              {bus.helperName
                ? `${bus.helperName} (${bus.helperPhone || "No contact"})`
                : "None"}
            </p>

            <label className="block mt-4 mb-2 font-medium">
              Assign / Change Helper
            </label>

            <select
              className="w-full border p-3 rounded-lg"
              defaultValue=""
              onChange={(e) => assignHelper(bus.id, e.target.value)}
            >
              <option value="">-- Select Helper --</option>
              {helpers.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.phone || "No phone"})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchoolBusDetails;
