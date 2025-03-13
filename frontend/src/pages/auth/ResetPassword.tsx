import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenChecking, setTokenChecking] = useState(true);

  // Simple password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    // Length check
    if (password.length > 7) strength += 1;
    // Contains number
    if (/\d/.test(password)) strength += 1;
    // Contains special character
    if (/[!@#$%^&*]/.test(password)) strength += 1;
    // Contains uppercase and lowercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  
  const getStrengthColor = (strength: number) => {
    if (strength === 0) return "bg-slate-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-green-400";
    return "bg-green-500";
  };

  // Verify the reset token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setTokenChecking(false);
        return;
      }

      try {
        // In a real application, this would verify the token with your backend
        // For demonstration, we'll just simulate a check after a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Let's assume the token is valid if it's at least 10 characters long
        setTokenValid(token.length >= 10);
      } catch (err) {
        console.error("Token verification error:", err);
        setTokenValid(false);
      } finally {
        setTokenChecking(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (passwordStrength < 2) {
      setError("Please choose a stronger password");
      return;
    }

    try {
      setLoading(true);
      // This is just a placeholder. Will be replaced with actual integration later
      console.log("Password reset with token", token);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success state
      setIsSubmitted(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (tokenChecking) {
    return (
      <AuthLayout>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto flex justify-center h-12 w-12 rounded-full bg-primary-100">
            <div className="flex items-center justify-center rounded-full bg-primary-600 text-white p-2">
              <Lock className="h-6 w-6" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Verifying your reset link...
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="flex justify-center">
              <svg 
                className="animate-spin h-8 w-8 text-primary-600" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (tokenValid === false) {
    return (
      <AuthLayout>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto flex justify-center h-12 w-12 rounded-full bg-red-100">
            <div className="flex items-center justify-center rounded-full bg-red-600 text-white p-2">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Invalid or expired link
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            This password reset link is invalid or has expired.
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <p className="mb-4">Need to reset your password?</p>
            <Link
              to="/forgot-password"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Request a new link
            </Link>
            <div className="mt-4">
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex justify-center h-12 w-12 rounded-full bg-primary-100">
          <div className="flex items-center justify-center rounded-full bg-primary-600 text-white p-2">
            <Lock className="h-6 w-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-slate-900">Password updated</h3>
              <p className="mt-2 text-sm text-slate-600">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    New password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Password strength meter */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center mb-1">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStrengthColor(passwordStrength)} transition-all`} 
                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-slate-500">
                          {passwordStrength === 0 && "Too weak"}
                          {passwordStrength === 1 && "Weak"}
                          {passwordStrength === 2 && "Medium"}
                          {passwordStrength === 3 && "Strong"}
                          {passwordStrength === 4 && "Very strong"}
                        </span>
                      </div>
                      
                      <ul className="text-xs text-slate-500 space-y-1">
                        <li className="flex items-center">
                          {password.length > 7 ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-slate-300 mr-1" />
                          )}
                          At least 8 characters
                        </li>
                        <li className="flex items-center">
                          {/\d/.test(password) ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-slate-300 mr-1" />
                          )}
                          Contains a number
                        </li>
                        <li className="flex items-center">
                          {/[!@#$%^&*]/.test(password) ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-slate-300 mr-1" />
                          )}
                          Contains a special character
                        </li>
                        <li className="flex items-center">
                          {/[a-z]/.test(password) && /[A-Z]/.test(password) ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-slate-300 mr-1" />
                          )}
                          Mix of uppercase & lowercase
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Confirm new password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg 
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      "Reset password"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;