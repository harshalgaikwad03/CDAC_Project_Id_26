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
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSync,
  FaChartBar
} from "react-icons/fa";

// Filter options
const FILTER_OPTIONS = [
  { value: "ALL", label: "All Buses" },
  { value: "WITH_DRIVER", label: "With Driver" },
  { value: "WITHOUT_DRIVER", label: "Without Driver" },
  { value: "WITH_SCHOOL", label: "With School" },
  { value: "WITHOUT_SCHOOL", label: "Without School" }
];

// Sort options
const SORT_OPTIONS = [
  { value: "busNumber", label: "Bus Number" },
  { value: "capacity", label: "Capacity" },
  { value: "driverName", label: "Driver Name" },
  { value: "schoolName", label: "School Name" }
];

function BusDetails() {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("busNumber");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    // Apply search, filter, and sort whenever dependencies change
    let result = buses;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(bus =>
        bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bus.driverName && bus.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (bus.schoolName && bus.schoolName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        bus.capacity.toString().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (filterStatus === "WITH_DRIVER") {
      result = result.filter(bus => bus.driverName);
    } else if (filterStatus === "WITHOUT_DRIVER") {
      result = result.filter(bus => !bus.driverName);
    } else if (filterStatus === "WITH_SCHOOL") {
      result = result.filter(bus => bus.schoolName);
    } else if (filterStatus === "WITHOUT_SCHOOL") {
      result = result.filter(bus => !bus.schoolName);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "busNumber") return a.busNumber.localeCompare(b.busNumber);
      if (sortBy === "capacity") return b.capacity - a.capacity; // Higher capacity first
      if (sortBy === "driverName") return (a.driverName || "").localeCompare(b.driverName || "");
      if (sortBy === "schoolName") return (a.schoolName || "").localeCompare(b.schoolName || "");
      return 0;
    });
    
    setFilteredBuses(result);
  }, [buses, searchTerm, filterStatus, sortBy]);

  const fetchBuses = async () => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);
      
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await API.get(`/buses/agency/${user.id}`);
      setBuses(res.data);
      setFilteredBuses(res.data);
    } catch (err) {
      setError("Failed to load buses");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBuses();
  };

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

      const rows = filteredBuses.map((bus) => [
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
      const excelData = filteredBuses.map((bus) => ({
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

  const assignedBuses = buses.filter(bus => bus.driverName);
  const unassignedBuses = buses.filter(bus => !bus.driverName);
  const busesWithSchool = buses.filter(bus => bus.schoolName);
  const busesWithoutSchool = buses.filter(bus => !bus.schoolName);

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

      {/* ===== INFO NOTE ===== */}
        <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/40 rounded-2xl p-5 mb-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <FaInfoCircle className="text-white text-lg" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Fleet Management</h4>
              <p className="text-sm text-blue-700">
                Use the search, filter, and sort options to manage your bus fleet efficiently.
                Export bus details for reporting, documentation, or offline review.
              </p>
            </div>
          </div>
        </div>
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
                {assignedBuses.length}
              </span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <span className="font-medium text-gray-700">With School: </span>
              <span className="font-bold text-purple-600">
                {busesWithSchool.length}
              </span>
            </div>
          </div>
        </div>

        {/* ===== SEARCH, FILTER, SORT CONTROLS ===== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fleet Management</h3>
              <p className="text-gray-600 text-sm">Search, filter, and manage your bus fleet</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by bus number, driver, school, or capacity..."
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
              Showing {filteredBuses.length} of {buses.length} buses
              {searchTerm && ` matching "${searchTerm}"`}
              {filterStatus !== "ALL" && ` (${FILTER_OPTIONS.find(f => f.value === filterStatus)?.label})`}
            </div>
            {(searchTerm || filterStatus !== "ALL" || sortBy !== "busNumber") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("ALL");
                  setSortBy("busNumber");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        

        {/* ===== EXPORT BUTTONS ===== */}
        {filteredBuses.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-10 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Export Reports</h3>
              <p className="text-sm text-gray-600">Download complete bus details for records</p>
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

        {/* ===== BUS CARDS ===== */}
        {filteredBuses.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
              <FaBus className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              {buses.length === 0 ? "No Buses Found" : "No Matching Buses Found"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {buses.length === 0 
                ? "Your agency doesn't have any buses yet. Add a new bus from the Agency Services page."
                : "Try adjusting your search or filter criteria to find buses."}
            </p>
            {(searchTerm || filterStatus !== "ALL" || sortBy !== "busNumber") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("ALL");
                  setSortBy("busNumber");
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
            {filteredBuses.map((bus) => (
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
        {/* <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>Agency Fleet Overview • EduRide</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default BusDetails;