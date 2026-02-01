// src/pages/Services/AgencyServices/BusDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FaBus,
  FaFilePdf,
  FaFileExcel,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaInfoCircle,
  FaUserTie,
  FaSchool,
  FaUsers,
  FaRoute,
  FaSpinner,
  FaDownload,
  FaExclamationTriangle
} from "react-icons/fa";

function BusDetails() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
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

  /* ---------- PDF ---------- */
  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
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
        headStyles: { fillColor: [37, 99, 235] },
      });

      doc.save("agency_bus_details.pdf");
    } finally {
      setExporting(false);
    }
  };

  /* ---------- EXCEL ---------- */
  const handleDownloadExcel = async () => {
    setExporting(true);
    try {
      const excelData = buses.map((bus) => ({
        "Bus Number": bus.busNumber,
        Capacity: bus.capacity,
        "Assigned School": bus.schoolName || "Not Assigned",
        Driver: bus.driverName || "Not Assigned",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bus Details");
      XLSX.writeFile(workbook, "agency_bus_details.xlsx");
    } finally {
      setExporting(false);
    }
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mb-6">
          <FaSpinner className="text-blue-600 text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Bus Records...</h3>
        <p className="text-gray-500">Fetching your fleet details</p>
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center mb-6">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow"
        >
          Try Again
        </button>
      </div>
    );
  }

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
            <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <span className="font-medium text-gray-700">Total Buses: </span>
              <span className="font-bold text-blue-600">{buses.length}</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <span className="font-medium text-gray-700">Assigned Buses: </span>
              <span className="font-bold text-green-600">
                {buses.filter(bus => bus.driverName).length}
              </span>
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
              <h4 className="font-semibold text-blue-800 mb-1">Export Options</h4>
              <p className="text-sm text-blue-700">
                Use the export options below to download bus details for reporting,
                documentation, or offline review.
              </p>
            </div>
          </div>
        </div>

        {/* ===== EXPORT BUTTONS ===== */}
        {buses.length > 0 && (
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

        {/* ===== BUS CARDS ===== */}
        {buses.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
              <FaBus className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Buses Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Your agency doesn't have any buses yet. Add a new bus from the Agency Services page.
            </p>
            <button
              onClick={() => navigate("/agency/services")}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Services</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden group"
              >
                {/* Bus Design Header */}
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-cyan-500">
                  {/* Bus Window Design */}
                  <div className="absolute top-4 left-6 w-20 h-10 rounded-lg bg-gradient-to-r from-blue-300/50 to-cyan-300/50 backdrop-blur-sm"></div>
                  <div className="absolute top-4 right-6 w-20 h-10 rounded-lg bg-gradient-to-r from-blue-300/50 to-cyan-300/50 backdrop-blur-sm"></div>
                  
                  {/* Bus Lights */}
                  <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-yellow-400 shadow-lg"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-red-400 shadow-lg"></div>
                  
                  {/* Bus Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FaBus className="text-white text-3xl" />
                    </div>
                  </div>
                </div>

                {/* Bus Content */}
                <div className="p-6">
                  {/* Bus Number */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 mb-3">
                      <FaRoute className="text-blue-600" />
                      <span className="font-medium text-gray-700">Bus Number</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{bus.busNumber}</h3>
                  </div>

                  {/* Bus Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-cyan-50/30 border border-blue-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                        <FaUsers className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Capacity</p>
                        <p className="text-lg font-bold text-gray-900">{bus.capacity} Students</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                        <FaSchool className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Assigned School</p>
                        <p className="text-lg font-bold text-gray-900 truncate">
                          {bus.schoolName || "Not Assigned"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/30 border border-purple-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                        <FaUserTie className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Driver</p>
                        <p className="text-lg font-bold text-gray-900 truncate">
                          {bus.driverName || "Not Assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(bus.id)}
                      className="group flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(bus.id)}
                      className="group flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== BACK BUTTON ===== */}
        <div className="text-center mt-14">
          <button
            onClick={() => navigate("/agency/services")}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Services</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>Agency Fleet Overview • EduRide</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BusDetails;