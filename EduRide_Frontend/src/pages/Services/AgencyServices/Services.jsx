import { useNavigate } from "react-router-dom";

function Services() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Agency Services</h2>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => navigate("/agency/services/buses")}
      >
        Bus Service
      </button>
    </div>
  );
}

export default Services;
