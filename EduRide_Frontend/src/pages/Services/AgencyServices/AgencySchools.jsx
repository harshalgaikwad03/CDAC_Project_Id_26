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
  FaBuilding
} from "react-icons/fa";

function AgencySchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await API.get("/agencies/schools");
      setSchools(res.data);
    } catch (err) {
      console.error("Error fetching schools", err);
    } finally {
      setLoading(false);
    }
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
      const rows = schools.map((school) => [
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
      const excelData = schools.map((school) => ({
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

  const totalStudents = schools.reduce(
    (sum, school) => sum + (school.totalStudents || 0),
    0
  );
  const totalBuses = schools.reduce(
    (sum, school) => sum + (school.totalBuses || 0),
    0
  );
  const averageStudents = schools.length > 0 ? Math.round(totalStudents / schools.length) : 0;

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

        {/* HEADER */}
        

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

        {/* EXPORT BUTTONS */}
        {schools.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={handleDownloadPDF}
              disabled={exporting}
              className={`group flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium shadow-sm transition-all duration-300 ${
                exporting
                  ? "bg-gradient-to-r from-orange-400 to-amber-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 hover:shadow-md"
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

        {/* SCHOOLS TABLE/CARDS */}
        {schools.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
              <FaSchool className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Schools Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Your agency doesn't have any partner schools yet. Schools will appear here once they register with your agency.
            </p>
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
                  {schools.map((school, index) => (
                    <tr 
                      key={school.id} 
                      className={`border-t border-gray-100 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-amber-50/10 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
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
                            <div className="text-2xl font-bold text-blue-600">{school.totalStudents || 0}</div>
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
                            <div className="text-2xl font-bold text-green-600">{school.totalBuses || 0}</div>
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
                {schools.map((school) => (
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
                        <div className="text-2xl font-bold text-blue-600 mb-1">{school.totalStudents || 0}</div>
                        <div className="flex items-center justify-center gap-2">
                          <FaUsers className="text-blue-500 text-sm" />
                          <span className="text-sm text-gray-700">Students</span>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-1">{school.totalBuses || 0}</div>
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