import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";

function EditSchool() {
  const navigate = useNavigate();

  const [school, setSchool] = useState({
    id: null,
    name: "",
    phone: "",
    email: "",
    address: "",
    agency: null,
  });

  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchool();
  }, []);

  const loadSchool = async () => {
    try {
      const res = await API.get("/schools/me");
      setSchool(res.data);

      // Fetch agencies ONLY if school has no agency
      if (!res.data.agency) {
        const agencyRes = await API.get("/agencies");
        setAgencies(agencyRes.data);
      }
    } catch (err) {
      alert("Failed to load school profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSchool({
      ...school,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/schools/${school.id}`, school);
      alert("School updated successfully");
      navigate("/school/services");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Update School Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 space-y-5"
      >
        <input
          type="text"
          name="name"
          value={school.name}
          onChange={handleChange}
          placeholder="School Name"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <input
          type="text"
          name="phone"
          value={school.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <input
          type="email"
          name="email"
          value={school.email || ""}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          type="text"
          name="address"
          value={school.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        {/* ✅ AGENCY DROPDOWN – ONLY IF NOT ASSIGNED */}
        {!school.agency && (
          <select
            className="w-full border rounded-lg px-4 py-3"
            required
            onChange={(e) =>
              setSchool({
                ...school,
                agency: { id: Number(e.target.value) }, // ✅ CRITICAL FIX
              })
            }
          >
            <option value="">Select Agency</option>
            {agencies.map((agency) => (
              <option key={agency.id} value={agency.id}>
                {agency.name}
              </option>
            ))}
          </select>
        )}

        {/* 🔒 SHOW ASSIGNED AGENCY (READ-ONLY) */}
        {school.agency && (
          <div className="text-sm text-gray-600 text-center">
            Assigned Agency: <b>{school.agency.name}</b>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg"
        >
          Update School
        </button>
      </form>
    </div>
  );
}

export default EditSchool;
