
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, loading } = useAuth();
  
  // Show loading state while auth state is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Role-based access check
  if (allowedRoles.length > 0 && user.role && !allowedRoles.includes(user.role)) {
    // User doesn't have the required role, redirect to appropriate dashboard or home
    if (user.role) {
      return <Navigate to={`/dashboard/${user.role}`} replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
