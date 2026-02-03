import { useState } from "react";
import API from "../../services/api";
import { FaLock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      await API.post("/user/change-password", {
        currentPassword,
        newPassword
      });

      setMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data || "Failed to change password"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaLock /> Change Password
      </h2>

      {error && (
        <div className="text-red-600 mb-3 flex gap-2">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {message && (
        <div className="text-green-600 mb-3 flex gap-2">
          <FaCheckCircle /> {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          className="w-full border p-2 rounded"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
