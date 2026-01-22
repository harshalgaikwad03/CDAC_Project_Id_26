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
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Select Your Role</h2>
      <select
        className="border p-2 w-full mb-3"
        onChange={(e) => goToSignup(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          -- Select Role --
        </option>
        <option value="agency">Agency</option>
        <option value="school">School</option>
        <option value="driver">Driver</option>
        <option value="bus-helper">Bus Helper</option>
        <option value="student">Student</option>
      </select>
    </div>
  );
}

export default RoleSelectSignup;
