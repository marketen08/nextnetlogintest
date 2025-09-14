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
      <div className="min-h-screen bg-background">
        {/* Navbar */}
        <Navbar />
        
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content */}
          <main className="flex-1 lg:ml-0 pt-16">
            <div className="p-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
