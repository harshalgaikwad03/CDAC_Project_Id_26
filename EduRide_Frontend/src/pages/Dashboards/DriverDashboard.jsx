import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ROUTES = {
  HOME_TO_SCHOOL: "HOME_TO_SCHOOL",
  SCHOOL_TO_HOME: "SCHOOL_TO_HOME",
};

function DriverDashboard() {
  const [summary, setSummary] = useState(null);
  const [route, setRoute] = useState(ROUTES.HOME_TO_SCHOOL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/drivers/dashboard/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Driver dashboard error:", err);

      const status = err.response?.status;

      // ✅ Treat 403 & 409 as "no dashboard data"
      if (status === 403 || status === 409) {
        setSummary(null);
      } else {
        setError("Failed to load driver dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Loading dashboard...
      </div>
    );
  }

  /* ---------------- REAL ERROR ---------------- */
  if (error) {
    return (
      <div className="text-center py-20 text-red-600 text-lg font-semibold">
        {error}
      </div>
    );
  }

  /* ---------------- NO DATA (403 / 409) ---------------- */
  if (!summary) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p className="text-lg font-medium">No dashboard data available.</p>
        <p className="text-sm mt-2">
          Bus may not be assigned yet. Please contact your agency.
        </p>
      </div>
    );
  }

  /* ---------------- DERIVED VALUES ---------------- */
  const totalStudents = summary.totalStudents ?? 0;

  const pickedCount =
    route === ROUTES.HOME_TO_SCHOOL
      ? summary.pickedHomeToSchool ?? 0
      : summary.droppedSchoolToHome ?? 0;

  const remainingCount = Math.max(totalStudents - pickedCount, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">
        Driver Dashboard
      </h1>

      {/* Bus Info */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 text-center">
        <h2 className="text-2xl font-semibold">
          Bus Number:{" "}
          <span className="text-blue-600">
            {summary.busNumber}
          </span>
        </h2>
      </div>

      {/* Route Toggle */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setRoute(ROUTES.HOME_TO_SCHOOL)}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            route === ROUTES.HOME_TO_SCHOOL
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Home → School
        </button>

        <button
          onClick={() => setRoute(ROUTES.SCHOOL_TO_HOME)}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            route === ROUTES.SCHOOL_TO_HOME
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          School → Home
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Students"
          value={totalStudents}
          color="text-blue-600"
        />

        <StatCard
          title={route === ROUTES.HOME_TO_SCHOOL ? "Picked Up" : "Dropped"}
          value={pickedCount}
          color="text-green-600"
        />

        <StatCard
          title="Remaining"
          value={remainingCount}
          color="text-red-600"
        />
      </div>
    </div>
  );
}

/* ---------- Reusable Card ---------- */
function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={`text-5xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default DriverDashboard;
