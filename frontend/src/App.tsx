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

import ExpensesPage from "@/pages/employee/ExpensesPage";

import StockManagementPage from "@/pages/employee/StockManagementPage";
import ManagerLayout from "@/components/manager/layout/ManagerLayout";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import ManagerReportPage from "@/pages/manager/ManagerReportPage";
import ManagerApprovalsPage from "@/pages/manager/ManagerApprovalsPage";
import ManagerStockPage from "@/pages/manager/ManagerStockPage";

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
             <Route path="stock" element={<StockManagementPage />} />
             <Route path="expenses" element={<ExpensesPage />} />
            
        </Route>

        {/* Manager Routes */}
        <Route
            path="/manager"
            element={
                <ProtectedRoute>
                    <ManagerLayout />
                </ProtectedRoute>
            }
        >
             <Route index element={<Navigate to="/manager/dashboard" replace />} />
             <Route path="dashboard" element={<ManagerDashboard />} />
             <Route path="reports" element={<ManagerReportPage />} />
             <Route path="approvals" element={<ManagerApprovalsPage />} />
             <Route path="stock-monitoring" element={<ManagerStockPage />} />
        </Route>

        

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
