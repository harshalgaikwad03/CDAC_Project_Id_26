import { useEffect, useState } from "react";
import API from "../../services/api";

function BusSignup() {
  const [form, setForm] = useState({
    busNumber: "",
    capacity: "",
    agencyId: "",
    schoolId: "",
    driverId: ""
  });

  const [agencies, setAgencies] = useState([]);
  const [schools, setSchools] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    API.get("/agencies").then(res => setAgencies(res.data));
    API.get("/schools").then(res => setSchools(res.data));
    API.get("/drivers").then(res => setDrivers(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      await API.post("/buses", {
        busNumber: form.busNumber,
        capacity: form.capacity,
        agency: { id: form.agencyId },
        school: { id: form.schoolId },
        driver: { id: form.driverId }
      });
      alert("Bus registered successfully!"); // Added user feedback
    } catch (error) {
      console.error("Registration failed", error);
      alert("Failed to register bus.");
    }
  };

  // Shared styling for Inputs and Selects to ensure perfect matching
  const inputClass = "appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header Section */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Bus Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Add a new vehicle to the transport fleet
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bus Number */}
            <div>
              <label className={labelClass}>Bus Number</label>
              <input 
                name="busNumber" 
                placeholder="e.g. MH-12-AB-1234" 
                className={inputClass}
                onChange={handleChange} 
              />
            </div>

            {/* Capacity */}
            <div>
              <label className={labelClass}>Seating Capacity</label>
              <input 
                name="capacity" 
                type="number"
                placeholder="e.g. 40" 
                className={inputClass}
                onChange={handleChange} 
              />
            </div>

            {/* Agency Selection */}
            <div>
              <label className={labelClass}>Transport Agency</label>
              <select name="agencyId" className={inputClass} onChange={handleChange}>
                <option value="">Select Agency</option>
                {agencies.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {/* School Selection */}
            <div>
              <label className={labelClass}>Assigned School</label>
              <select name="schoolId" className={inputClass} onChange={handleChange}>
                <option value="">Select School</option>
                {schools.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Driver Selection - Spans Full Width */}
            <div className="col-span-1 md:col-span-2">
              <label className={labelClass}>Assign Driver</label>
              <select name="driverId" className={inputClass} onChange={handleChange}>
                <option value="">Select Driver</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Submit Button */}
          <div>
            <button 
              onClick={submit} 
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Register Bus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusSignup;