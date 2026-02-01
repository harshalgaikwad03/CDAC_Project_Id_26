import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FaUserTie,
  FaEnvelope,
  FaPhoneAlt,
  FaBus,
  FaTrash,
  FaEdit,
  FaFilePdf,
  FaFileExcel,
  FaInfoCircle,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaUsers,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaUserFriends,
  FaUserShield,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSync,
  FaChartBar
} from "react-icons/fa";

// Filter options
const FILTER_OPTIONS = [
  { value: "ALL", label: "All Helpers" },
  { value: "ASSIGNED", label: "Assigned to Bus" },
  { value: "UNASSIGNED", label: "Not Assigned" }
];

// Sort options
const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "busNumber", label: "Bus Number" },
  { value: "email", label: "Email" }
];

function BusHelperList() {
  const [helpers, setHelpers] = useState([]);
  const [filteredHelpers, setFilteredHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("name");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchHelpers();
  }, []);

  useEffect(() => {
    // Apply search, filter, and sort whenever dependencies change
    let result = helpers;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(helper =>
        helper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        helper.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (helper.phone && helper.phone.includes(searchTerm)) ||
        (helper.busNumber && helper.busNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (filterStatus === "ASSIGNED") {
      result = result.filter(helper => helper.busNumber);
    } else if (filterStatus === "UNASSIGNED") {
      result = result.filter(helper => !helper.busNumber);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "busNumber") return (a.busNumber || "").localeCompare(b.busNumber || "");
      if (sortBy === "email") return a.email.localeCompare(b.email);
      return 0;
    });
    
    setFilteredHelpers(result);
  }, [helpers, searchTerm, filterStatus, sortBy]);

  const fetchHelpers = async () => {
    try {
      if (!isRefreshing) setLoading(true);
      setError("");
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const schoolId = user.id;

      if (!schoolId) {
        throw new Error("Please login again");
      }

      const res = await API.get(`/helpers/school/${schoolId}`);
      setHelpers(res.data || []);
      setFilteredHelpers(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load helpers");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchHelpers();
  };

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
  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Bus Helpers Report", 14, 20);

      const columns = ["Name", "Email", "Phone", "Bus Number"];
      const rows = filteredHelpers.map((h) => [
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
    } finally {
      setExporting(false);
    }
  };

  // 📊 EXCEL DOWNLOAD
  const handleDownloadExcel = async () => {
    setExporting(true);
    try {
      const excelData = filteredHelpers.map((h) => ({
        Name: h.name,
        Email: h.email,
        Phone: h.phone || "-",
        "Bus Number": h.busNumber || "Not Assigned",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Bus Helpers");
      XLSX.writeFile(workbook, "bus_helpers_report.xlsx");
    } finally {
      setExporting(false);
    }
  };

  const assignedHelpers = helpers.filter(h => h.busNumber);
  const unassignedHelpers = helpers.filter(h => !h.busNumber);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mb-6">
          <FaSpinner className="text-green-600 text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Bus Helpers...</h3>
        <p className="text-gray-500">Fetching helper details</p>
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
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow"
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
          onClick={() => navigate("/school/services")}
          className="group flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Services</span>
        </button>

        {/* ===== INFO NOTE ===== */}
        <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/40 rounded-2xl p-5 mb-8 border border-green-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <FaInfoCircle className="text-white text-lg" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-1">Helper Responsibilities</h4>
              <p className="text-sm text-green-700">
                Bus helpers assist drivers in managing student pickup, drop, and attendance.
                Ensure their contact details are always updated for emergency communication.
              </p>
            </div>
          </div>
        </div>

        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <span className="font-medium text-gray-700">Total Helpers: </span>
              <span className="font-bold text-green-600">{helpers.length}</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <span className="font-medium text-gray-700">Assigned: </span>
              <span className="font-bold text-blue-600">{assignedHelpers.length}</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <span className="font-medium text-gray-700">Unassigned: </span>
              <span className="font-bold text-amber-600">{unassignedHelpers.length}</span>
            </div>
          </div>
        </div>

        {/* ===== SEARCH, FILTER, SORT CONTROLS ===== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Helper Management</h3>
              <p className="text-gray-600 text-sm">Search, filter, and manage bus helpers</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or bus number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 pr-8 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 appearance-none bg-white"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 pr-8 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 appearance-none bg-white"
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
              Showing {filteredHelpers.length} of {helpers.length} helpers
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
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ===== EXPORT BUTTONS ===== */}
        {filteredHelpers.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-10 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Export Reports</h3>
              <p className="text-sm text-gray-600">Download complete Helper details for records</p>
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

        {/* ===== HELPER CARDS ===== */}
        {filteredHelpers.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
              <FaUserFriends className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              {helpers.length === 0 ? "No Bus Helpers Found" : "No Matching Helpers Found"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {helpers.length === 0 
                ? "Your school doesn't have any bus helpers yet. Add helpers to manage student transportation."
                : "Try adjusting your search or filter criteria to find helpers."}
            </p>
            {(searchTerm || filterStatus !== "ALL" || sortBy !== "name") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("ALL");
                  setSortBy("name");
                }}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 mr-4"
              >
                <span>Clear Filters</span>
              </button>
            )}
            <button
              onClick={() => navigate("/school/services")}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Services</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHelpers.map((helper) => (
              <div
                key={helper.id}
                className={`bg-gradient-to-br from-white to-gray-50/30 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden group ${helper.busNumber ? "border-green-200" : "border-amber-200"
                  }`}
              >
                {/* Helper Header */}
                <div className={`relative h-32 ${helper.busNumber
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                  }`}>
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <span className={`text-xs font-bold ${helper.busNumber ? "text-white" : "text-amber-100"
                      }`}>
                      {helper.busNumber ? "ASSIGNED" : "UNASSIGNED"}
                    </span>
                  </div>

                  {/* Helper Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                      <FaUserShield className="text-white text-3xl" />
                    </div>
                  </div>

                  {/* Helper Name */}
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <h3 className="text-xl font-bold text-white">{helper.name}</h3>
                  </div>
                </div>

                {/* Helper Details */}
                <div className="p-6">
                  {/* Contact Info */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-cyan-50/30 border border-blue-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                        <FaEnvelope className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Email</p>
                        <p className="text-gray-900 font-medium truncate">{helper.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                        <FaPhoneAlt className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Phone</p>
                        <p className="text-gray-900 font-medium">{helper.phone || "Not Provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/30 border border-purple-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                        <FaBus className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Assigned Bus</p>
                        <p className="text-gray-900 font-medium">
                          {helper.busNumber || "Not Assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/school/services/bus-helpers/edit/${helper.id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <FaEdit />
                      <span>Edit Helper</span>
                    </button>

                    <button
                      onClick={() => handleDelete(helper.id)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <FaTrash />
                      <span>Delete Helper</span>
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
            <span>School Bus Helper Management • EduRide</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BusHelperList;