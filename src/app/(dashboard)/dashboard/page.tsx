"use client";

import { withAuth, useAuth } from '@/components/auth-guard';
import { RoleBasedRender, useHasRole } from '@/components/role-based-render';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/features/user';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function DashboardPage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAdmin = useHasRole('admin');
  const isModerator = useHasRole(['admin', 'moderator']);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">¡Bienvenido, {user.email}!</p>
        </div>
        <div className="flex gap-2">
          <Link href="/profile">
            <Button variant="outline">Mi Perfil</Button>
          </Link>
          <Button onClick={handleLogout} variant="outline">
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Información del usuario */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email:</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Roles:</p>
              <div className="flex gap-1 mt-1">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role, index) => (
                    <Badge key={index} variant="secondary">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Sin roles asignados</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tarjeta para todos los usuarios */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold">Mi Perfil</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ver y editar información personal
              </p>
              <Link href="/profile">
                <Button className="mt-3" size="sm">
                  Ver Perfil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta solo para moderadores y admins */}
        <RoleBasedRender allowedRoles={['admin', 'moderator']}>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold">Gestión de Usuarios</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Administrar usuarios del sistema
                </p>
                <Button className="mt-3" size="sm" disabled>
                  Próximamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </RoleBasedRender>

        {/* Tarjeta solo para admins */}
        <RoleBasedRender allowedRoles={['admin']}>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold">Panel de Admin</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Configuración del sistema
                </p>
                <Link href="/admin">
                  <Button className="mt-3" size="sm">
                    Ir a Admin
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </RoleBasedRender>
      </div>

      {/* Información de debug */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>¿Es Admin?</strong> {isAdmin ? 'Sí' : 'No'}</p>
            <p><strong>¿Es Moderador?</strong> {isModerator ? 'Sí' : 'No'}</p>
            <p><strong>Roles disponibles:</strong> {user.roles?.join(', ') || 'Ninguno'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(DashboardPage);
