import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import Projects from "./pages/Projects";
import Templates from "./pages/Templates";
import TechStackCompatibilityPage from "./pages/TechStackCompatibilityPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/new-project",
    element: <NewProject />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/templates",
    element: <Templates />,
  },
  {
    path: "/tech-stack",
    element: <TechStackCompatibilityPage />,
  },
  // Other routes will be added as we implement them
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
