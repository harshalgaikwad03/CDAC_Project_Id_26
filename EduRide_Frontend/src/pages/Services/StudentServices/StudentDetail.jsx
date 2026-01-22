import { useEffect, useState } from "react";
import API from "../../../services/api";

function StudentDetail() {
  const [student, setStudent] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const user = JSON.parse(userData);
    setStudent(user);

    API.get(`/student-status/today/${user.id}`)
      .then(res => setTodayStatus(res.data))
      .catch(() => setTodayStatus(null));
  }, []);

  if (!student) return null;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Student Details</h2>

      <div className="border p-4 rounded bg-gray-100 inline-block text-left">
        <p><b>Name:</b> {student.name}</p>
        <p><b>Roll Number:</b> {student.rollNo}</p>
        <p><b>School:</b> {student.school?.name || "Not Assigned"}</p>
        <p><b>Pass Status:</b> {student.passStatus}</p>
        <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
        <p><b>Pickup Status:</b> {todayStatus?.pickupStatus || "Not Updated"}</p>
      </div>
    </div>
  );
}

export default StudentDetail;
