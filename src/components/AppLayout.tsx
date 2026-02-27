
import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarNav />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 pt-6 pb-24 md:pb-6">
          {children}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
