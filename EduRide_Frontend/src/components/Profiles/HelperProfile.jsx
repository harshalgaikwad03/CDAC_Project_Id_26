function HelperProfile({ user }) {
  if (!user) return null;

  return (
    <div className="space-y-2 text-sm text-gray-700">
      <p><b>Name:</b> {user.name || "-"}</p>
      <p><b>Email:</b> {user.email || "-"}</p>
      <p><b>Phone:</b> {user.phone || "-"}</p>
      <p><b>Bus:</b> {user.busNumber || "Not Assigned"}</p>
    </div>
  );
}

export default HelperProfile;
