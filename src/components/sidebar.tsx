"use client";

import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/sidebar-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-guard';
import { RoleBasedRender } from '@/components/role-based-render';
import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  Users,
  Settings,
  Package,
  TrendingUp,
  User,
  Shield
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['all']
  },
  {
    title: 'KPIs',
    href: '/kpis',
    icon: BarChart3,
    roles: ['all']
  },
  {
    title: 'Métricas',
    href: '/metricas',
    icon: TrendingUp,
    roles: ['all']
  },
  {
    title: 'Proveedores',
    href: '/proveedores',
    icon: Package,
    roles: ['all']
  },
  {
    title: 'Mi Perfil',
    href: '/profile',
    icon: User,
    roles: ['all']
  },
  {
    title: 'Usuarios',
    href: '/usuarios',
    icon: Users,
    roles: ['admin', 'moderator']
  },
  {
    title: 'Admin Panel',
    href: '/admin',
    icon: Shield,
    roles: ['admin']
  },
  {
    title: 'Configuración',
    href: '/configuracion',
    icon: Settings,
    roles: ['admin']
  }
];

export function Sidebar() {
  const { isOpen, close } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();

  const shouldShowItem = (item: typeof menuItems[0]) => {
    if (item.roles.includes('all')) return true;
    return user?.roles?.some(role => item.roles.includes(role.toLowerCase()));
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="text-lg font-semibold">Menú</h2>
          <Button variant="ghost" size="icon" onClick={close}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-center p-4 border-b">
          <h2 className="text-lg font-semibold">TestNet</h2>
        </div>

        {/* User info */}
        <div className="p-4 border-b">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <div className="flex flex-wrap gap-1">
              {user?.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {role}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-xs">
                  Usuario
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems
              .filter(shouldShowItem)
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        // Close sidebar on mobile when navigating
                        if (window.innerWidth < 1024) {
                          close();
                        }
                      }}
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3",
                          isActive && "bg-secondary"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {item.title}
                      </Button>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            TestNet v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
