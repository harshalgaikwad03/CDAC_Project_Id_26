import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";

function EditDriver() {
  const { driverId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: ""
  });

  useEffect(() => {
    API.get(`/drivers/${driverId}`)
      .then(res => {
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          licenseNumber: res.data.licenseNumber || ""
        });
      })
      .catch(() => alert("Failed to load driver"));
  }, [driverId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.put(`/drivers/${driverId}`, formData);
      alert("Driver updated successfully");
      navigate("/agency/services/drivers");
    } catch {
      alert("Failed to update driver");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Edit Driver</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Driver Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* License Number */}
        <div>
          <label className="block mb-1 font-medium">License Number</label>
          <input
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold">
          Update Driver
        </button>
      </form>
    </div>
  );
}

export default EditDriver;
