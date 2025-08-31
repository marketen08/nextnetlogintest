"use client";

import { withAuth, useAuth } from '@/components/auth-guard';
import { RoleBasedRender, useHasRole } from '@/components/role-based-render';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = useHasRole('Admin');
  const isMecanico = useHasRole(['Admin', 'Mecanico']);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">¡Bienvenido, {user.email}!</p>
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
        {/* Tarjeta para KPIs */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold">KPIs</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Gestionar KPIs del sistema
              </p>
              <Link href="/kpis">
                <Button className="mt-3" size="sm">
                  Ver KPIs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de Métricas */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold">Métricas</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Administrar métricas
              </p>
              <Link href="/metricas">
                <Button className="mt-3" size="sm">
                  Ver Métricas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de Proveedores */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold">Proveedores</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Gestionar proveedores del sistema
              </p>
              <Link href="/proveedores">
                <Button className="mt-3" size="sm">
                  Ver Proveedores
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
                <Link href="/usuarios">
                  <Button className="mt-3" size="sm">
                    Gestionar Usuarios
                  </Button>
                </Link>
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
            <p><strong>¿Es Mecánico?</strong> {isMecanico ? 'Sí' : 'No'}</p>
            <p><strong>Roles disponibles:</strong> {user.roles?.join(', ') || 'Ninguno'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(DashboardPage);
