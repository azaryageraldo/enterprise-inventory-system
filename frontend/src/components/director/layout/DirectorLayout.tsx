import { Outlet } from "react-router-dom";
import { DirectorSidebar } from "./DirectorSidebar";
import { DirectorHeader } from "./DirectorHeader";

export default function DirectorLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <DirectorSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DirectorHeader />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
