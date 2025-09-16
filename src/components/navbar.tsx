"use client";

import { Button } from '@/components/ui/button';
import { Menu, Bell, User } from 'lucide-react';
import { useSidebar } from '@/contexts/sidebar-context';
import { useAuth } from '@/components/auth-guard';
import { ProfileImage } from '@/components/profile-image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/features/user';
import { useRouter } from 'next/navigation';
import { useGetProfileQuery } from '@/store/services/profile';
import Link from 'next/link';

export function Navbar() {
  const { toggle } = useSidebar();
  const { user } = useAuth();
  const { data: profileUser } = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  // Create a fallback user object that matches ApplicationUser interface
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

  // Use profile data if available, fallback to user from auth
  // Merge roles from JWT if profile doesn't have them
  const currentUser = profileUser ? {
    ...profileUser,
    roles: profileUser.roles || user?.roles || []
  } : createFallbackUser();

  return (
    <header className="bg-background border-b flex-shrink-0">
      <div className="flex items-center justify-between px-3 sm:px-4 h-16">
        {/* Left side - Menu button and logo */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="lg:hidden flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold">TestNet</h1>
          </div>
        </div>

        {/* Center - Logo for mobile */}
        <div className="lg:hidden flex-1 flex justify-center">
          <h1 className="text-lg sm:text-xl font-bold truncate">TestNet</h1>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="w-5 h-5" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0">
                <ProfileImage user={currentUser} size="md" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser.nombre && currentUser.apellido 
                      ? `${currentUser.nombre} ${currentUser.apellido}`
                      : currentUser.email
                    }
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.roles?.join(', ') || 'Usuario'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
