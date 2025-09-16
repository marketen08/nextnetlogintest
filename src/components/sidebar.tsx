"use client";

import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/sidebar-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-guard';
import { RoleBasedRender } from '@/components/role-based-render';
import { ProfileImage } from '@/components/profile-image';
import { useGetProfileQuery } from '@/store/services/profile';
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
  Shield,
  Building2,
  CheckSquare
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['all']
  },
  {
    title: 'Tareas',
    href: '/tareas',
    icon: CheckSquare,
    roles: ['all']
  },
  {
    title: 'Recursos',
    href: '/recursos',
    icon: Users,
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
    title: 'Clientes',
    href: '/clientes',
    icon: Building2,
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
    icon: Shield,
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
  },
  {
    title: 'Debug Scroll',
    href: '/debug-scroll',
    icon: Settings,
    roles: ['all']
  },
  {
    title: 'Scroll Test',
    href: '/scroll-test',
    icon: Settings,
    roles: ['all']
  },
  // Elementos adicionales para testing del scroll
  {
    title: 'Reportes',
    href: '/reportes',
    icon: BarChart3,
    roles: ['all']
  },
  {
    title: 'Inventario',
    href: '/inventario',
    icon: Package,
    roles: ['all']
  },
  {
    title: 'Finanzas',
    href: '/finanzas',
    icon: TrendingUp,
    roles: ['all']
  },
  {
    title: 'Marketing',
    href: '/marketing',
    icon: Users,
    roles: ['all']
  },
  {
    title: 'Ventas',
    href: '/ventas',
    icon: TrendingUp,
    roles: ['all']
  },
  {
    title: 'Soporte',
    href: '/soporte',
    icon: User,
    roles: ['all']
  }
];

export function Sidebar() {
  const { isOpen, close } = useSidebar();
  const { user } = useAuth();
  const { data: profileUser } = useGetProfileQuery();
  const pathname = usePathname();

  // Create fallback user
  const createFallbackUser = () => ({
    id: '',
    userName: user?.email || '',
    email: user?.email || '',
    emailConfirmed: false,
    phoneNumberConfirmed: false,
    twoFactorEnabled: false,
    lockoutEnabled: false,
    accessFailedCount: 0,
    nombre: '',
    apellido: '',
    roles: user?.roles || [],
    profileImageUrl: '',
  });

  const currentUser = profileUser ? {
    ...profileUser,
    roles: profileUser.roles || user?.roles || []
  } : createFallbackUser();

  const shouldShowItem = (item: typeof menuItems[0]) => {
    if (item.roles.includes('all')) return true;
    return currentUser.roles?.some(role => item.roles.includes(role.toLowerCase()));
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
          // Base styles
          "h-full w-72 bg-background border-r flex flex-col lg:w-64 overflow-hidden",
          // Mobile: fixed overlay with animation
          "lg:relative lg:translate-x-0 lg:z-auto",
          "fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden flex-shrink-0">
          <h2 className="text-lg font-semibold">Menú</h2>
          <Button variant="ghost" size="icon" onClick={close}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Desktop header - Fixed */}
        <div className="hidden lg:flex items-center justify-center p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">TestNet</h2>
        </div>

        {/* User info - Fixed */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center space-x-3">
            <ProfileImage user={currentUser} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {currentUser.nombre && currentUser.apellido 
                  ? `${currentUser.nombre} ${currentUser.apellido}`
                  : currentUser.email
                }
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser.email}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentUser.roles && currentUser.roles.length > 0 ? (
                  currentUser.roles.map((role, index) => (
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
        </div>

        {/* Navigation - Scrollable container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar">
            <nav className="p-4">
              <ul className="space-y-1 pb-4">
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
                              "w-full justify-start gap-3 h-10",
                              isActive && "bg-secondary"
                            )}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </Button>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 border-t flex-shrink-0">
          <p className="text-xs text-muted-foreground text-center">
            TestNet v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
