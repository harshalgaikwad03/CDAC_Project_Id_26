import { useNavigate } from "react-router-dom";

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

  return (
    // Full screen background container
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Centered Card */}
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
        
        {/* Header with Icon */}
        <div className="mb-8">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Join the Platform
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Choose your role to get started with your registration
          </p>
        </div>

        {/* Custom Styled Select Dropdown */}
        <div className="relative">
          <select
            className="appearance-none block w-full px-4 py-4 pr-10 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow cursor-pointer shadow-sm hover:border-gray-400"
            onChange={(e) => goToSignup(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select your account type...
            </option>
            <option value="agency">Agency (Transport Provider)</option>
            <option value="school">School Administrator</option>
            <option value="driver">Driver</option>
            <option value="bus-helper">Bus Helper</option>
            <option value="student">Student / Parent</option>
          </select>

          {/* Custom Chevron Down Icon (Absolute Positioned) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 1.414a1 1 0 01-1.414 0l-4-1.414a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          You will be redirected immediately upon selection.
        </p>

      </div>
    </div>
  );
}

export default RoleSelectSignup;