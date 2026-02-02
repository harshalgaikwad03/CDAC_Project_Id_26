import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
    FaSchool,
    FaUsers,
    FaBus,
    FaTrash,
    FaInfoCircle,
    FaSpinner,
    FaArrowLeft,
    FaChartLine,
    FaUserGraduate,
    FaExclamationTriangle,
    FaFilePdf,
    FaFileExcel,
    FaDownload,
    FaBuilding,
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaSync,
    FaChartBar
} from "react-icons/fa";

// Sort options
const SORT_OPTIONS = [
    { value: "name", label: "School Name" },
    { value: "totalStudents", label: "Students Count" },
    { value: "totalBuses", label: "Buses Count" }
];

// Filter options
const FILTER_OPTIONS = [
    { value: "ALL", label: "All Schools" },
    { value: "WITH_STUDENTS", label: "With Students" },
    { value: "WITHOUT_STUDENTS", label: "Without Students" },
    { value: "WITH_BUSES", label: "With Buses" },
    { value: "WITHOUT_BUSES", label: "Without Buses" }
];

function AgencySchools() {
    const [schools, setSchools] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [sortBy, setSortBy] = useState("name");
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchSchools();
    }, []);

    useEffect(() => {
        // Apply search, filter, and sort whenever dependencies change
        let result = schools;
        
        // Apply search filter
        if (searchTerm) {
            result = result.filter(school =>
                school.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply status filter
        if (filterStatus === "WITH_STUDENTS") {
            result = result.filter(school => school.totalStudents > 0);
        } else if (filterStatus === "WITHOUT_STUDENTS") {
            result = result.filter(school => school.totalStudents === 0);
        } else if (filterStatus === "WITH_BUSES") {
            result = result.filter(school => school.totalBuses > 0);
        } else if (filterStatus === "WITHOUT_BUSES") {
            result = result.filter(school => school.totalBuses === 0);
        }
        
        // Apply sorting
        result = [...result].sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "totalStudents") return (b.totalStudents || 0) - (a.totalStudents || 0);
            if (sortBy === "totalBuses") return (b.totalBuses || 0) - (a.totalBuses || 0);
            return 0;
        });
        
        setFilteredSchools(result);
    }, [schools, searchTerm, filterStatus, sortBy]);

    const fetchSchools = async () => {
        try {
            if (!isRefreshing) setLoading(true);
            const res = await API.get("/agencies/schools");
            setSchools(res.data);
            setFilteredSchools(res.data);
        } catch (err) {
            console.error("Error fetching schools", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchSchools();
    };

    const deleteSchool = async (schoolId) => {
        if (
            !window.confirm(
                "Are you sure you want to release this school from your agency? This action cannot be undone."
            )
        )
            return;

        try {
            await API.put(`/agencies/schools/${schoolId}/release`);
            setSchools((prev) => prev.filter((s) => s.id !== schoolId));
        } catch {
            alert("Failed to release school");
        }
    };

    /* ================= EXPORT PDF ================= */
    const handleDownloadPDF = async () => {
        setExporting(true);
        try {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text("Agency – School Report", 14, 20);

            const columns = ["School Name", "Total Students", "Assigned Buses"];
            const rows = filteredSchools.map((school) => [
                school.name,
                school.totalStudents || 0,
                school.totalBuses || 0,
            ]);

            autoTable(doc, {
                head: [columns],
                body: rows,
                startY: 30,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [249, 115, 22] },
            });

            doc.save("agency_schools_report.pdf");
        } finally {
            setExporting(false);
        }
    };

    /* ================= EXPORT EXCEL ================= */
    const handleDownloadExcel = async () => {
        setExporting(true);
        try {
            const excelData = filteredSchools.map((school) => ({
                "School Name": school.name,
                "Total Students": school.totalStudents || 0,
                "Assigned Buses": school.totalBuses || 0,
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Schools");
            XLSX.writeFile(workbook, "agency_schools_report.xlsx");
        } finally {
            setExporting(false);
        }
    };

    const totalStudents = schools.reduce(
        (sum, school) => sum + (school.totalStudents || 0),
        0
    );
    const totalBuses = schools.reduce(
        (sum, school) => sum + (school.totalBuses || 0),
        0
    );
    const schoolsWithStudents = schools.filter(school => school.totalStudents > 0).length;
    const schoolsWithBuses = schools.filter(school => school.totalBuses > 0).length;

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center mb-6">
                    <FaSpinner className="text-orange-600 text-2xl animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Schools...</h3>
                <p className="text-gray-500">Fetching partner school details</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/agency/services")}
                    className="group flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Services</span>
                </button>

                {/* INFO NOTE */}
                <div className="bg-gradient-to-r from-orange-50/80 to-amber-50/40 rounded-2xl p-5 mb-8 border border-orange-200">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                            <FaExclamationTriangle className="text-white text-lg" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-orange-800 mb-1">Important Notice</h4>
                            <p className="text-sm text-orange-700">
                                Releasing a school removes it from your agency permanently. This action cannot be undone.
                                Please ensure all buses and students are reassigned before proceeding.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/40 rounded-2xl p-6 border border-orange-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                                <FaBuilding className="text-orange-600 text-xl" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-orange-600">{schools.length}</div>
                                <div className="text-sm text-gray-700">Total Schools</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/40 rounded-2xl p-6 border border-blue-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                                <FaUserGraduate className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
                                <div className="text-sm text-gray-700">Total Students</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/40 rounded-2xl p-6 border border-green-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                                <FaBus className="text-green-600 text-xl" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">{totalBuses}</div>
                                <div className="text-sm text-gray-700">Total Buses</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== SEARCH, FILTER, SORT CONTROLS ===== */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">School Management</h3>
                            <p className="text-gray-600 text-sm">Search, filter, and manage partner schools</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by school name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
                                />
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Filter Options */}
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 appearance-none bg-white"
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
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 appearance-none bg-white"
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
                            Showing {filteredSchools.length} of {schools.length} schools
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
                                className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                

                {/* EXPORT BUTTONS */}
                {filteredSchools.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-10 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">Export Reports</h3>
                            <p className="text-sm text-gray-600">Download complete School details for records</p>
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

                {/* SCHOOLS TABLE/CARDS */}
                {filteredSchools.length === 0 ? (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-sm border border-gray-200">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
                            <FaSchool className="text-gray-400 text-4xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">
                            {schools.length === 0 ? "No Schools Found" : "No Matching Schools Found"}
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-8">
                            {schools.length === 0 
                                ? "Your agency doesn't have any partner schools yet. Schools will appear here once they register with your agency."
                                : "Try adjusting your search or filter criteria to find schools."}
                        </p>
                        {(searchTerm || filterStatus !== "ALL" || sortBy !== "name") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterStatus("ALL");
                                    setSortBy("name");
                                }}
                                className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 mr-4"
                            >
                                <span>Clear Filters</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>

                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <th className="px-8 py-5 text-left">
                                            <div className="flex items-center gap-3">
                                                <FaSchool className="text-orange-500" />
                                                <span className="font-semibold text-gray-700">School Name</span>
                                            </div>
                                        </th>
                                        <th className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <FaUsers className="text-blue-500" />
                                                <span className="font-semibold text-gray-700">Students</span>
                                            </div>
                                        </th>
                                        <th className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <FaBus className="text-green-500" />
                                                <span className="font-semibold text-gray-700">Assigned Buses</span>
                                            </div>
                                        </th>
                                        <th className="px-8 py-5 text-center">
                                            <span className="font-semibold text-gray-700">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSchools.map((school, index) => (
                                        <tr
                                            key={school.id}
                                            className={`border-t border-gray-100 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-amber-50/10 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                                }`}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                                                        <FaSchool className="text-orange-600 text-lg" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-lg">{school.name}</h4>
                                                        <p className="text-sm text-gray-500 mt-1">Partner School</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className={`text-2xl font-bold ${school.totalStudents > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                            {school.totalStudents || 0}
                                                        </div>
                                                        <div className="flex items-center justify-center gap-2 mt-1">
                                                            <FaUserGraduate className="text-blue-500 text-sm" />
                                                            <span className="text-xs text-gray-500">Students</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className={`text-2xl font-bold ${school.totalBuses > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                            {school.totalBuses || 0}
                                                        </div>
                                                        <div className="flex items-center justify-center gap-2 mt-1">
                                                            <FaBus className="text-green-500 text-sm" />
                                                            <span className="text-xs text-gray-500">Buses</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => deleteSchool(school.id)}
                                                        className="group flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                                                    >
                                                        <FaTrash />
                                                        <span>Release</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden p-6">
                            <div className="space-y-6">
                                {filteredSchools.map((school) => (
                                    <div
                                        key={school.id}
                                        className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl shadow-lg border border-orange-100 p-6"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                                                    <FaSchool className="text-orange-600 text-xl" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{school.name}</h4>
                                                    <p className="text-sm text-gray-500">Partner School</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center border border-blue-200">
                                                <div className={`text-2xl font-bold mb-1 ${school.totalStudents > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                    {school.totalStudents || 0}
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    <FaUsers className="text-blue-500 text-sm" />
                                                    <span className="text-sm text-gray-700">Students</span>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200">
                                                <div className={`text-2xl font-bold mb-1 ${school.totalBuses > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {school.totalBuses || 0}
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    <FaBus className="text-green-500 text-sm" />
                                                    <span className="text-sm text-gray-700">Buses</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => deleteSchool(school.id)}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                                        >
                                            <FaTrash />
                                            <span>Release School</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-gray-100">
                    <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <span>© {new Date().getFullYear()} EduRide — Agency School Management</span>
                        <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>All Rights Reserved</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AgencySchools;