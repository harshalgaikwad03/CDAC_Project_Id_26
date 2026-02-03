import { FaEnvelope, FaPhone, FaHeadset, FaSchool, FaBus, FaUsers, FaShieldAlt, FaLifeRing } from "react-icons/fa";

export default function Contact() {
  const contactInfo = [
    {
      title: "Email Support",
      value: "support@eduride.com",
      description: "For login issues, account help, and technical support",
      icon: <FaEnvelope className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50/50",
      borderColor: "border-blue-200"
    },
    {
      title: "Phone Support",
      value: "+91 12345 67890",
      description: "Available during school working hours (9 AM - 5 PM)",
      icon: <FaPhone className="text-2xl" />,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50/50",
      borderColor: "border-emerald-200"
    }
  ];

  const helpItems = [
    { text: "School and agency onboarding support", icon: <FaSchool /> },
    { text: "Bus, helper, and student management guidance", icon: <FaBus /> },
    { text: "Login, role access, and dashboard issues", icon: <FaUsers /> },
    { text: "General queries related to EduRide features", icon: <FaLifeRing /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/80 flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-200/20 to-cyan-200/20 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-200/20 to-green-200/20 blur-3xl"></div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Strip */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500"></div>
          
          <div className="p-10 lg:p-12">
            {/* Heading Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 mb-6 shadow-lg">
                <FaHeadset className="text-blue-600 text-3xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">EduRide</span>
              </h1>
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-6"></div>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                We're here to help schools and agencies manage transportation smarter.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className={`${info.bgColor} rounded-2xl p-8 border-2 ${info.borderColor} transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl group`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${info.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {info.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      <p className="text-gray-800 text-lg font-medium mb-2">
                        {info.value}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* How We Can Help Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-8 mb-10 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FaShieldAlt className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    How We Can Help You
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Comprehensive support for all your transportation management needs
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpItems.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 bg-white/80 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                      <div className="text-blue-600">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Support Info */}
            <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-2xl p-6 border border-blue-200/50">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FaUsers className="text-white text-xl" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Enterprise Support Available
                  </h4>
                  <p className="text-gray-700">
                    For schools with multiple buses or agencies managing large fleets, 
                    we offer dedicated account managers and priority support.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            {/* <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 font-medium">
                EduRide – Smart, Secure & Reliable School Transportation Management
              </p>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
                <span>© {new Date().getFullYear()} EduRide</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>All Rights Reserved</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>Made for Schools</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}