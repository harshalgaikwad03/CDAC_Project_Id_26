import { useEffect, useState } from "react";
import API from "../../../services/api";

function StudentDetail() {
  const [student, setStudent] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        // Fetch current student's full profile (no ID needed in URL)
        const studentRes = await API.get("/students/me");
        const currentStudent = studentRes.data;
        setStudent(currentStudent);

        // Fetch today's status using the ID from the response
        if (currentStudent?.id) {
          const statusRes = await API.get(`/student-status/today/${currentStudent.id}`);
          setTodayStatus(statusRes.data || null);
        } else {
          throw new Error("No student ID returned");
        }
      } catch (err) {
        console.error("Error loading student data:", err);
        let msg = "Failed to load profile. Please try again.";
        if (err.response?.status === 403) {
          msg = "Access denied (403). Check if you are logged in as STUDENT.";
        } else if (err.response?.status === 404) {
          msg = "Student profile not found.";
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading your profile...</div>;
  }

  if (error || !student) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        {error || "Could not load student information"}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Student Dashboard</h2>

      <div className="bg-white border rounded-xl shadow p-6 space-y-4">
        <p><b>Name:</b> {student.name || "—"}</p>
        <p><b>Roll Number:</b> {student.rollNo || "—"}</p>
        <p>
          <b>School:</b>{" "}
          {student.school?.name || student.schoolName || "Not Assigned"}
        </p>
        <p><b>Pass Status:</b> {student.passStatus || "—"}</p>
        <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
        <p>
          <b>Pickup Status:</b> {todayStatus?.pickupStatus || "Not Updated"}
        </p>
      </div>
    </div>
  );
}

export default StudentDetail;