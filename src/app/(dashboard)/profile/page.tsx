"use client";

import { withAuth, useAuth } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/features/user';
import { useRouter } from 'next/navigation';

function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información del usuario */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Información del Usuario</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email:</p>
                <p className="text-sm">{user.email || 'No disponible'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado:</p>
                <Badge variant="outline" className="text-green-600">
                  Autenticado
                </Badge>
              </div>
            </div>
          </div>

          {/* Roles del usuario */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Roles Asignados</h3>
            <div className="flex flex-wrap gap-2">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <Badge key={index} variant="secondary">
                    {role}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No se han asignado roles</p>
              )}
            </div>
          </div>

          {/* Información del token (para debugging) */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Información de Sesión</h3>
            <div className="space-y-1">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Access Token:</p>
                <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                  {user.accessToken ? `${user.accessToken.substring(0, 50)}...` : 'No disponible'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Refresh Token:</p>
                <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                  {user.refreshToken ? `${user.refreshToken.substring(0, 50)}...` : 'No disponible'}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Button onClick={handleLogout} variant="outline">
                Cerrar Sesión
              </Button>
              <Button onClick={() => router.push('/dashboard')} variant="default">
                Ir al Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(ProfilePage);
