import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading, isDevBypass } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser && !isDevBypass) {
      // Redirect to login if not authenticated and not using dev bypass
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [currentUser, loading, navigate, location, isDevBypass]);

  // Show nothing while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Development bypass notification
  if (isDevBypass) {
    const devNotificationStyle = {
      position: 'fixed' as const,
      bottom: '1rem',
      right: '1rem',
      zIndex: 50,
      padding: '0.5rem 1rem',
      backgroundColor: 'rgba(147, 51, 234, 0.9)',
      color: 'white',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    };
    
    // Only render children if authenticated or using dev bypass
    return (
      <>
        {children}
        <div style={devNotificationStyle}> Dev Auth Bypass Active</div>
      </>
    );
  }

  // Only render children if authenticated
  return currentUser ? <>{children}</> : null;
};

export default ProtectedRoute;