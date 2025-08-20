"use client";

import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Icons } from './icons';

interface WithAuthProps {
  requiredRoles?: string[];
}

// HOC para proteger componentes
export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options: WithAuthProps = {}
) {
  return function AuthenticatedComponent(props: T) {
    const { accessToken, roles = [] } = useAppSelector((state) => state.user);
    const router = useRouter();
    const { requiredRoles = [] } = options;

    useEffect(() => {
      // Si no hay token, redirigir al login
      if (!accessToken) {
        router.push('/login');
        return;
      }

      // Si se requieren roles específicos, verificarlos
      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => roles.includes(role));
        if (!hasRequiredRole) {
          router.push('/unauthorized'); // O cualquier página de error 403
          return;
        }
      }
    }, [accessToken, roles, router]);

    // Mostrar loading mientras se verifica la autenticación
    if (!accessToken) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2 text-sm text-muted-foreground">Verificando autenticación...</p>
          </div>
        </div>
      );
    }

    // Si requiere roles específicos y no los tiene
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => roles.includes(role));
      if (!hasRequiredRole) {
        return (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                No tienes permisos para acceder a esta página
              </p>
            </div>
          </div>
        );
      }
    }

    return <WrappedComponent {...props} />;
  };
}

// Hook personalizado para verificar autenticación
export function useAuth(requiredRoles: string[] = []) {
  const { accessToken, roles = [] } = useAppSelector((state) => state.user);
  
  const isAuthenticated = !!accessToken;
  const hasRequiredRoles = requiredRoles.length === 0 || 
    requiredRoles.some(role => roles.includes(role));

  return {
    isAuthenticated,
    hasRequiredRoles,
    roles,
    user: useAppSelector((state) => state.user)
  };
}
