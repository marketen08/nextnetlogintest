"use client";

import { useAuth } from '@/components/auth-guard';
import { ReactNode } from 'react';

interface RoleBasedRenderProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

// Componente para mostrar contenido basado en roles
export function RoleBasedRender({ allowedRoles, children, fallback = null }: RoleBasedRenderProps) {
  const { roles = [] } = useAuth();
  
  const hasRole = allowedRoles.some(role => roles.includes(role));
  
  return hasRole ? <>{children}</> : <>{fallback}</>;
}

// Hook para verificar roles específicos
export function useHasRole(requiredRoles: string | string[]) {
  const { roles = [] } = useAuth();
  
  const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  return rolesToCheck.some(role => roles.includes(role));
}
