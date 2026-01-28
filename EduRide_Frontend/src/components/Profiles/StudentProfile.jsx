function StudentProfile({ user }) {
  if (!user) return null;

  return (
    <div className="space-y-2 text-sm text-gray-700">
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Phone:</b> {user.phone || "N/A"}</p>
      <p><b>Class:</b> {user.className || "N/A"}</p>
      <p><b>Roll No:</b> {user.rollNo || "N/A"}</p>
      <p><b>School:</b> {user.school?.name || "N/A"}</p>
    </div>
  );
}

export default StudentProfile;
