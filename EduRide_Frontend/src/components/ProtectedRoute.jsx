import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role")?.toLowerCase()?.trim();
      
      if (!token || !role) {
        setIsAuthenticated(false);
        setUserRole(null);
      } else {
        setIsAuthenticated(true);
        setUserRole(role);
      }
      setIsLoading(false);
    };

    checkAuth();
    
    // Listen for logout events
    const handleLogout = () => {
      setIsAuthenticated(false);
      setUserRole(null);
    };
    
    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0) {
    const normalizedUserRole = userRole.replace("role_", "").toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      // Redirect to appropriate dashboard based on role
      switch (normalizedUserRole) {
        case "student":
          return <Navigate to="/dashboard/student" replace />;
        case "agency":
          return <Navigate to="/dashboard/agency" replace />;
        case "school":
          return <Navigate to="/dashboard/school" replace />;
        case "driver":
          return <Navigate to="/dashboard/driver" replace />;
        case "bus_helper":
        case "helper":
          return <Navigate to="/dashboard/bus-helper" replace />;
        default:
          localStorage.clear();
          return <Navigate to="/login" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;