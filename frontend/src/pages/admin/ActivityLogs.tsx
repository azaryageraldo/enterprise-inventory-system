import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ActivityLogFilters } from "@/components/admin/ActivityLogFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { activityLogApi, type LoginHistory, type AuditLog, type ApprovalHistory } from "@/lib/activityLogApi";
import { toast } from "sonner";
import { Loader2, RotateCw } from "lucide-react";
import { format } from "date-fns";

export default function ActivityLogs() {
  const [activeTab, setActiveTab] = useState("logins");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ startDate?: string; endDate?: string }>({});
  
  // Data states
  const [loginLogs, setLoginLogs] = useState<LoginHistory[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [approvalLogs, setApprovalLogs] = useState<ApprovalHistory[]>([]);

  // Pagination states (simplified for now)
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [activeTab, filters, page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = { page, size: 20, ...filters };
      
      if (activeTab === "logins") {
        const data = await activityLogApi.getLoginHistory(params);
        setLoginLogs(data.content);
        setTotalPages(data.totalPages);
      } else if (activeTab === "audits") {
        const data = await activityLogApi.getAuditLogs(params);
        setAuditLogs(data.content);
        setTotalPages(data.totalPages);
      } else if (activeTab === "approvals") {
        const data = await activityLogApi.getApprovalHistory(params);
        setApprovalLogs(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters: { startDate?: string; endDate?: string }) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleClear = () => {
    setFilters({});
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy HH:mm:ss");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Breadcrumb items={[{ label: "Activity Logs", href: "/admin/activity-logs" }]} />
        <Button variant="outline" size="sm" onClick={() => fetchLogs()} disabled={loading}>
          <RotateCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <ActivityLogFilters onFilter={handleFilter} onClear={handleClear} />

      <Card>
        <CardHeader>
          <CardTitle>System Activity Logs</CardTitle>
          <CardDescription>
            Monitor login attempts, data changes, and approval workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="logins">Login History</TabsTrigger>
              <TabsTrigger value="audits">Data Changes (Audit)</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
            </TabsList>

            <TabsContent value="logins">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : loginLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      loginLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{formatDate(log.loginTime)}</TableCell>
                          <TableCell className="font-medium">{log.username}</TableCell>
                          <TableCell>{log.ipAddress}</TableCell>
                          <TableCell>
                            <Badge variant={log.status === "SUCCESS" ? "default" : "destructive"}>
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="audits">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : auditLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{formatDate(log.timestamp)}</TableCell>
                          <TableCell>{log.username}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>{log.entityType} (#{log.entityId})</TableCell>
                          <TableCell className="max-w-[300px] truncate text-muted-foreground" title={log.changes}>
                            {log.changes || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="approvals">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Approver</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : approvalLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      approvalLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{formatDate(log.timestamp)}</TableCell>
                          <TableCell>{log.approverName}</TableCell>
                          <TableCell>
                            <Badge variant={log.action === "APPROVED" ? "default" : "destructive"}>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>#{log.expenseRequestId}</TableCell>
                          <TableCell>{log.notes || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          {/* Simple Pagination Controls */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
