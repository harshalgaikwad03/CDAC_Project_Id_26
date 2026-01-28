function AgencyProfile({ user }) {
  if (!user) return null;

  return (
    <div className="space-y-2 text-sm text-gray-700">
      <p><b>Agency Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Phone:</b> {user.phone}</p>
    </div>
  );
}

export default AgencyProfile;
