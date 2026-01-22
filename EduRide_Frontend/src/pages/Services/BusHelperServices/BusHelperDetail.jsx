import { useEffect, useState } from "react";

function BusHelperDetail() {
  const [helper, setHelper] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    setHelper(JSON.parse(userData));
  }, []);

  if (!helper) return null;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Bus Helper Details</h2>

      <div className="border p-4 rounded bg-gray-100 inline-block text-left">
        <p><b>ID:</b> {helper.id}</p>
        <p><b>Name:</b> {helper.name}</p>
        <p><b>Assigned School:</b> {helper.school?.name || "Not Assigned"}</p>
        <p><b>Assigned Bus:</b> {helper.assignedBus?.busNumber || "Not Assigned"}</p>
      </div>
    </div>
  );
}

export default BusHelperDetail;
