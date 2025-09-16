"use client";

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/contexts/sidebar-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        {/* Navbar - Fixed height */}
        <div className="flex-shrink-0 z-10">
          <Navbar />
        </div>
        
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar - Fixed height with internal scroll */}
          <Sidebar />
          
          {/* Main content - Scrollable independently */}
          <main className="flex-1 w-full min-w-0 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-2 sm:p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
