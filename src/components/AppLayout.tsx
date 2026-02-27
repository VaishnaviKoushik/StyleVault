import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block border-r bg-white z-50">
        <SidebarNav />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto main-content-area">
        <div className="page-container">
          {children}
        </div>
        
        {/* Mobile Nav - visible only on smaller screens */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
