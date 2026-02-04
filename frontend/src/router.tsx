import { lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import SuspenseLayout from "./layouts/SuspenseLayout";

 
const PublicLayout = lazy(() => import("./components/layout/PublicLayout"));
const PrivateLayout = lazy(() => import("./components/layout/PrivateLayout"));
 
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Builder = lazy(() => import("./pages/builder/Builder"));
const Analytics = lazy(() => import("./pages/analytics/Analytics"));
const Settings = lazy(() => import("./pages/settings/Settings"));

const NotFound = lazy(() => import("./pages/_404/NotFound"));

export const router = createBrowserRouter([
  {
    element: <SuspenseLayout />,
    children: [
      /* Public routes */
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
      /* Private routes */
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <PrivateLayout />,
            children: [
              {
                path: "/dashboard",
                element: <Dashboard />,
              },
              {
                path: "/builder/new",
                element: <Builder />,
              },
              {
                path: "/builder/:id",
                element: <Builder />,
              },
              {
                path: "/analytics",
                element: <Analytics />,
              },
              {
                path: "/settings",
                element: <Settings />,
              },
            ],
          },
        ],
      },
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
