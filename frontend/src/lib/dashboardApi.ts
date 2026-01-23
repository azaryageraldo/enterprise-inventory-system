import api from "./api";
import { type LoginHistory, type AuditLog } from "./activityLogApi";

export interface DashboardStats {
  totalUsers: number;
  totalItems: number;
  activeRequests: number;
  totalExpenses: number;
  recentActivities: AuditLog[];
  recentLogins: LoginHistory[];
}

export const dashboardApi = {
  getStats: async () => (await api.get<DashboardStats>("/admin/dashboard/stats")).data,
};
