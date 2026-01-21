import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID" | "ACTIVE" | "INACTIVE";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    APPROVED: "bg-green-100 text-green-800 hover:bg-green-100",
    REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
    PAID: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
    INACTIVE: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };

  return (
    <Badge className={cn(variants[status], className)}>
      {status}
    </Badge>
  );
}
