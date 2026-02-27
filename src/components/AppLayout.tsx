import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Desktop Horizontal Navigation */}
      <div className="hidden lg:block sticky top-0 z-50">
        <SidebarNav />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="page-container">
          {children}
        </div>
        
        {/* Mobile Nav - visible only on smaller screens */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </main>
    </div>
  );
}
