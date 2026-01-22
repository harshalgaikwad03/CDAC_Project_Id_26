import { useEffect, useState } from "react";
import API from "../../../services/api";

function BusDetails() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const agency = JSON.parse(localStorage.getItem("user"));
    if (agency?.id) {
      API.get(`/buses/agency/${agency.id}`)
        .then(res => setBuses(res.data))
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Bus Details</h2>

      {buses.length === 0 ? (
        <p>No buses found</p>
      ) : (
        <table className="border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Bus Number</th>
              <th className="border p-2">Capacity</th>
              <th className="border p-2">School</th>
              <th className="border p-2">Driver</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus.id}>
                <td className="border p-2">{bus.busNumber}</td>
                <td className="border p-2">{bus.capacity}</td>
                <td className="border p-2">
                  {bus.school ? bus.school.name : "Not Assigned"}
                </td>
                <td className="border p-2">
                  {bus.driver ? bus.driver.name : "Not Assigned"}
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
