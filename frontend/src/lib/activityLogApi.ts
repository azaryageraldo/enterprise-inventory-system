import api from "./api";

export interface LoginHistory {
  id: number;
  userId: number;
  username: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
  status: "SUCCESS" | "FAILED";
}

export interface AuditLog {
  id: number;
  userId: number;
  username: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entityType: string;
  entityId: number;
  changes: string;
  timestamp: string;
}

export interface ApprovalHistory {
  id: number;
  expenseRequestId: number;
  approverId: number;
  approverName: string;
  action: "APPROVED" | "REJECTED";
  notes: string;
  timestamp: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface LogParams {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
}

export const activityLogApi = {
  getLoginHistory: async (params?: LogParams) => 
    (await api.get<Page<LoginHistory>>("/admin/activity-logs/logins", { params })).data,
    
  getAuditLogs: async (params?: LogParams) => 
    (await api.get<Page<AuditLog>>("/admin/activity-logs/audits", { params })).data,
    
  getApprovalHistory: async (params?: LogParams) => 
    (await api.get<Page<ApprovalHistory>>("/admin/activity-logs/approvals", { params })).data,
};
