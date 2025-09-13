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
      <div className="h-screen bg-background overflow-hidden">
        {/* Navbar */}
        <Navbar />
        
        <div className="flex h-full">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content */}
          <main className="flex-1 lg:ml-0 pt-16 h-full overflow-hidden">
            <div className="p-2 h-full overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
