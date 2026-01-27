// src/pages/Services/AgencyServices/AddBus.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

function AddBus() {
    const [formData, setFormData] = useState({
        busNumber: "",
        capacity: "",
        schoolId: "",
        driverId: "",
    });

    const [schools, setSchools] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const agencyId = user?.id;
                if (!agencyId) throw new Error("Agency ID not found");

                // Schools
                const schoolsRes = await API.get(`/schools/agency/${agencyId}`);
                setSchools(schoolsRes.data || []);

                // ✅ Unassigned Drivers
                const driversRes = await API.get(
                    `/drivers/agency/${agencyId}/unassigned`
                );
                setDrivers(driversRes.data || []);

            } catch (err) {
                setError("Failed to load dropdown data");
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const user = JSON.parse(localStorage.getItem("user"));

            const payload = {
                busNumber: formData.busNumber.trim(),
                capacity: Number(formData.capacity),
                school: formData.schoolId ? { id: Number(formData.schoolId) } : null,
                driver: formData.driverId ? { id: Number(formData.driverId) } : null,
                agency: { id: user.id }
            };

            await API.post("/buses", payload);

            setSuccess("Bus added successfully!");
            setTimeout(() => navigate("/agency/services/buses"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add bus");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-10">
                Add New Bus
            </h1>

            {error && <div className="text-red-600 mb-4">{error}</div>}
            {success && <div className="text-green-600 mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl space-y-6">

                <input
                    type="text"
                    name="busNumber"
                    placeholder="Bus Number"
                    value={formData.busNumber}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded"
                />

                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full p-3 border rounded"
                />

                {/* School */}
                <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                >
                    <option value="">-- Assign School (optional) --</option>
                    {schools.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.name} (ID: {s.id})
                        </option>
                    ))}
                </select>

                {/* ✅ Driver */}
                <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                >
                    <option value="">-- Assign Driver (optional) --</option>
                    {drivers.map(d => (
                        <option key={d.id} value={d.id}>
                            {d.name} ({d.licenseNumber})
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded"
                >
                    {loading ? "Adding..." : "Add Bus"}
                </button>
            </form>
        </div>
    );
}

export default AddBus;
