import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FaUserCheck,
  FaFilePdf,
  FaFileExcel,
  FaDownload,
  FaCalendarDay,
  FaUsers,
  FaCheckCircle,
  FaBus,
  FaClock,
  FaFilter,
  FaArrowLeft,
  FaPrint,
  FaChartLine,
  FaSearch,
  FaSortAmountDown,
  FaSync,
  FaChartBar
} from "react-icons/fa";

// Status options for filtering
const STATUS_OPTIONS = [
  { value: "PICKED", label: "Picked Up", color: "blue", bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-400" },
  { value: "DROPPED", label: "Dropped Off", color: "green", bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-400" }
];

// Sort options
const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "className", label: "Class" },
  { value: "rollNo", label: "Roll No" },
  { value: "pickupStatus", label: "Status" },
  { value: "busNumber", label: "Bus" },
  { value: "updatedAt", label: "Time" }
];

function TodayPresentStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchTodayPresentStudents();
  }, []);

  useEffect(() => {
    // Apply search, filter, and sort whenever dependencies change
    let result = students;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.className && student.className.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.phone && student.phone.includes(searchTerm)) ||
        (student.busNumber && student.busNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (filterStatus !== "ALL") {
      result = result.filter(student => student.pickupStatus === filterStatus);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "className") return (a.className || "").localeCompare(b.className || "");
      if (sortBy === "rollNo") return (a.rollNo || "").localeCompare(b.rollNo || "");
      if (sortBy === "pickupStatus") return (a.pickupStatus || "").localeCompare(b.pickupStatus || "");
      if (sortBy === "busNumber") return (a.busNumber || "").localeCompare(b.busNumber || "");
      if (sortBy === "updatedAt") return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      return 0;
    });
    
    setFilteredStudents(result);
  }, [students, searchTerm, filterStatus, sortBy]);

  const fetchTodayPresentStudents = async () => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);
      
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      const schoolId = user?.id;
      if (!schoolId) {
        throw new Error("School ID not found. Please login again.");
      }

      const res = await API.get(`/student-status/school/${schoolId}/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Present = PICKED or DROPPED
      const presentStudents = res.data.filter(
        (s) => s.pickupStatus === "PICKED" || s.pickupStatus === "DROPPED"
      );

      setStudents(presentStudents);
      setFilteredStudents(presentStudents);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load present students"
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTodayPresentStudents();
  };

  /* 🖨️ PDF DOWNLOAD */
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(24);
    doc.setTextColor(34, 197, 94); // Green color
    doc.text("Today's Attendance Report", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Present: ${filteredStudents.length} students`, 14, 38);
    
    const columns = ["Name", "Roll No", "Class", "Contact", "Status", "Time"];
    
    const rows = filteredStudents.map((s) => [
      s.name,
      s.rollNo || "-",
      s.className || "-",
      s.phone || "-",
      s.pickupStatus,
      s.updatedAt ? new Date(s.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 45,
      styles: { fontSize: 10 },
      headStyles: { 
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`attendance_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  /* 📊 EXCEL DOWNLOAD */
  const handleDownloadExcel = () => {
    const excelData = filteredStudents.map((s) => ({
      Name: s.name,
      "Roll No": s.rollNo || "-",
      Class: s.className || "-",
      Contact: s.phone || "-",
      Status: s.pickupStatus,
      "Status Time": s.updatedAt ? new Date(s.updatedAt).toLocaleTimeString() : "-",
      Bus: s.busNumber || "Not Assigned"
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    // Auto-size columns
    const colWidths = [
      { wch: 25 }, // Name
      { wch: 10 }, // Roll No
      { wch: 12 }, // Class
      { wch: 15 }, // Contact
      { wch: 12 }, // Status
      { wch: 15 }, // Status Time
      { wch: 15 }, // Bus
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `attendance_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const stats = {
    total: students.length,
    picked: students.filter(s => s.pickupStatus === "PICKED").length,
    dropped: students.filter(s => s.pickupStatus === "DROPPED").length
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
        <div className="flex items-center gap-3 text-gray-700">
          <FaUserCheck className="text-xl" />
          <span className="text-lg font-medium">Loading attendance data...</span>
        </div>
        <p className="text-gray-500 text-sm mt-2">Fetching today's present students</p>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
            <FaUserCheck className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
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

        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl mb-6">
            <FaUserCheck className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Today's Attendance Report
          </h1>
          
          {/* Date Info */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
            <FaCalendarDay className="text-green-600" />
            <span className="font-medium text-gray-700">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Present</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              All students marked present today
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Picked Up</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.picked}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaBus className="text-blue-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Students picked up from home
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Dropped Off</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.dropped}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <FaCheckCircle className="text-emerald-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Students dropped at school
            </div>
          </div>
        </div>

        {/* ===== SEARCH, FILTER, SORT CONTROLS ===== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance Management</h3>
              <p className="text-gray-600 text-sm">Search, filter, and sort today's attendance records</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, roll no, class, phone, or bus..."
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
                  <option value="ALL">All Status</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
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
              Showing {filteredStudents.length} of {students.length} students
              {searchTerm && ` matching "${searchTerm}"`}
              {filterStatus !== "ALL" && ` (${STATUS_OPTIONS.find(s => s.value === filterStatus)?.label})`}
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

        {/* ===== EXPORT CONTROLS ===== */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Export Reports</h3>
              <p className="text-gray-600">Download attendance data for records and analysis</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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

        {/* ===== ATTENDANCE TABLE ===== */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center p-4 bg-yellow-100 rounded-full mb-4">
                <FaUserCheck className="text-yellow-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {students.length === 0 
                  ? "No Students Marked Present Today" 
                  : "No Matching Records Found"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {students.length === 0 
                  ? "Attendance data has not been recorded yet for today's transportation."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {(searchTerm || filterStatus !== "ALL" || sortBy !== "name") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("ALL");
                    setSortBy("name");
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium mr-4"
                >
                  Clear Filters
                </button>
              )}
              {students.length === 0 && (
                <button
                  onClick={fetchTodayPresentStudents}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  Refresh Data
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
                    <p className="text-sm text-gray-600">
                      Showing {filteredStudents.length} of {students.length} students
                      {filterStatus !== "ALL" && ` (${STATUS_OPTIONS.find(s => s.value === filterStatus)?.label})`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaClock />
                    <span>Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Student Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Class Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status & Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((s) => (
                      <tr
                        key={s.studentId}
                        className="hover:bg-green-50/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FaUserCheck className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{s.name}</p>
                              <p className="text-sm text-gray-500">Roll: {s.rollNo || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {s.className || "Not Assigned"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-gray-900">{s.phone || "No contact"}</p>
                            {s.busNumber && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <FaBus className="text-gray-400" />
                                <span>Bus {s.busNumber}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                              s.pickupStatus === "PICKED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}>
                              {s.pickupStatus}
                            </span>
                            <div className="text-sm text-gray-500">
                              <FaClock className="inline mr-1" />
                              {s.updatedAt ? new Date(s.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "N/A"}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        {/* <div className="text-center text-gray-500 mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm mb-2">
            Daily Transport Attendance System • EduRide • Real-time Tracking
          </p>
          <p className="text-xs text-gray-400">
            Report generated on {new Date().toLocaleString()} • Auto-refreshes every 5 minutes
          </p>
        </div> */}
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
        @media print {
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default TodayPresentStudents;