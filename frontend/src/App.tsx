import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import MasterData from "./pages/admin/MasterData";
import AdminLayout from "./components/admin/layout/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import ActivityLogs from "./pages/admin/ActivityLogs";
import EmployeeLayout from "@/components/employee/layout/EmployeeLayout";
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import CatalogPage from "@/pages/employee/CatalogPage";
import RequestsPage from "@/pages/employee/RequestsPage";
import ExpensesPage from "@/pages/employee/ExpensesPage";
import EmployeeSettingsPage from "@/pages/employee/EmployeeSettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Generic Dashboard (Temporary) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/master-data" element={<MasterData />} />
          <Route path="/admin/activity-logs" element={<ActivityLogs />} />
        </Route>

        {/* Employee Routes */}
        <Route
            path="/employee"
            element={
                <ProtectedRoute>
                    <EmployeeLayout />
                </ProtectedRoute>
            }
        >
             <Route index element={<Navigate to="/employee/dashboard" replace />} />
             <Route path="dashboard" element={<EmployeeDashboard />} />
             <Route path="inventory" element={<CatalogPage />} />
             <Route path="requests" element={<RequestsPage />} />
             <Route path="expenses" element={<ExpensesPage />} />
             <Route path="settings" element={<EmployeeSettingsPage />} />
        </Route>

        

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
