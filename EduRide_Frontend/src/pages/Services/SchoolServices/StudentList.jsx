import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FaUserGraduate,
  FaBus,
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaFileExcel,
  FaInfoCircle,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaGraduationCap,
  FaPhone,
  FaEnvelope,
  FaIdBadge,
  FaUserCheck,
  FaExclamationTriangle,
  FaDownload,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSync,
  FaChartBar,
  FaUsers,
  FaCheckCircle
} from "react-icons/fa";

// Status options for filtering
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active", color: "green", bg: "bg-green-100", text: "text-green-800", border: "border-green-400" },
  { value: "INACTIVE", label: "Inactive", color: "red", bg: "bg-red-100", text: "text-red-800", border: "border-red-400" },
];

// Sort options
const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "className", label: "Class" },
  { value: "rollNo", label: "Roll No" },
  { value: "passStatus", label: "Status" },
  { value: "assignedBusNumber", label: "Bus" }
];

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("name");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Apply search, filter, and sort whenever dependencies change
    let result = students;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.className && student.className.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.phone && student.phone.includes(searchTerm))
      );
    }
    
    // Apply status filter
    if (filterStatus !== "ALL") {
      result = result.filter(student => student.passStatus === filterStatus);
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "className") return (a.className || "").localeCompare(b.className || "");
      if (sortBy === "rollNo") return (a.rollNo || "").localeCompare(b.rollNo || "");
      if (sortBy === "passStatus") return (a.passStatus || "").localeCompare(b.passStatus || "");
      if (sortBy === "assignedBusNumber") return (a.assignedBusNumber || "").localeCompare(b.assignedBusNumber || "");
      return 0;
    });
    
    setFilteredStudents(result);
  }, [students, searchTerm, filterStatus, sortBy]);

  const fetchStudents = async () => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);
      
      const res = await API.get("/students/school/me");
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStudents();
  };

  // 🗑️ DELETE STUDENT
  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/students/${studentId}`);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete student");
    }
  };

  // 🖨️ PDF DOWNLOAD
  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Student List Report", 14, 20);

      const columns = [
        "Name",
        "Email",
        "Roll No",
        "Class",
        "Phone",
        "Bus",
        "Pass Status",
      ];

      const rows = filteredStudents.map((s) => [
        s.name,
        s.email,
        s.rollNo || "-",
        s.className || "-",
        s.phone || "-",
        s.assignedBusNumber || "Not Assigned",
        s.passStatus,
      ]);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 30,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [22, 160, 133] },
      });

      doc.save("students_list.pdf");
    } finally {
      setExporting(false);
    }
  };

  // 📊 EXCEL DOWNLOAD
  const handleDownloadExcel = async () => {
    setExporting(true);
    try {
      const excelData = filteredStudents.map((s) => ({
        Name: s.name,
        Email: s.email,
        "Roll No": s.rollNo || "-",
        Class: s.className || "-",
        Phone: s.phone || "-",
        Bus: s.assignedBusNumber || "Not Assigned",
        "Pass Status": s.passStatus,
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      XLSX.writeFile(workbook, "students_list.xlsx");
    } finally {
      setExporting(false);
    }
  };

  const activeStudents = students.filter(s => s.passStatus === "ACTIVE");
  const inactiveStudents = students.filter(s => s.passStatus !== "ACTIVE");
  const assignedStudents = students.filter(s => s.assignedBusNumber);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mb-6">
          <FaSpinner className="text-blue-600 text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Students...</h3>
        <p className="text-gray-500">Fetching student records</p>
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
          onClick={() => navigate("/school/services")}
          className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Services</span>
        </button>

        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-6"></div>

          {/* ===== INFO NOTE ===== */}
        <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/40 rounded-2xl p-5 mb-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <FaInfoCircle className="text-white text-lg" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Student Pass Status</h4>
              <p className="text-sm text-blue-700">
                Student pass status indicates whether the student is allowed to
                use bus transportation. Keep records updated for smooth operations.
              </p>
            </div>
          </div>
        </div>

        
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <span className="font-medium text-gray-700">Total Students: </span>
              <span className="font-bold text-blue-600">{students.length}</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <span className="font-medium text-gray-700">Active Pass: </span>
              <span className="font-bold text-green-600">{activeStudents.length}</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <span className="font-medium text-gray-700">Bus Assigned: </span>
              <span className="font-bold text-amber-600">{assignedStudents.length}</span>
            </div>
          </div>
        </div>

        {/* ===== SEARCH, FILTER, SORT CONTROLS ===== */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Management</h3>
              <p className="text-gray-600 text-sm">Search, filter, and sort student records</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, roll no, class, or phone..."
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
                  <option value="className">Sort by Class</option>
                  <option value="rollNo">Sort by Roll No</option>
                  <option value="passStatus">Sort by Status</option>
                  <option value="assignedBusNumber">Sort by Bus</option>
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
              {filterStatus !== "ALL" && ` with status: ${STATUS_OPTIONS.find(s => s.value === filterStatus)?.label}`}
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
        {filteredStudents.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-10 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Export Reports</h3>
              <p className="text-sm text-gray-600">Download complete Student details for records</p>
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

        {/* ===== STUDENT CARDS/TABLE ===== */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
              <FaUserGraduate className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              {students.length === 0 ? "No Students Found" : "No Matching Students Found"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {students.length === 0 
                ? "Your school doesn't have any registered students yet. Add students to manage transportation."
                : "Try adjusting your search or filter criteria to find students."}
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
              onClick={() => navigate("/school/services")}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Services</span>
            </button>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-8 py-5 text-left">
                      <div className="flex items-center gap-3">
                        <FaUserGraduate className="text-blue-500" />
                        <span className="font-semibold text-gray-700">Student</span>
                      </div>
                    </th>
                    <th className="px-8 py-5 text-left">
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-gray-500" />
                        <span className="font-semibold text-gray-700">Email</span>
                      </div>
                    </th>
                    <th className="px-8 py-5 text-left">
                      <div className="flex items-center gap-3">
                        <FaIdBadge className="text-purple-500" />
                        <span className="font-semibold text-gray-700">Class Info</span>
                      </div>
                    </th>
                    <th className="px-8 py-5 text-left">
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-green-500" />
                        <span className="font-semibold text-gray-700">Contact</span>
                      </div>
                    </th>
                    <th className="px-8 py-5 text-left">
                      <div className="flex items-center gap-3">
                        <FaBus className="text-amber-500" />
                        <span className="font-semibold text-gray-700">Bus</span>
                      </div>
                    </th>
                    <th className="px-8 py-5 text-left">
                      <div className="flex items-center gap-3">
                        <FaUserCheck className="text-emerald-500" />
                        <span className="font-semibold text-gray-700">Pass Status</span>
                      </div>
                    </th>
                    <th className="px-8 py-5 text-left">
                      <span className="font-semibold text-gray-700">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => {
                    const statusConfig = STATUS_OPTIONS.find(s => s.value === student.passStatus) || 
                                         { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-400" };
                    
                    return (
                      <tr
                        key={student.id}
                        className={`border-t border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-cyan-50/10 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                              <FaUserGraduate className="text-blue-600 text-lg" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{student.name}</h4>
                              <p className="text-sm text-gray-500">Student ID: {student.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400 text-sm" />
                            <span className="text-gray-900 font-medium">{student.email}</span>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FaGraduationCap className="text-purple-400 text-sm" />
                              <span className="text-gray-900 font-medium">Class {student.className || "-"}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Roll No: {student.rollNo || "N/A"}
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-green-400 text-sm" />
                            <span className="text-gray-900 font-medium">{student.phone || "Not Provided"}</span>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <FaBus className="text-amber-400 text-sm" />
                            <span className={`font-medium ${student.assignedBusNumber ? "text-gray-900" : "text-gray-500"
                              }`}>
                              {student.assignedBusNumber || "Not Assigned"}
                            </span>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                          >
                            <FaUserCheck className="text-sm" />
                            {student.passStatus}
                          </span>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => navigate(`/school/services/students/edit/${student.id}`)}
                              className="group flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <FaEdit />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDelete(student.id)}
                              className="group flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <FaTrash />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-6">
              <div className="space-y-6">
                {filteredStudents.map((student) => {
                  const statusConfig = STATUS_OPTIONS.find(s => s.value === student.passStatus) || 
                                       { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-400" };
                  
                  return (
                    <div
                      key={student.id}
                      className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-lg border border-blue-100 p-6"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                            <FaUserGraduate className="text-blue-600 text-xl" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{student.name}</h4>
                            <p className="text-sm text-gray-500">Class {student.className || "-"}</p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-xs ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                        >
                          {student.passStatus}
                        </span>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-gray-400" />
                          <span className="text-gray-700">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaIdBadge className="text-purple-400" />
                          <span className="text-gray-700">Roll No: {student.rollNo || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaPhone className="text-green-400" />
                          <span className="text-gray-700">{student.phone || "Not Provided"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaBus className="text-amber-400" />
                          <span className="text-gray-700">{student.assignedBusNumber || "Not Assigned"}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/school/services/students/edit/${student.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(student.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <FaTrash />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {/* <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>School Student Management • EduRide</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default StudentList;