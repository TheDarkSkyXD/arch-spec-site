import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import UserSettings from "./pages/UserSettings";
import SecuritySettings from "./pages/SecuritySettings";
import Documentation from "./pages/Documentation";
import ProtectedRoute from "./components/ProtectedRoute";
// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
// Landing page
import LandingPage from "./pages/LandingPage";

// Router configuration
const router = createBrowserRouter([
  // Public landing page
  {
    path: "/",
    element: <LandingPage />,
  },
  // Auth routes (public)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  // Protected routes (require authentication)
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/new-project",
    element: (
      <ProtectedRoute>
        <NewProject />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects",
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:id",
    element: (
      <ProtectedRoute>
        <ProjectDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/templates",
    element: (
      <ProtectedRoute>
        <Templates />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/docs",
    element: (
      <ProtectedRoute>
        <Documentation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user-settings",
    element: (
      <ProtectedRoute>
        <UserSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/security-settings",
    element: (
      <ProtectedRoute>
        <SecuritySettings />
      </ProtectedRoute>
    ),
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
