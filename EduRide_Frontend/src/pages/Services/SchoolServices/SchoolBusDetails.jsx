import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FaBus,
  FaUserTie,
  FaUser,
  FaPhoneAlt,
  FaFilePdf,
  FaFileExcel,
  FaInfoCircle,
  FaUsers,
  FaCar,
  FaExchangeAlt,
  FaDownload,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserCheck,
  FaIdCard,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSync,
  FaChartBar,
  FaArrowLeft
} from "react-icons/fa";

// Filter options
const FILTER_OPTIONS = [
  { value: "ALL", label: "All Buses" },
  { value: "WITH_HELPER", label: "With Helper" },
  { value: "WITHOUT_HELPER", label: "Without Helper" },
  { value: "WITH_DRIVER", label: "With Driver" },
  { value: "WITHOUT_DRIVER", label: "Without Driver" }
];

// Sort options
const SORT_OPTIONS = [
  { value: "busNumber", label: "Bus Number" },
  { value: "capacity", label: "Capacity" },
  { value: "driverName", label: "Driver Name" },
  { value: "helperName", label: "Helper Name" }
];

function SchoolBusDetails() {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("busNumber");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ schoolId in component scope
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const schoolId = user.id;

  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, [schoolId]);

  useEffect(() => {
    // Apply search, filter, and sort whenever dependencies change
    let result = buses;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(bus =>
        bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bus.driverName && bus.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (bus.helperName && bus.helperName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (bus.driverPhone && bus.driverPhone.includes(searchTerm)) ||
        (bus.helperPhone && bus.helperPhone.includes(searchTerm))
      );
    }

    // Apply status filter
    if (filterStatus === "WITH_HELPER") {
      result = result.filter(bus => bus.helperName);
    } else if (filterStatus === "WITHOUT_HELPER") {
      result = result.filter(bus => !bus.helperName);
    } else if (filterStatus === "WITH_DRIVER") {
      result = result.filter(bus => bus.driverName);
    } else if (filterStatus === "WITHOUT_DRIVER") {
      result = result.filter(bus => !bus.driverName);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "busNumber") return a.busNumber.localeCompare(b.busNumber);
      if (sortBy === "capacity") return (b.capacity || 0) - (a.capacity || 0);
      if (sortBy === "driverName") return (a.driverName || "").localeCompare(b.driverName || "");
      if (sortBy === "helperName") return (a.helperName || "").localeCompare(b.helperName || "");
      return 0;
    });

    setFilteredBuses(result);
  }, [buses, searchTerm, filterStatus, sortBy]);

  const fetchData = async () => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);

      const busesRes = await API.get(`/buses/school/bus-detail/${schoolId}`);
      setBuses(busesRes.data);
      setFilteredBuses(busesRes.data);

      const helpersRes = await API.get(`/helpers/school/${schoolId}`);
      setHelpers(helpersRes.data.filter((h) => !h.assignedBus));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bus details");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const assignHelper = async (busId, helperId) => {
    if (!helperId) return;

    try {
      await API.put(`/buses/${busId}/assign-helper/${helperId}`);

      const res = await API.get(`/buses/school/bus-detail/${schoolId}`);
      setBuses(res.data);

      // Update helpers list
      const helpersRes = await API.get(`/helpers/school/${schoolId}`);
      setHelpers(helpersRes.data.filter((h) => !h.assignedBus));

      setSuccessMessage("Helper assigned successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign helper");
    }
  };

  // 🖨️ PDF DOWNLOAD
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add header with logo
    doc.setFontSize(24);
    doc.setTextColor(79, 70, 229); // Indigo color
    doc.text("EduRide Bus Details", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`School: ${user.name || "Your School"}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38);

    const columns = [
      "Bus No.",
      "Capacity",
      "Driver",
      "Driver Phone",
      "Helper",
      "Helper Phone",
    ];

    const rows = filteredBuses.map((bus) => [
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
      startY: 45,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`bus_details_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // 📊 EXCEL DOWNLOAD
  const handleDownloadExcel = () => {
    const excelData = filteredBuses.map((bus) => ({
      "Bus Number": bus.busNumber,
      Capacity: bus.capacity,
      Driver: bus.driverName || "Not Assigned",
      "Driver Phone": bus.driverPhone || "-",
      Helper: bus.helperName || "None",
      "Helper Phone": bus.helperPhone || "-",
      Status: bus.helperName ? "Helper Assigned" : "No Helper"
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    // Auto-size columns
    const colWidths = [
      { wch: 12 }, // Bus Number
      { wch: 10 }, // Capacity
      { wch: 20 }, // Driver
      { wch: 15 }, // Driver Phone
      { wch: 20 }, // Helper
      { wch: 15 }, // Helper Phone
      { wch: 15 }, // Status
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Bus Details");
    XLSX.writeFile(workbook, `bus_details_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <div className="flex items-center gap-3 text-gray-700">
          <FaBus className="text-xl" />
          <span className="text-lg font-medium">Loading bus details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/school/services")}
          className="group flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Services</span>
        </button>

        {/* ===== INFO NOTE ===== */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <FaInfoCircle className="text-indigo-600 text-2xl mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2 text-lg">
                Helper Assignment Guide
              </h3>
              <p className="text-indigo-700 mb-3">
                Assigning a bus helper ensures accurate attendance marking and safer student
                transportation. Helpers assist with student pickup/drop and emergency situations.
              </p>

            </div>
          </div>
        </div>

        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 min-w-[180px]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaBus className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{buses.length}</p>
                  <p className="text-sm text-gray-600">Total Buses</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 min-w-[180px]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaUser className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {buses.filter(b => b.driverName).length}
                  </p>
                  <p className="text-sm text-gray-600">Drivers Assigned</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 min-w-[180px]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaUserTie className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {buses.filter(b => b.helperName).length}
                  </p>
                  <p className="text-sm text-gray-600">Helpers Assigned</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 min-w-[180px]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaUsers className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{helpers.length}</p>
                  <p className="text-sm text-gray-600">Available Helpers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SEARCH, FILTER, SORT CONTROLS ===== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bus Fleet Management</h3>
              <p className="text-gray-600 text-sm">Search, filter, and manage your bus fleet</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by bus number, driver, helper, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 appearance-none bg-white"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 appearance-none bg-white"
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
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ===== SUCCESS MESSAGE ===== */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
            <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">{successMessage}</p>
              <p className="text-green-700 text-sm mt-1">Changes saved successfully</p>
            </div>
          </div>
        )}



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
                className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaFilePdf className="text-lg" />
                <span className="font-semibold">PDF Report</span>
              </button>

              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaFileExcel className="text-lg" />
                <span className="font-semibold">Excel Sheet</span>
              </button>
            </div>
          </div>
        )}

        {/* ===== BUS FLEET ===== */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FaBus className="text-indigo-600" />
              Bus Fleet Details
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {filteredBuses.length} buses
              </span>
            </h2>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <FaChartBar />
              <span>{helpers.length} available helpers</span>
            </div>
          </div>

          {filteredBuses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                <FaBus className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {buses.length === 0 ? "No Buses Assigned" : "No Matching Buses Found"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {buses.length === 0
                  ? "Your school doesn't have any buses assigned yet. Contact the admin to get started."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {(searchTerm || filterStatus !== "ALL" || sortBy !== "busNumber") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("ALL");
                    setSortBy("busNumber");
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBuses.map((bus) => (
                <div
                  key={bus.id}
                  className={`bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-xl ${selectedBus === bus.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  onClick={() => setSelectedBus(bus.id === selectedBus ? null : bus.id)}
                >
                  {/* Bus Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <FaBus className="text-white text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">Bus {bus.busNumber}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-white/90 text-sm">
                              <FaUsers />
                              <span>Capacity: {bus.capacity}</span>
                            </div>
                            <span className="text-white/70">•</span>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${bus.helperName
                                ? 'bg-green-500/20 text-green-100'
                                : 'bg-yellow-500/20 text-yellow-100'
                              }`}>
                              {bus.helperName ? 'Helper Assigned' : 'No Helper'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <FaChevronRight className={`text-white/70 transition-transform duration-300 ${selectedBus === bus.id ? 'rotate-90' : ''
                        }`} />
                    </div>
                  </div>

                  {/* Bus Details */}
                  <div className="p-6 space-y-5">
                    {/* Driver Info */}
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Driver</h4>
                          <p className="text-sm text-gray-600">Assigned driver details</p>
                        </div>
                      </div>
                      {bus.driverName ? (
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">{bus.driverName}</p>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaPhoneAlt className="text-gray-400" />
                            <span>{bus.driverPhone || "No phone number"}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <p className="text-gray-500 italic">Driver not assigned</p>
                        </div>
                      )}
                    </div>

                    {/* Helper Info */}
                    <div className={`rounded-xl p-4 ${bus.helperName ? 'bg-green-50' : 'bg-yellow-50'
                      }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${bus.helperName ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                          <FaUserTie className={bus.helperName ? 'text-green-600' : 'text-yellow-600'} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Helper</h4>
                          <p className="text-sm text-gray-600">Assigned helper details</p>
                        </div>
                      </div>
                      {bus.helperName ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{bus.helperName}</p>
                            <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Assigned
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaPhoneAlt className="text-gray-400" />
                            <span>{bus.helperPhone || "No phone number"}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2 mb-3">
                          <p className="text-gray-500 italic mb-2">No helper assigned</p>
                        </div>
                      )}

                      {/* Helper Assignment Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FaExchangeAlt className="text-gray-400" />
                          Assign / Change Helper
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 bg-white"
                          defaultValue=""
                          onChange={(e) => {
                            assignHelper(bus.id, e.target.value);
                            setSelectedBus(null);
                          }}
                        >
                          <option value="">Select a helper</option>
                          {helpers.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name} {h.phone ? `(${h.phone})` : ''}
                            </option>
                          ))}
                          {bus.helperName && (
                            <option value="remove">Remove Current Helper</option>
                          )}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                          {helpers.length} available helper(s)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="text-center pt-10 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
            <FaIdCard className="text-indigo-500" />
            <span className="font-medium">School ID: {schoolId}</span>
          </div>
          <p className="text-sm text-gray-500">
            Bus Fleet Management System • EduRide • Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            All helper assignments are logged for compliance and safety records
          </p>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default SchoolBusDetails;