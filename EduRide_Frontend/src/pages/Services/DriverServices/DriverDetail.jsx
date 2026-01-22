import { useEffect, useState } from "react";
import API from "../../../services/api";

function DriverDetail() {
  const [driver, setDriver] = useState(null);
  const [bus, setBus] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const user = JSON.parse(userData);
    setDriver(user);

    API.get(`/buses/driver/${user.id}`)
      .then(res => setBus(res.data))
      .catch(() => setBus(null));
  }, []);

  if (!driver) return null;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Assigned Bus Details</h2>

      {!bus ? (
        <p>No bus assigned</p>
      ) : (
        <div className="border p-4 rounded bg-gray-100 inline-block text-left">
          <p><b>Bus Number:</b> {bus.busNumber}</p>
          <p><b>Capacity:</b> {bus.capacity}</p>
          <p><b>School:</b> {bus.school?.name || "Not Assigned"}</p>
          <p><b>Agency:</b> {bus.agency?.name}</p>
        </div>
      )}
    </div>
  );
}

export default DriverDetail;
