import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function Feedback() {
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackText.trim()) {
      setMsg("❌ Feedback cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      await API.post("/feedback", {
        feedbackText,
        rating
      });

      setMsg("✅ Feedback submitted successfully");

      setFeedbackText("");
      setRating(5);

      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Feedback error:", error);

      if (error.response?.status === 403) {
        setMsg("❌ You are not authorized to submit feedback");
      } else {
        setMsg("❌ Failed to submit feedback. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        System Feedback
      </h1>

      {msg && (
        <div className="mb-6 text-center font-medium text-blue-700">
          {msg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow space-y-6"
      >
        <div>
          <label className="block font-medium mb-1">Feedback</label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full border rounded p-3"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Rating (1–5)
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded p-3"
          >
            {[1, 2, 3, 4, 5].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default Feedback;
