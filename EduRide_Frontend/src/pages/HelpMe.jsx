import { FaQuestionCircle, FaUserShield, FaUsers, FaLock, FaHeadset, FaExclamationCircle, FaGraduationCap, FaClipboardCheck, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function HelpMe() {
  const faqs = [
    {
      question: "Who can use EduRide?",
      answer: "EduRide is designed for administrators, schools, bus helpers, and agencies involved in managing student transportation.",
      icon: <FaUsers className="text-xl" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      question: "How is student attendance managed?",
      answer: "Bus helpers can securely mark student pickup and drop-off status using their dashboard, ensuring accurate daily transport records.",
      icon: <FaClipboardCheck className="text-xl" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      question: "Is student data secure?",
      answer: "Yes. EduRide uses role-based access control so only authorized users can view or manage sensitive student information.",
      icon: <FaShieldAlt className="text-xl" />,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 mb-6">
            <FaQuestionCircle className="text-blue-600 text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Help & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Support</span>
          </h1>
          <div className="mt-4 w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Welcome to the EduRide support center. Find answers to common questions
            or guidance on using the school transportation management system.
          </p>
        </div>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center border border-blue-100">
              <FaGraduationCap className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 mt-1">
                Quick answers to common queries
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${faq.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${faq.color} flex items-center justify-center`}>
                      <div className="text-white">
                        {faq.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {faq.question}
                      </h3>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <section>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <FaHeadset className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Need More Help?
                </h2>
                <p className="text-gray-600 mt-1">
                  We're here to assist you
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  If you face any issues or need assistance, please contact the system
                  administrator or your school/agency coordinator.
                </p>
                
                <div className="mt-8 p-6 bg-white rounded-xl border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <FaExclamationCircle className="text-blue-500 text-xl" />
                    <p className="text-lg font-semibold text-blue-700">
                      Quick Contact Info:
                    </p>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Email: support@eduride.com</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Phone: +1 (555) 123-4567</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Hours: Mon-Fri, 8 AM - 6 PM</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FaUserShield className="text-amber-300 text-2xl" />
                  <p className="text-xl font-bold">
                    Support Tip:
                  </p>
                </div>
                <p className="text-blue-50/90 leading-relaxed">
                  Make sure you are logged in with the correct role (Admin, School,
                  Helper, or Agency) to access the appropriate features. Each role
                  has specific permissions and capabilities tailored to your responsibilities.
                </p>
                <div className="mt-6 pt-6 border-t border-blue-400/30">
                  <p className="text-sm text-blue-100/80">
                    <FaLock className="inline mr-2" />
                    Your data security is our priority
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Help Section */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Still need assistance?
              </h3>
              <p className="text-gray-600">
                Our support team is ready to help you
              </p>
            </div>
                    <Link 
              to="/contact" 
              className="nav-link flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg transition-all duration-300">
              Contact Support
            </button>
            </Link>

            
          </div>
        </div>
      </div>
    </div>
  );
}