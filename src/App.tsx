import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import type { ReactNode } from "react";
import { AppShell } from "@/shared/layout/AppShell";
import { Home } from "@/pages/Home";
import { ModuleRoute } from "@/pages/ModuleRoute";
import { Welcome } from "@/pages/Welcome";
import { usePrefs } from "@/shared/prefs/usePrefs";

/** Send first-time visitors to the welcome page to set their preferences. */
function RequireOnboarded({ children }: { children: ReactNode }) {
  const { prefs } = usePrefs();
  if (!prefs.onboarded) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

const router = createBrowserRouter([
  { path: "/welcome", element: <Welcome /> },
  {
    path: "/",
    element: (
      <RequireOnboarded>
        <AppShell />
      </RequireOnboarded>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "learn/:id", element: <ModuleRoute /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
