function DriverProfile({ user, busNumber }) {
  if (!user) return null;

  return (
    <div className="space-y-2 text-sm text-gray-700">
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Phone:</b> {user.phone}</p>
      <p><b>License No:</b> {user.licenseNumber || "N/A"}</p>
      {/* <p><b>Bus:</b> {busNumber || "Not Assigned"}</p> */}
    </div>
  );
}

export default DriverProfile;
