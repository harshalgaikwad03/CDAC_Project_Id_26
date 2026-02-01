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
  FaDownload,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSync,
  FaChartBar
} from "react-icons/fa";

// Filter options
const FILTER_OPTIONS = [
  { value: "ALL", label: "All Drivers" },
  { value: "ASSIGNED", label: "Assigned to Bus" },
  { value: "UNASSIGNED", label: "Not Assigned" },
  { value: "WITH_SCHOOL", label: "With School" },
  { value: "WITHOUT_SCHOOL", label: "Without School" }
];

// Sort options
const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "phone", label: "Phone" },
  { value: "licenseNumber", label: "License No" },
  { value: "busNumber", label: "Bus Number" },
  { value: "schoolName", label: "School Name" }
];

function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("name");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  /* ---------- LOAD DRIVERS ---------- */
  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    // Apply search, filter, and sort whenever dependencies change
    let result = drivers;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone.includes(searchTerm) ||
        (driver.licenseNumber && driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.busNumber && driver.busNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.schoolName && driver.schoolName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (filterStatus === "ASSIGNED") {
      result = result.filter(driver => driver.busId);
    } else if (filterStatus === "UNASSIGNED") {
      result = result.filter(driver => !driver.busId);
    } else if (filterStatus === "WITH_SCHOOL") {
      result = result.filter(driver => driver.schoolName);
    } else if (filterStatus === "WITHOUT_SCHOOL") {
      result = result.filter(driver => !driver.schoolName);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "phone") return a.phone.localeCompare(b.phone);
      if (sortBy === "licenseNumber") return (a.licenseNumber || "").localeCompare(b.licenseNumber || "");
      if (sortBy === "busNumber") return (a.busNumber || "").localeCompare(b.busNumber || "");
      if (sortBy === "schoolName") return (a.schoolName || "").localeCompare(b.schoolName || "");
      return 0;
    });
    
    setFilteredDrivers(result);
  }, [drivers, searchTerm, filterStatus, sortBy]);

  const loadDrivers = async () => {
    try {
      if (!isRefreshing) setLoading(true);
      const res = await API.get("/drivers/agency/me");
      setDrivers(res.data);
      setFilteredDrivers(res.data);
    } catch {
      alert("Failed to load drivers");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDrivers();
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

      const rows = filteredDrivers.map((d) => [
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
      const excelData = filteredDrivers.map((d) => ({
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

  const assignedDrivers = drivers.filter(d => d.busId);
  const unassignedDrivers = drivers.filter(d => !d.busId);
  const driversWithSchool = drivers.filter(d => d.schoolName);
  const driversWithoutSchool = drivers.filter(d => !d.schoolName);

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

        {/* ===== SEARCH, FILTER, SORT CONTROLS ===== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Driver Management</h3>
              <p className="text-gray-600 text-sm">Search, filter, and manage your driver fleet</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, phone, license, bus, or school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Filter Options */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white"
                >
                  {FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-2 h-2 border-b-2 border-r-2 border-gray-400 transform rotate-45"></div>
                </div>
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort by {option.label}
                    </option>
                  ))}
                </select>
                <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-2 h-2 border-b-2 border-r-2 border-gray-400 transform rotate-45"></div>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredDrivers.length} of {drivers.length} drivers
              {searchTerm && ` matching "${searchTerm}"`}
              {filterStatus !== "ALL" && ` (${FILTER_OPTIONS.find(f => f.value === filterStatus)?.label})`}
            </div>
            {(searchTerm || filterStatus !== "ALL" || sortBy !== "name") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("ALL");
                  setSortBy("name");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

       

        {/* ===== EXPORT BUTTONS ===== */}
        {filteredDrivers.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-10 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Export Reports</h3>
              <p className="text-sm text-gray-600">Download complete Driver details for records</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                disabled={exporting}
                className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFilePdf className="text-lg" />
                <span className="font-semibold">PDF Report</span>
              </button>

              <button
                onClick={handleDownloadExcel}
                disabled={exporting}
                className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFileExcel className="text-lg" />
                <span className="font-semibold">Excel Sheet</span>
              </button>
            </div>
          </div>
        )}

        {/* ===== DRIVER CARDS ===== */}
        {filteredDrivers.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
              <FaUserTie className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              {drivers.length === 0 ? "No Drivers Found" : "No Matching Drivers Found"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {drivers.length === 0 
                ? "Your agency doesn't have any drivers yet. Add drivers to manage your fleet."
                : "Try adjusting your search or filter criteria to find drivers."}
            </p>
            {(searchTerm || filterStatus !== "ALL" || sortBy !== "name") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("ALL");
                  setSortBy("name");
                }}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 mr-4"
              >
                <span>Clear Filters</span>
              </button>
            )}
            <button
              onClick={() => navigate("/agency/services")}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Services</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className={`bg-gradient-to-br from-white to-gray-50/30 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden group ${driver.busId ? "border-green-200" : "border-amber-200"
                  }`}
              >
                {/* Driver Header */}
                <div className={`relative h-32 ${driver.busId
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                  }`}>
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <span className={`text-xs font-bold ${driver.busId ? "text-white" : "text-amber-100"
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