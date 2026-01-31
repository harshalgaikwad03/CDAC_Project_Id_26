import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ─────────────────────────────────────────────
  // Load drivers for logged-in agency
  // ─────────────────────────────────────────────
  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const res = await API.get("/drivers/agency/me");
      setDrivers(res.data);
    } catch {
      alert("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Unassign driver from bus (kept as-is)
  // ─────────────────────────────────────────────
  const unassignDriver = async (busId) => {
    try {
      await API.put(`/buses/${busId}/unassign-driver`);
      alert("Driver unassigned from bus");
      loadDrivers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unassign driver");
    }
  };

  // ─────────────────────────────────────────────
  // Delete driver with AUTO-UNASSIGN FLOW
  // ─────────────────────────────────────────────
  const handleDelete = async (driver) => {

    // 🔴 CASE 1: Driver assigned to bus → auto unassign flow
    if (driver.busId) {
      const confirmUnassign = window.confirm(
        "This driver is assigned to a bus.\n\nDo you want to unassign the bus and delete the driver?"
      );

      if (!confirmUnassign) return;

      try {
        // 1️⃣ Unassign driver
        await API.put(`/buses/${driver.busId}/unassign-driver`);

        // 2️⃣ Confirm delete
        const confirmDelete = window.confirm(
          "Driver unassigned successfully.\n\nDo you want to delete the driver now?"
        );

        if (!confirmDelete) {
          loadDrivers();
          return;
        }

        // 3️⃣ Delete driver
        await API.delete(`/drivers/${driver.id}`);
        alert("Driver deleted successfully");

        loadDrivers();
        return;

      } catch (err) {
        alert(err.response?.data?.message || "Operation failed");
        return;
      }
    }

    // 🟢 CASE 2: Driver NOT assigned → normal delete
    if (!window.confirm("Delete this driver?")) return;

    try {
      await API.delete(`/drivers/${driver.id}`);
      alert("Driver deleted successfully");
      loadDrivers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Drivers</h1>
      </div>

      {drivers.length === 0 ? (
        <p className="text-center text-gray-600">No drivers found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drivers.map((d) => (
            <div
              key={d.id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold mb-2">{d.name}</h3>

              <p>📞 {d.phone}</p>
              <p>🪪 {d.licenseNumber}</p>

              <p className="mt-2">
                🚌 Bus: {d.busNumber || "Not Assigned"}
              </p>
              <p>
                🏫 School: {d.schoolName || "Not Assigned"}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() =>
                    navigate(`/agency/services/edit-driver/${d.id}`)
                  }
                  className="bg-yellow-600 text-white py-2 rounded-lg"
                >
                  Edit
                </button>

                {d.busId && (
                  <button
                    onClick={() => unassignDriver(d.busId)}
                    className="bg-orange-600 text-white py-2 rounded-lg"
                  >
                    Unassign from Bus
                  </button>
                )}

                <button
                  onClick={() => handleDelete(d)}
                  className="bg-red-600 text-white py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DriverList;
