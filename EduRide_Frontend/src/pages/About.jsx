import { FaShieldAlt, FaUsers, FaUserLock, FaBell, FaLock, FaUserFriends, FaBullseye, FaBus } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function About() {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50/50">
      {/* Hero Section */}
      <section className="px-6 py-20 md:py-24 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="inline-flex items-center gap-3">
              <FaBus className="text-amber-300" />
              EduRide
            </span>
          </h1>
          <p className="mt-6 text-2xl md:text-3xl font-semibold text-blue-100">
            Smarter, Safer, and More Reliable School Transportation Management
          </p>
          <p className="mt-6 text-lg md:text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed">
            A complete digital solution designed to simplify school transport
            operations while ensuring student safety and transparency.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-16 md:py-20 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <FaBus className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                What is EduRide?
              </h2>
              <div className="mt-3 w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-lg md:text-xl text-gray-700 leading-relaxed bg-gradient-to-r from-blue-50/50 to-transparent p-6 rounded-xl">
            <span className="font-bold text-blue-600">EduRide</span> is a smart school
            transportation portal that connects administrators, schools, helpers,
            and students on a single platform. It streamlines daily transport
            operations, minimizes manual errors, and builds trust between schools
            and parents.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 md:py-20 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose <span className="text-blue-600">EduRide</span>?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive features designed for modern school transportation management
            </p>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <FaShieldAlt className="text-xl" />,
                title: "Student Safety First",
                desc: "Track student pickup and drop-off status in real time, ensuring no child is missed during transit.",
                color: "from-green-500 to-emerald-600",
                bg: "bg-gradient-to-br from-green-50 to-emerald-50/50"
              },
              {
                icon: <FaUsers className="text-xl" />,
                title: "Centralized Management",
                desc: "Manage schools, buses, drivers, helpers, and students from one secure dashboard.",
                color: "from-blue-500 to-cyan-600",
                bg: "bg-gradient-to-br from-blue-50 to-cyan-50/50"
              },
              {
                icon: <FaUserLock className="text-xl" />,
                title: "Role-Based Access",
                desc: "Dedicated dashboards for admins, schools, and helpers ensure secure and controlled operations.",
                color: "from-purple-500 to-pink-600",
                bg: "bg-gradient-to-br from-purple-50 to-pink-50/50"
              },
              {
                icon: <FaBell className="text-xl" />,
                title: "Real-Time Updates",
                desc: "Helpers can instantly mark attendance, giving schools accurate daily transport records.",
                color: "from-amber-500 to-orange-600",
                bg: "bg-gradient-to-br from-amber-50 to-orange-50/50"
              },
              {
                icon: <FaLock className="text-xl" />,
                title: "Secure & Reliable",
                desc: "Built with secure authentication and authorization to protect sensitive student data.",
                color: "from-red-500 to-rose-600",
                bg: "bg-gradient-to-br from-red-50 to-rose-50/50"
              },
              {
                icon: <FaUserFriends className="text-xl" />, // Changed from FaUserFriendly to FaUserFriends
                title: "Easy to Use",
                desc: "A clean, intuitive interface that reduces training time and boosts efficiency.",
                color: "from-indigo-500 to-violet-600",
                bg: "bg-gradient-to-br from-indigo-50 to-violet-50/50"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 p-6"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-white bg-gradient-to-r ${feature.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`}>
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-blue-200 transition-colors duration-300">
                  <div className={`w-full h-1 rounded-full bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="px-6 py-16 md:py-20 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 mb-8">
            <FaBullseye className="text-blue-600 text-3xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Vision
          </h2>
          <div className="mt-6 w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          <p className="mt-8 text-lg md:text-xl text-gray-700 italic leading-relaxed max-w-3xl mx-auto bg-gradient-to-r from-blue-50/30 to-cyan-50/30 p-8 rounded-2xl border border-blue-100">
            "To transform school transportation into a smart, transparent, and
            safety-focused system using modern technology."
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-white"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-8 border border-white/20">
            <FaBus className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Moving Schools Forward, One Ride at a Time
          </h2>
          <p className="text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto">
            EduRide empowers schools with smarter transportation management.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaBus />
              <span>Start Your Journey with EduRide</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}