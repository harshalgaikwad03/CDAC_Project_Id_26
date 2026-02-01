import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FaUserTie,
  FaPhoneAlt,
  FaIdCard,
  FaBus,
  FaSchool,
  FaEdit,
  FaTrash,
  FaUnlink,
  FaFilePdf,
  FaFileExcel,
  FaInfoCircle,
  FaSpinner,
  FaArrowLeft,
  FaUserFriends,
  FaClipboardList,
  FaExclamationTriangle,
  FaDownload
} from "react-icons/fa";

function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  /* ---------- LOAD DRIVERS ---------- */
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

  /* ---------- UNASSIGN DRIVER ---------- */
  const unassignDriver = async (busId) => {
    if (!window.confirm("Are you sure you want to unassign this driver from their bus?")) return;
    
    try {
      await API.put(`/buses/${busId}/unassign-driver`);
      alert("Driver unassigned from bus successfully!");
      loadDrivers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unassign driver");
    }
  };

  /* ---------- DELETE DRIVER ---------- */
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

    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await API.delete(`/drivers/${driver.id}`);
      alert("Driver deleted successfully");
      loadDrivers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  /* ---------- PDF ---------- */
  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
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
        headStyles: { fillColor: [37, 99, 235] },
      });

      doc.save("agency_driver_list.pdf");
    } finally {
      setExporting(false);
    }
  };

  /* ---------- EXCEL ---------- */
  const handleDownloadExcel = async () => {
    setExporting(true);
    try {
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
    } finally {
      setExporting(false);
    }
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-6">
          <FaSpinner className="text-purple-600 text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Driver Records...</h3>
        <p className="text-gray-500">Fetching your driver details</p>
      </div>
    );
  }

  const assignedDrivers = drivers.filter(d => d.busId);
  const unassignedDrivers = drivers.filter(d => !d.busId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/agency/services")}
          className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Services</span>
        </button>

        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">
         
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <span className="font-medium text-gray-700">Total Drivers: </span>
              <span className="font-bold text-purple-600">{drivers.length}</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <span className="font-medium text-gray-700">Assigned: </span>
              <span className="font-bold text-green-600">{assignedDrivers.length}</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <span className="font-medium text-gray-700">Unassigned: </span>
              <span className="font-bold text-amber-600">{unassignedDrivers.length}</span>
            </div>
          </div>
        </div>

        {/* ===== INFO NOTE ===== */}
        <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/40 rounded-2xl p-5 mb-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <FaInfoCircle className="text-white text-lg" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Driver Assignment Policy</h4>
              <p className="text-sm text-blue-700">
                Drivers can only be assigned to one bus at a time. Unassign a driver
                before deleting or reassigning.
              </p>
            </div>
          </div>
        </div>

        {/* ===== EXPORT BUTTONS ===== */}
        {drivers.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={handleDownloadPDF}
              disabled={exporting}
              className={`group flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium shadow-sm transition-all duration-300 ${
                exporting
                  ? "bg-gradient-to-r from-blue-400 to-cyan-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-md"
              } text-white`}
            >
              {exporting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaFilePdf />
              )}
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleDownloadExcel}
              disabled={exporting}
              className={`group flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium shadow-sm transition-all duration-300 ${
                exporting
                  ? "bg-gradient-to-r from-green-400 to-emerald-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-md"
              } text-white`}
            >
              {exporting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaFileExcel />
              )}
              <span>Download Excel</span>
            </button>
          </div>
        )}

        {/* ===== DRIVER CARDS ===== */}
        {drivers.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
              <FaUserTie className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Drivers Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Your agency doesn't have any drivers yet. Add drivers to manage your fleet.
            </p>
            <button
              onClick={() => navigate("/agency/services")}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Services</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className={`bg-gradient-to-br from-white to-gray-50/30 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                  driver.busId ? "border-green-200" : "border-amber-200"
                }`}
              >
                {/* Driver Header */}
                <div className={`relative h-32 ${
                  driver.busId 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                }`}>
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <span className={`text-xs font-bold ${
                      driver.busId ? "text-white" : "text-amber-100"
                    }`}>
                      {driver.busId ? "ASSIGNED" : "UNASSIGNED"}
                    </span>
                  </div>
                  
                  {/* Driver Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                      <FaUserTie className="text-white text-3xl" />
                    </div>
                  </div>
                  
                  {/* Driver Name */}
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <h3 className="text-xl font-bold text-white">{driver.name}</h3>
                  </div>
                </div>

                {/* Driver Details */}
                <div className="p-6">
                  {/* Contact Info */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-cyan-50/30 border border-blue-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                        <FaPhoneAlt className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Phone</p>
                        <p className="text-lg font-bold text-gray-900">{driver.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/30 border border-purple-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                        <FaIdCard className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">License No</p>
                        <p className="text-lg font-bold text-gray-900 font-mono">{driver.licenseNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                        <FaBus className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Assigned Bus</p>
                        <p className="text-lg font-bold text-gray-900">
                          {driver.busNumber || "Not Assigned"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/30 border border-amber-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                        <FaSchool className="text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Assigned School</p>
                        <p className="text-lg font-bold text-gray-900 truncate">
                          {driver.schoolName || "Not Assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/agency/services/edit-driver/${driver.id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <FaEdit />
                      <span>Edit Driver</span>
                    </button>

                    {driver.busId && (
                      <button
                        onClick={() => unassignDriver(driver.busId)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <FaUnlink />
                        <span>Unassign from Bus</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(driver)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <FaTrash />
                      <span>Delete Driver</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>Agency Driver Administration • EduRide</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DriverList;