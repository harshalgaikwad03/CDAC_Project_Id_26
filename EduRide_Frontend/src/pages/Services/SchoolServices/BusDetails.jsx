import { useEffect, useState } from "react";
import API from "../../../services/api";

function BusDetails() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const school = JSON.parse(localStorage.getItem("user"));

    if (school?.id) {
      API.get(`/buses/school/${school.id}`)
        .then(res => setBuses(res.data))
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">School Bus Details</h2>

      {buses.length === 0 ? (
        <p>No buses assigned</p>
      ) : (
        <table className="border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Bus Number</th>
              <th className="border p-2">Capacity</th>
              <th className="border p-2">Driver</th>
              <th className="border p-2">Agency</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus.id}>
                <td className="border p-2">{bus.busNumber}</td>
                <td className="border p-2">{bus.capacity}</td>
                <td className="border p-2">
                  {bus.driver ? bus.driver.name : "Not Assigned"}
                </td>
                <td className="border p-2">
                  {bus.agency ? bus.agency.name : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BusDetails;
