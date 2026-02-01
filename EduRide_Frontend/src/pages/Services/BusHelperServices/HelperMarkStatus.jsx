import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FaUserCheck,
  FaBus,
  FaFilePdf,
  FaFileExcel,
  FaDownload,
  FaSearch,
  FaFilter,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSync,
  FaArrowRight,
  FaPrint,
  FaChartBar,
  FaSortAmountDown,
  FaInfoCircle
} from "react-icons/fa";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", color: "yellow", bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-400" },
  { value: "PICKED", label: "Picked Up", color: "green", bg: "bg-green-100", text: "text-green-800", border: "border-green-400" },
  { value: "DROPPED", label: "Dropped Off", color: "blue", bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-400" }
];

function HelperMarkStatus() {
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("name");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ---------------- FETCH STUDENTS ---------------- */
  const fetchStudents = async () => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);

      const res = await API.get("/helpers/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(res.data);

      const initialStatus = {};
      res.data.forEach((s) => {
        initialStatus[s.id] = s.pickupStatus || "PENDING";
      });

      setStatusMap(initialStatus);
    } catch (err) {
      console.error(err);
      setError("Failed to load student data. Please check your connection.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStudents();
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (studentId, pickupStatus) => {
    const previousStatus = statusMap[studentId];
    
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: pickupStatus,
    }));

    try {
      await API.post(
        "/helpers/student-status",
        { studentId, pickupStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      alert("Failed to update status. Please retry.");
      // Revert on error
      setStatusMap((prev) => ({
        ...prev,
        [studentId]: previousStatus,
      }));
    }
  };

  /* ---------------- FILTER & SEARCH ---------------- */
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === "" || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.className && student.className.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.phone && student.phone.includes(searchTerm));
    
    const matchesStatus = filterStatus === "ALL" || statusMap[student.id] === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "class") return (a.className || "").localeCompare(b.className || "");
    if (sortBy === "roll") return (a.rollNo || "").localeCompare(b.rollNo || "");
    if (sortBy === "status") return (statusMap[a.id] || "").localeCompare(statusMap[b.id] || "");
    return 0;
  });

  // Calculate statistics
  const stats = {
    total: students.length,
    pending: students.filter(s => statusMap[s.id] === "PENDING").length,
    picked: students.filter(s => statusMap[s.id] === "PICKED").length,
    dropped: students.filter(s => statusMap[s.id] === "DROPPED").length,
  };

  /* ---------------- PDF ---------------- */
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text("Student Transport Status Report", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Helper: ${JSON.parse(localStorage.getItem("user"))?.name || "Helper"}`, 14, 38);
    doc.text(`Total Students: ${students.length}`, 14, 46);

    const columns = [
      "Name",
      "Roll No",
      "Class",
      "Contact",
      "Bus No",
      "Status",
      "Updated",
    ];

    const rows = students.map((s) => [
      s.name,
      s.rollNo || "-",
      s.className || "-",
      s.phone || "-",
      s.busNumber || "N/A",
      statusMap[s.id] || "PENDING",
      new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 52,
      styles: { fontSize: 10 },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`student_status_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  /* ---------------- EXCEL ---------------- */
  const handleDownloadExcel = () => {
    const excelData = students.map((s) => ({
      Name: s.name,
      "Roll No": s.rollNo || "-",
      Class: s.className || "-",
      Contact: s.phone || "-",
      "Bus No": s.busNumber || "N/A",
      Status: statusMap[s.id] || "PENDING",
      "Status Time": new Date().toLocaleTimeString(),
      "Helper": JSON.parse(localStorage.getItem("user"))?.name || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    // Auto-size columns
    const colWidths = [
      { wch: 25 }, // Name
      { wch: 10 }, // Roll No
      { wch: 12 }, // Class
      { wch: 15 }, // Contact
      { wch: 10 }, // Bus No
      { wch: 12 }, // Status
      { wch: 15 }, // Status Time
      { wch: 20 }, // Helper
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Status");
    XLSX.writeFile(workbook, `student_status_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <div className="flex items-center gap-3 text-gray-700">
          <FaUserCheck className="text-xl" />
          <span className="text-lg font-medium">Loading assigned students...</span>
        </div>
        <p className="text-gray-500 text-sm mt-2">Fetching student data from your bus</p>
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
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
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
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl mb-6">
            <FaUserCheck className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Student Transport Status
          </h1>
         
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Assigned to your bus
            </div>
          </div>

          {STATUS_OPTIONS.map((status) => (
            <div key={status.value} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{status.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {status.value === "PENDING" ? stats.pending :
                     status.value === "PICKED" ? stats.picked :
                     stats.dropped}
                  </p>
                </div>
                <div className={`p-3 ${status.bg} rounded-xl`}>
                  <FaUserCheck className={`${status.text} text-2xl`} />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Students with {status.label.toLowerCase()} status
              </div>
            </div>
          ))}
        </div>

        {/* ===== SEARCH AND FILTER BAR ===== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Management</h3>
              <p className="text-gray-600 text-sm">Search, filter, and update student transport status</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, roll no, or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="class">Sort by Class</option>
                  <option value="roll">Sort by Roll No</option>
                  <option value="status">Sort by Status</option>
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
        </div>

        {/* ===== EXPORT CONTROLS ===== */}
        {students.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Export Reports</h3>
              <p className="text-gray-600">Download status data for records and analysis</p>
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

        {/* ===== STUDENT CARDS ===== */}
        {students.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-16 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-yellow-100 rounded-full mb-4">
              <FaBus className="text-yellow-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Students Assigned
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              There are no students currently mapped to your bus. Please check with your supervisor.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-800 rounded-xl">
              <FaInfoCircle />
              <span>Contact school administration for student assignments</span>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-16 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
              <FaSearch className="text-gray-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Matching Students Found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("ALL");
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Showing {sortedStudents.length} of {students.length} students
                {filterStatus !== "ALL" && ` (${STATUS_OPTIONS.find(s => s.value === filterStatus)?.label})`}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaClock />
                <span>Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>

            {sortedStudents.map((s) => {
              const currentStatus = statusMap[s.id] || "PENDING";
              const statusConfig = STATUS_OPTIONS.find(st => st.value === currentStatus);
              
              return (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
                      <Info label="Student Name" value={s.name} icon={<FaUserCheck className="text-gray-400" />} />
                      <Info label="Roll Number" value={s.rollNo || "N/A"} />
                      <Info label="Class" value={s.className || "Not Assigned"} />
                      <Info label="Contact" value={s.phone || "No Contact"} />
                      <Info label="Bus Number" value={s.busNumber || "N/A"} icon={<FaBus className="text-gray-400" />} />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Current Status</p>
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${statusConfig?.bg} ${statusConfig?.text} border ${statusConfig?.border}`}>
                          <span className="font-semibold">{statusConfig?.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* STATUS SELECTION */}
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaChartBar className="text-blue-500" />
                        Update Transport Status
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {STATUS_OPTIONS.map((status) => (
                          <button
                            key={status.value}
                            onClick={() => updateStatus(s.id, status.value)}
                            className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all duration-200 ${
                              currentStatus === status.value
                                ? `${status.bg} ${status.border} ${status.text} font-semibold`
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${status.bg}`}>
                              <FaUserCheck className={`${status.text}`} />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold">{status.label}</div>
                              <div className="text-xs opacity-75">
                                {status.value === "PENDING" ? "Waiting for pickup" :
                                 status.value === "PICKED" ? "Student picked up" :
                                 "Student dropped at school"}
                              </div>
                            </div>
                            {currentStatus === status.value && (
                              <FaCheckCircle className="ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <div className="text-center text-gray-500 mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm mb-2">
            Bus Helper Management System • EduRide • Real-time Status Tracking
          </p>
          <p className="text-xs text-gray-400">
            Report generated on {new Date().toLocaleString()} • All status changes are logged for audit
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              PENDING
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              PICKED UP
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              DROPPED OFF
            </span>
          </div>
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
        @media print {
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ---------- Info Component ---------- */
function Info({ label, value, icon }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
      <p className="font-semibold text-gray-900 truncate">{value}</p>
    </div>
  );
}

export default HelperMarkStatus;