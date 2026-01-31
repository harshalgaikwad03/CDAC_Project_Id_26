// src/pages/Dashboards/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../../services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        color: "#DC2626"
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome, {student?.name || "Student"}
          </h1>
          <p className="text-gray-600 mt-2">
            {student?.className &&
              `Class ${student.className}`}{" "}
            • Roll No: {student?.rollNo || "N/A"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>

      {/* Payment Alert */}
      {student?.passStatus !== "ACTIVE" && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-red-700">
              ⚠️ Bus Pass Inactive
            </h3>
            <p className="text-red-600 mt-1">
              Please pay the renewal fee to activate your bus pass.
            </p>
            {paymentMsg && (
              <p className="font-bold mt-2 text-blue-700">
                {paymentMsg}
              </p>
            )}
          </div>

          <button
            onClick={handlePayFee}
            disabled={paying}
            className={`px-6 py-3 rounded-lg font-bold text-white transition ${
              paying
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {paying ? "Processing..." : "Pay Now (₹1000)"}
          </button>
        </div>
      )}

      {/* Today's Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg mb-10">
        <h2 className="text-2xl font-semibold mb-6">
          Today's Bus Status
        </h2>

        {todayStatus ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-medium">Pickup Status</h3>
              <p className="text-3xl font-bold mt-3 text-green-600">
                {todayStatus.pickupStatus || "Pending"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-medium">Updated By</h3>
              <p className="text-2xl font-semibold mt-3">
                {todayStatus.updatedByName || "Driver / Helper"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-medium">Date</h3>
              <p className="text-2xl font-semibold mt-3">
                {todayStatus.date ||
                  new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            No status recorded for today.
          </div>
        )}
      </div>

      {/* Details + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-6">Your Details</h3>
          <div className="space-y-4">
            <p><b>School:</b> {student?.schoolName || "N/A"}</p>
            <p><b>Bus:</b> {student?.assignedBusNumber || "Not Assigned"}</p>
            <p>
              <b>Pass Status:</b>{" "}
              <span
                className={`font-bold px-2 py-1 rounded ${
                  student?.passStatus === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {student?.passStatus || "N/A"}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/student/feedback")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              Feedback
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm">
        EduRide • Safe & Smart School Transportation
      </div>
    </div>
  );
}

export default StudentDashboard;
