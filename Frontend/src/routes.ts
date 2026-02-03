import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { NotFound } from "./pages/NotFound";
import { NotImplemented } from "./pages/NotImplemented";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/not-implemented",
    Component: NotImplemented,
  },
  {
    path: "/admin",
    async lazy() {
      const { AdminLogin } = await import("./pages/admin/AdminLogin");
      return { Component: AdminLogin };
    },
  },
  {
    path: "/admin/dashboard",
    async lazy() {
      const { AdminDashboard } = await import("./pages/admin/AdminDashboard");
      return { Component: AdminDashboard };
    },
  },
  {
    path: "*",
    Component: NotFound,
  },
], {
  future: {
    v7_skipActionErrorRevalidation: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
  }
});