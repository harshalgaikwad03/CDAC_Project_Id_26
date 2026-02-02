import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaPaperPlane,
  FaCommentDots,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaLightbulb,
  FaSmile,
  FaHeart,
  FaThumbsUp,
  FaRegStar,
  FaStarHalfAlt
} from "react-icons/fa";

function Feedback() {
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

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
        rating,
      });

      setMsg("✅ Thank you! Your feedback has been submitted.");

      setFeedbackText("");
      setRating(5);

      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Feedback error:", error);

      if (error.response?.status === 403) {
        setMsg("❌ You are not authorized to submit feedback");
      } else {
        setMsg("❌ Failed to submit feedback. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = [
    "Poor - Needs significant improvement",
    "Fair - Could be better",
    "Good - Meets expectations",
    "Very Good - Exceeds expectations",
    "Excellent - Outstanding experience"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">

        {/* ===== BACK BUTTON ===== */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition-colors duration-200 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Go Back</span>
        </button>

        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl mb-6">
            <FaCommentDots className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Share Your Feedback
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Help us improve EduRide by sharing your experience, suggestions, or any issues you've encountered
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaHeart className="text-red-400" />
              <span>Your feedback matters to us</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaLightbulb className="text-yellow-500" />
              <span>Suggestions drive improvements</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaSmile className="text-blue-400" />
              <span>Anonymous & secure</span>
            </div>
          </div>
        </div>

        {/* ===== MESSAGE ALERT ===== */}
        {msg && (
          <div className={`mb-8 rounded-xl p-5 flex items-start gap-4 animate-fadeIn ${
            msg.startsWith("✅")
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}>
            <div className={`p-2 rounded-full ${msg.startsWith("✅") ? 'bg-green-100' : 'bg-red-100'}`}>
              {msg.startsWith("✅") ? (
                <FaCheckCircle className="text-green-600 text-xl" />
              ) : (
                <FaExclamationCircle className="text-red-600 text-xl" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${msg.startsWith("✅") ? 'text-green-800' : 'text-red-800'}`}>
                {msg.replace(/[✅❌]/g, '').trim()}
              </p>
              {msg.startsWith("✅") && (
                <p className="text-green-700 text-sm mt-1">Redirecting you back in a moment...</p>
              )}
            </div>
          </div>
        )}

        {/* ===== FORM ===== */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Feedback Type Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaLightbulb className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">What kind of feedback should I share?</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Feature suggestions or improvements</li>
                    <li>• Issues you've encountered</li>
                    <li>• Overall user experience</li>
                    <li>• Performance feedback</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feedback Text */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FaCommentDots className="text-green-600" />
                Your Feedback
              </label>
              <p className="text-sm text-gray-600">Share your thoughts, suggestions, or report any issues</p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 min-h-[180px] resize-none"
                rows={5}
                placeholder="Type your feedback here... Be as detailed as possible to help us understand your experience better."
                required
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Minimum 10 characters recommended</span>
                <span>{feedbackText.length}/1000 characters</span>
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <FaStar className="text-yellow-500" />
                  Overall Rating
                </label>
                <p className="text-sm text-gray-600 mb-4">How would you rate your overall experience?</p>
              </div>

              {/* Star Rating */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-1 text-4xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      {star <= (hoverRating || rating) ? (
                        <FaStar className="text-yellow-500 fill-current" />
                      ) : (
                        <FaRegStar className="text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Rating Label */}
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {rating}.0 <span className="text-lg text-gray-600">out of 5</span>
                  </p>
                  <p className="text-gray-600 font-medium">
                    {ratingLabels[rating - 1]}
                  </p>
                </div>

                {/* Rating Scale */}
                <div className="flex items-center justify-between w-full max-w-md text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span>1 - Poor</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStarHalfAlt className="text-yellow-400 text-xs" />
                    <span>3 - Good</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span>5 - Excellent</span>
                  </span>
                </div>
              </div>

              {/* Alternative Rating Selector */}
              <div className="pt-4 border-t border-gray-200">
                <div className="relative">
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 appearance-none bg-white"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r !== 1 ? 's' : ''} - {ratingLabels[r - 1].split('-')[1].trim()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 border-b-2 border-r-2 border-gray-400 transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || !feedbackText.trim()}
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-200 ${
                  loading || !feedbackText.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Submitting Feedback...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-lg" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
              
              {/* Additional Info */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-3 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                  <FaThumbsUp className="text-green-500" />
                  <span>Your feedback helps us serve you better. Thank you for taking the time!</span>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  All feedback is anonymous and will be reviewed by our team within 24 hours.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="text-center text-gray-500 mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm mb-2">
            EduRide Feedback System • Continuous Improvement • User-Centric Design
          </p>
          <p className="text-xs text-gray-400">
            Your voice helps shape the future of school transportation management
          </p>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Star animation */
        @keyframes starPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        button:hover svg[class*="text-yellow-500"] {
          animation: starPulse 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Feedback;