import { Toaster } from "@/components/ui/sonner";
import { AppProvider, useApp } from "./context/AppContext";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserDashboard from "./pages/UserDashboard";

function Router() {
  const { currentPage, currentUser } = useApp();

  if (currentPage === "/login") return <LoginPage />;
  if (currentPage === "/signup") return <SignupPage />;
  if (currentPage === "/dashboard") {
    if (!currentUser) return <LoginPage />;
    if (currentUser.role === "admin") return <AdminDashboard />;
    return <UserDashboard />;
  }
  if (currentPage === "/admin") {
    if (!currentUser || currentUser.role !== "admin") return <LoginPage />;
    return <AdminDashboard />;
  }
  return <LandingPage />;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
      <Toaster richColors position="top-right" />
    </AppProvider>
  );
}
