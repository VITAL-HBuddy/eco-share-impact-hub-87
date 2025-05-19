
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // If already logged in, redirect to appropriate dashboard
  if (user) {
    const dashboardPath = user.role ? `/dashboard/${user.role}` : "/";
    navigate(dashboardPath, { replace: true });
  }
  
  const handleLoginSuccess = () => {
    // Will be redirected by the useAuth check above
  };
  
  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Login to EcoShare</h1>
        <LoginForm onSuccess={handleLoginSuccess} />
        
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
