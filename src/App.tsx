import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "@/shared/layout/AppShell";
import { Home } from "@/pages/Home";
import { ModuleRoute } from "@/pages/ModuleRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: "learn/:id", element: <ModuleRoute /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
