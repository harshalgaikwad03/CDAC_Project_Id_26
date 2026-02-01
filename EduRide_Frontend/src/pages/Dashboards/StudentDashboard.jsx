// src/pages/Dashboards/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../../services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBus,
  FaSchool,
  FaIdBadge,
  FaMoneyBillWave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaComments,
  FaSpinner,
  FaArrowRight,
  FaUserCircle,
  FaCalendarDay,
  FaUserCheck,
  FaCreditCard,
  FaShieldAlt
} from "react-icons/fa";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [paying, setPaying] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const studentRes = await API.get("/students/me");
        const studentData = studentRes.data;
        setStudent(studentData);

        if (studentData?.id) {
          const statusRes = await API.get(
            `/student-status/today/${studentData.id}`
          );

          if (statusRes.status === 200) {
            setTodayStatus(statusRes.data);
          } else {
            setTodayStatus(null);
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePayFee = async () => {
    if (!student?.id) return;

    setPaying(true);
    setPaymentMsg("Opening Payment Gateway...");

    const options = {
      key: "rzp_test_S9hmol61JqVfnF",
      amount: 1000 * 100,
      currency: "INR",
      name: "EduRide School Fees",
      description: "Bus Pass Renewal Fee",
      image: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",

      handler: async function (response) {
        setPaymentMsg("Processing Transaction...");
        try {
          await axios.post(
            "http://localhost:9090/api/payment/pay",
            null,
            {
              params: {
                studentId: student.id,
                amount: 1000.0
              },
              headers: {
                Authorization: "secret123"
              }
            }
          );

          await API.put(`/students/${student.id}/activate-pass`);

          setPaymentMsg(
            "Payment Successful! Ref: " +
              response.razorpay_payment_id
          );

          setStudent((prev) => ({
            ...prev,
            passStatus: "ACTIVE"
          }));

          setTimeout(() => setPaymentMsg(null), 5000);
        } catch (err) {
          console.error("Payment save failed:", err);
          setPaymentMsg(
            "Payment succeeded but failed to save record."
          );
        }
      },

      prefill: {
        name: student?.name || "Student",
        contact: "9999999999",
        email: student?.email || "student@eduride.com"
      },
      theme: {
        color: "#2563EB"
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      setPaymentMsg(
        "❌ Payment Failed: " + response.error.description
      );
    });

    rzp.open();
    setPaying(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50/50 to-cyan-50/50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mb-6">
          <FaSpinner className="text-blue-600 text-2xl animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Dashboard...</h3>
        <p className="text-gray-500">Fetching your student details</p>
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50/50 to-cyan-50/50">
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

  const isPassActive = student?.passStatus === "ACTIVE";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-cyan-50/50 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          
          <div className="p-6 sm:p-8 lg:p-10">
            {/* ===== HEADER ===== */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                  <FaUserCircle className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Welcome, <span className="text-blue-600">{student?.name || "Student"}</span>
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <FaIdBadge />
                      Class {student?.className || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                      Roll No: {student?.rollNo || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* ===== BUS PASS ALERT ===== */}
            {!isPassActive && (
              <div className="bg-gradient-to-r from-red-50/80 to-amber-50/40 rounded-2xl p-6 mb-10 border border-red-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center">
                      <FaExclamationTriangle className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-700 mb-1">
                        Bus Pass Inactive
                      </h3>
                      <p className="text-red-600">
                        Please pay the renewal fee to activate your bus pass and continue using transport services.
                      </p>
                      {paymentMsg && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                          <p className="font-medium text-blue-700">{paymentMsg}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handlePayFee}
                    disabled={paying}
                    className={`group flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-bold text-white transition-all duration-300 shadow-sm ${
                      paying
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 hover:shadow-md"
                    }`}
                  >
                    <FaCreditCard />
                    <span>{paying ? "Processing..." : "Pay Now (₹1000)"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ===== TODAY STATUS ===== */}
            <div className="bg-gradient-to-br from-white to-blue-50/50 p-8 rounded-2xl shadow-sm border border-blue-200 mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                  <FaBus className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Today's Bus Status
                  </h2>
                  <p className="text-gray-600">
                    Your pickup/drop status for today's bus journey
                  </p>
                </div>
              </div>

              {todayStatus ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatusCard
                    title="Pickup Status"
                    value={todayStatus.pickupStatus || "Pending"}
                    icon={<FaUserCheck className="text-2xl" />}
                    color="from-green-500 to-emerald-500"
                    bgColor="from-green-50/50 to-emerald-50/30"
                    borderColor="border-green-200"
                  />
                  <StatusCard
                    title="Updated By"
                    value={todayStatus.updatedByName || "Driver / Helper"}
                    icon={<FaUserCircle className="text-2xl" />}
                    color="from-blue-500 to-cyan-500"
                    bgColor="from-blue-50/50 to-cyan-50/30"
                    borderColor="border-blue-200"
                  />
                  <StatusCard
                    title="Date"
                    value={todayStatus.date || new Date().toLocaleDateString()}
                    icon={<FaCalendarDay className="text-2xl" />}
                    color="from-purple-500 to-pink-500"
                    bgColor="from-purple-50/50 to-pink-50/30"
                    borderColor="border-purple-200"
                  />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-amber-50/80 to-yellow-50/40 rounded-2xl p-6 border border-amber-200 text-center">
                  <FaExclamationTriangle className="text-amber-600 text-3xl mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-amber-700 mb-1">
                    No Status Recorded Today
                  </h3>
                  <p className="text-amber-600">
                    Your status hasn't been updated yet. Check back later.
                  </p>
                </div>
              )}
            </div>

            {/* ===== DETAILS & ACTIONS ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Student Details Card */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                    <FaSchool className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Your Details
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Registered school and transport information
                    </p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <DetailItem
                    label="School"
                    value={student?.schoolName || "Not Available"}
                  />
                  <DetailItem
                    label="Assigned Bus"
                    value={student?.assignedBusNumber || "Not Assigned"}
                  />
                  <div className="pt-4 border-t border-gray-100">
                    <DetailItem
                      label="Bus Pass Status"
                      value={
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                          isPassActive
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                            : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700"
                        }`}>
                          {isPassActive ? (
                            <>
                              <FaCheckCircle />
                              ACTIVE
                            </>
                          ) : (
                            <>
                              <FaExclamationTriangle />
                              INACTIVE
                            </>
                          )}
                        </span>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center">
                    <FaShieldAlt className="text-cyan-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Quick Actions
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Need help or want to share feedback?
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => navigate("/feedback")}
                    className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <FaComments />
                    <span>Give Feedback</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/30 rounded-xl p-4 border border-blue-200 mt-6">
                    <p className="text-sm text-gray-700 text-center">
                      Your feedback helps us improve the student transportation experience
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
              <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <span>EduRide • Safe & Smart School Transportation</span>
                <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>© {new Date().getFullYear()} All Rights Reserved</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- STATUS CARD COMPONENT ---------- */
function StatusCard({ title, value, icon, color, bgColor, borderColor }) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} p-6 rounded-2xl shadow-sm border ${borderColor} hover:shadow-md transition-all duration-300`}>
      <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 text-center mb-2">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 text-center">
        {value}
      </p>
    </div>
  );
}

/* ---------- DETAIL ITEM COMPONENT ---------- */
function DetailItem({ label, value }) {
  return (
    <div className="flex items-start justify-between py-2">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default StudentDashboard;