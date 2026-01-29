function SchoolProfile({ user }) {
  if (!user) return null;

  return (
    <div className="space-y-2 text-sm text-gray-700">
      <p><b>School Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Phone:</b> {user.phone}</p>
      <p><b>Address:</b> {user.address || "N/A"}</p>
    </div>
  );
}

export default SchoolProfile;
