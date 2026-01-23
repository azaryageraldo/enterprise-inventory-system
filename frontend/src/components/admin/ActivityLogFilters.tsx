import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface ActivityLogFiltersProps {
  onFilter: (filters: { startDate?: string; endDate?: string }) => void;
  onClear: () => void;
}

export function ActivityLogFilters({ onFilter, onClear }: ActivityLogFiltersProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApply = () => {
    onFilter({
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    });
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    onClear();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end bg-card p-4 rounded-lg border shadow-sm mb-6">
      <div className="grid gap-2 w-full sm:w-auto">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-[200px]"
        />
      </div>

      <div className="grid gap-2 w-full sm:w-auto">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-[200px]"
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
        <Button onClick={handleApply} className="flex-1 sm:flex-none">
          <Search className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" onClick={handleClear} className="flex-1 sm:flex-none">
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
