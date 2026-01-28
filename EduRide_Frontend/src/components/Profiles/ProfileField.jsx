function ProfileField({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">
        {value ?? "Not Available"}
      </span>
    </div>
  );
}

export default ProfileField;
