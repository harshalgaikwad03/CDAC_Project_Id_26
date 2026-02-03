import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { logActivity } from "../../services/api";
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaUserCheck,
  FaArrowLeft,
  FaExclamationTriangle,
  FaCheckCircle,
  FaMobileAlt,
  FaGoogle,
  FaFacebook
} from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1️⃣ Perform Login
      const res = await API.post("/auth/login", { email, password });

      if (!res.data?.token) {
        throw new Error("No token received");
      }

      // 2️⃣ Save Auth Data
      localStorage.setItem("token", res.data.token);

      const userData = {
        id: res.data.id,
        name: res.data.name || "User",
        email: res.data.email || email,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem(
        "role",
        (res.data.role || "").toLowerCase().trim()
      );

      // Remember me functionality
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // 3️⃣ Activity Log (Fire & Forget)
      logActivity(
        "INFO",
        "User Logged In Successfully",
        "EduRide-Frontend",
        `Email: ${email}`
      );

      // Show success before navigation
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);

    } catch (err) {
      console.error(err);

      logActivity(
        "ERROR",
        "Login Failed",
        "EduRide-Frontend",
        `Email: ${email} | Error: ${err.message}`
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      agency: { email: "demo@agency.com", password: "demo123" },
      school: { email: "demo@school.com", password: "demo123" },
      driver: { email: "demo@driver.com", password: "demo123" },
      helper: { email: "demo@helper.com", password: "demo123" },
      student: { email: "demo@student.com", password: "demo123" }
    };

    const creds = demoCredentials[role];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* ===== BACK BUTTON ===== */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors duration-200 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="flex flex-col lg:flex-row justify-center items-center">

          {/* ===== LEFT PANEL - FORM ===== */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FaShieldAlt className="text-white text-3xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Welcome Back to EduRide</h1>
                    <p className="text-blue-100 mt-1">Secure Login for School Transportation Management</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8">
                {/* Description */}
                <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaUserCheck className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Sign in to Your Account</h3>
                      <p className="text-blue-700">
                        Access your dashboard to manage transportation, track buses, and monitor student attendance.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4 animate-fadeIn">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FaExclamationTriangle className="text-red-600 text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">{error}</p>
                      <p className="text-red-700 text-sm mt-1">
                        {error.includes("credentials") && "Please check your email and password"}
                      </p>
                    </div>
                  </div>
                )}



                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-medium text-gray-700">
                      <FaEnvelope className="text-blue-600" />
                      Email Address
                    </label>
                    <div className={`relative transition-all duration-200 ${isFocused.email ? 'transform scale-[1.01]' : ''}`}>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        onFocus={() => setIsFocused({ ...isFocused, email: true })}
                        onBlur={() => setIsFocused({ ...isFocused, email: false })}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        required
                      />
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 font-medium text-gray-700">
                        <FaLock className="text-blue-600" />
                        Password
                      </label>
                      {/* <button
                        onClick={() => navigate("/change-password")}
                        className="text-blue-600 hover:underline"
                      >
                        Change Password
                      </button> */}

                    </div>
                    <div className={`relative transition-all duration-200 ${isFocused.password ? 'transform scale-[1.01]' : ''}`}>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsFocused({ ...isFocused, password: true })}
                        onBlur={() => setIsFocused({ ...isFocused, password: false })}
                        className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        required
                      />
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  {/* <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Remember me</span>
                    </label>
                  </div> */}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${loading
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          <span>Signing you in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <FaSignInAlt className="text-lg" />
                          <span>Sign In to Dashboard</span>
                        </div>
                      )}
                    </button>
                  </div>




                </form>

                {/* Sign Up Link */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => navigate("/signup")}
                      className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                    >
                      Create your account
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Choose from Agency, School, Driver, Helper, or Student accounts
                  </p>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* ===== FOOTER ===== */}
        {/* <div className="text-center mt-12 pt-8 border-t border-gray-200">
          
          <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-500">
            <span>© {new Date().getFullYear()} EduRide</span>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 hover:underline">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 hover:underline">Support</a>
          </div>
        </div> */}
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
      `}</style>
    </div>
  );
}

export default Login;