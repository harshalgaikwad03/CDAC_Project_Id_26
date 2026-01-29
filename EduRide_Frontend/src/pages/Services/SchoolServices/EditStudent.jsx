import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";

function EditStudent() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500";

  const readOnlyClass =
    inputClass + " bg-gray-100 cursor-not-allowed";

  const [formData, setFormData] = useState({
    name: "",
    className: "",
    rollNo: "",
    email: "",
    phone: "",
    address: "",
    passStatus: "ACTIVE",
    schoolName: "",
    assignedBusId: ""
  });

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Load student (school is already fixed)
        const studentRes = await API.get(`/students/${studentId}`);
        const student = studentRes.data;

        setFormData({
          name: student.name ?? "",
          className: student.className ?? "",
          rollNo: student.rollNo ?? "",
          email: student.email ?? "",
          phone: student.phone ?? "",
          address: student.address ?? "",
          passStatus: student.passStatus ?? "ACTIVE",
          
          assignedBusId: student.assignedBus?.id ?? ""
        });

        // 2️⃣ Load buses of logged-in school
        const busesRes = await API.get("/buses/school/me");
        setBuses(Array.isArray(busesRes.data) ? busesRes.data : []);

      } catch (err) {
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [studentId]);

  /* ---------------- CHANGE ---------------- */
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: formData.name,
      className: formData.className,
      rollNo: formData.rollNo,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      passStatus: formData.passStatus,
       
      assignedBus: formData.assignedBusId
        ? { id: formData.assignedBusId }
        : null
      
    };

    try {
      await API.put(`/students/${studentId}`, payload);
      alert("Student updated successfully");
      navigate("/school/services/students");
    } catch {
      setError("Update failed");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading student...</div>;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Student</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-xl shadow">

        <input className={inputClass} name="name" value={formData.name} onChange={handleChange} placeholder="Student Name" />
        <input className={inputClass} name="className" value={formData.className} onChange={handleChange} placeholder="Class" />
        <input className={inputClass} name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Roll Number" />
        <input className={inputClass} name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input className={inputClass} name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
        <textarea className={inputClass} name="address" value={formData.address} onChange={handleChange} placeholder="Address" />

    


        <select className={inputClass} name="passStatus" value={formData.passStatus} onChange={handleChange}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select className={inputClass} name="assignedBusId" value={formData.assignedBusId} onChange={handleChange}>
          <option value="">Assign Bus (Optional)</option>
          {buses.map(b => (
            <option key={b.id} value={b.id}>{b.busNumber}</option>
          ))}
        </select>

        <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditStudent;
