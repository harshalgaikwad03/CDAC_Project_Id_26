import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";

function EditStudent() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    className: "",
    rollNo: "",
    email: "",
    phone: "",
    address: "",
    passStatus: "ACTIVE",
    schoolId: "",
    assignedBusId: ""
  });

  const [schools, setSchools] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentRes, schoolsRes, busesRes] = await Promise.all([
          API.get(`/students/${studentId}`),
          API.get("/schools"),
          API.get("/buses")
        ]);

        const student = studentRes.data;

        setFormData({
          name: student.name || "",
          className: student.className || "",
          rollNo: student.rollNo || "",
          email: student.email || "",
          phone: student.phone || "",
          address: student.address || "",
          passStatus: student.passStatus || "ACTIVE",
          schoolId: student.school?.id || "",
          assignedBusId: student.assignedBus?.id || ""
        });

        setSchools(schoolsRes.data || []);
        setBuses(busesRes.data || []);
      } catch (err) {
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [studentId]);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: formData.name,
      className: formData.className,
      rollNo: formData.rollNo,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      passStatus: formData.passStatus,
      school: { id: formData.schoolId },
      assignedBus: formData.assignedBusId
        ? { id: formData.assignedBusId }
        : null
    };

    try {
      await API.put(`/students/${studentId}`, payload);
      alert("Student updated successfully");
      navigate("/school/services/students");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Student</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-6 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl shadow">

        <input name="name" value={formData.name} onChange={handleChange} placeholder="Student Name" required />
        <input name="className" value={formData.className} onChange={handleChange} placeholder="Class" required />
        <input name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Roll Number" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />

        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
        <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" />

        <select name="passStatus" value={formData.passStatus} onChange={handleChange}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select name="schoolId" value={formData.schoolId} onChange={handleChange} required>
          <option value="">Select School</option>
          {schools.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select name="assignedBusId" value={formData.assignedBusId} onChange={handleChange}>
          <option value="">Assign Bus (Optional)</option>
          {buses.map(b => (
            <option key={b.id} value={b.id}>
              {b.busNumber}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 text-white rounded ${
            saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
}

export default EditStudent;


