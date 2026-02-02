import { useNavigate } from "react-router-dom";
import {
  FaSchool,
  FaBus,
  FaUserGraduate,
  FaUserTie,
  FaHandsHelping,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaUsers,
  FaRoute,
  FaMapMarkedAlt,
  FaChartLine,
  FaMobileAlt,
  FaLock
} from "react-icons/fa";

function RoleSelectSignup() {
  const navigate = useNavigate();

  const goToSignup = (role) => {
    switch (role) {
      case "agency":
        navigate("/signup/agency");
        break;
      case "school":
        navigate("/signup/school");
        break;
      case "driver":
        navigate("/signup/driver");
        break;
      case "bus-helper":
        navigate("/signup/bus-helper");
        break;
      case "student":
        navigate("/signup/student");
        break;
      default:
        break;
    }
  };

  const roleCards = [
    {
      id: "agency",
      title: "Transport Agency",
      icon: <FaBus className="text-xl" />,
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-100",
      bgColor: "bg-blue-50",
      description: "Manage transport services for multiple schools",
      features: [
        "Bus & Driver Management",
        "Route Assignment",
        "School Coordination"
      ],
      delay: "delay-0"
    },
    {
      id: "school",
      title: "School Authority",
      icon: <FaSchool className="text-xl" />,
      color: "from-green-500 to-green-600",
      iconColor: "text-green-100",
      bgColor: "bg-green-50",
      description: "Monitor students and transportation activities",
      features: [
        "Student Registration",
        "Bus Allocation",
        "Attendance Monitoring"
      ],
      delay: "delay-100"
    },
    {
      id: "driver",
      title: "Bus Driver",
      icon: <FaUserTie className="text-xl" />,
      color: "from-indigo-500 to-indigo-600",
      iconColor: "text-indigo-100",
      bgColor: "bg-indigo-50",
      description: "View assigned routes and student details",
      features: [
        "Route Information",
        "Pickup & Drop Schedule",
        "Student List Access"
      ],
      delay: "delay-200"
    },
    {
      id: "bus-helper",
      title: "Bus Helper",
      icon: <FaHandsHelping className="text-xl" />,
      color: "from-orange-500 to-orange-600",
      iconColor: "text-orange-100",
      bgColor: "bg-orange-50",
      description: "Ensure student safety during transportation",
      features: [
        "Attendance Marking",
        "Pickup & Drop Confirmation",
        "Student Safety Support"
      ],
      delay: "delay-300"
    },
    {
      id: "student",
      title: "Student / Parent",
      icon: <FaUserGraduate className="text-xl" />,
      color: "from-purple-500 to-purple-600",
      iconColor: "text-purple-100",
      bgColor: "bg-purple-50",
      description: "Track daily bus activity and attendance",
      features: [
        "Live Bus Status",
        "Attendance Notifications",
        "Pickup & Drop Updates"
      ],
      delay: "delay-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-6xl mx-auto relative">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl shadow-2xl mb-6">
            <FaShieldAlt className="text-white text-4xl" />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EduRide
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A Smart School Transportation Management System designed to digitally
            manage buses, routes, students, and daily attendance with enhanced
            safety and transparency
          </p>


        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ===== LEFT PANEL ===== */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8">
                <h2 className="text-3xl font-bold mb-2">Register on EduRide</h2>
                <p className="text-blue-100 text-lg">
                  Select your role to access transportation management features
                </p>
              </div>

              <div className="p-8">
                {/* Dropdown */}
                <div className="mb-10">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Quick Selection
                  </h3>

                  <select
                    defaultValue=""
                    onChange={(e) => goToSignup(e.target.value)}
                    className="appearance-none w-full px-6 py-5 text-lg text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-lg"
                  >
                    <option value="" disabled>
                      Select your account type
                    </option>
                    {roleCards.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roleCards.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => goToSignup(role.id)}
                      className={`group bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ${role.delay} animate-fadeInUp`}
                    >
                      <div
                        className={`inline-flex items-center justify-center p-4 rounded-xl mb-4 bg-gradient-to-br ${role.color}`}
                      >
                        <div className={role.iconColor}>{role.icon}</div>
                      </div>

                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {role.title}
                      </h4>

                      <p className="text-gray-600 mb-4">
                        {role.description}
                      </p>

                      <div className="space-y-2">
                        {role.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <FaCheckCircle className="text-green-500 text-sm" />
                            <span className="text-sm text-gray-700">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT PANEL ===== */}
          <div className="lg:w-1/3">
            <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl shadow-2xl border border-blue-100 p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose EduRide?
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <FaLock className="text-blue-600 text-xl" />
                  <p className="text-sm text-gray-600">
                    Secure role-based access control for all users
                  </p>
                </div>

                <div className="flex gap-4">
                  <FaMapMarkedAlt className="text-green-600 text-xl" />
                  <p className="text-sm text-gray-600">
                    Track assigned bus routes and daily transport status
                  </p>
                </div>

                <div className="flex gap-4">
                  <FaMobileAlt className="text-purple-600 text-xl" />
                  <p className="text-sm text-gray-600">
                    Responsive design for mobile and desktop access
                  </p>
                </div>

                <div className="flex gap-4">
                  <FaShieldAlt className="text-orange-600 text-xl" />
                  <p className="text-sm text-gray-600">
                    Designed according to school transport safety guidelines
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-blue-200">
                <div className="bg-white rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold text-gray-900">Already have an account?</span>
                    <br />
                    You can skip role selection if you're signing in.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              #e5e7eb 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .delay-0 {
          animation-delay: 0ms;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
}

export default RoleSelectSignup;
