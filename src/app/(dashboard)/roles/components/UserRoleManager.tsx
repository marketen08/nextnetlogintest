"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertError } from '@/components/alerts';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';

import {
  useGetRolesQuery,
  useGetUserRolesQuery,
  useAssignRoleMutation,
  useRemoveRoleMutation,
} from '@/store/services/roles';
import { useGetUsersPagedQuery } from '@/store/services/auth';

interface UserRoleManagerProps {
  selectedUserId?: string;
  onUserChange?: (userId: string) => void;
}

export function UserRoleManager({ 
  selectedUserId, 
  onUserChange 
}: UserRoleManagerProps) {
  const [localSelectedUserId, setLocalSelectedUserId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const currentUserId = selectedUserId || localSelectedUserId;

  // API Queries
  const { data: rolesData, isLoading: rolesLoading } = useGetRolesQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersPagedQuery();
  const { 
    data: userRolesData, 
    isLoading: userRolesLoading, 
    refetch: refetchUserRoles 
  } = useGetUserRolesQuery(currentUserId, {
    skip: !currentUserId,
  });

  // Mutations
  const [assignRole, { isLoading: assignLoading }] = useAssignRoleMutation();
  const [removeRole, { isLoading: removeLoading }] = useRemoveRoleMutation();

  const isLoading = assignLoading || removeLoading;

  const allRoles = rolesData?.roles || [];
  const userRoles = userRolesData?.roles || [];
  const users = usersData?.data || [];

  const handleUserSelect = (userId: string) => {
    setLocalSelectedUserId(userId);
    onUserChange?.(userId);
    setError(null);
  };

  const handleRoleToggle = async (roleName: string, isAssigned: boolean) => {
    if (!currentUserId) return;

    setError(null);
    try {
      if (isAssigned) {
        // Remover rol
        const result = await removeRole({
          userId: currentUserId,
          roleName,
        }).unwrap();

        if (!result.success) {
          setError(result.message || 'Error al remover el rol');
        }
      } else {
        // Asignar rol
        const result = await assignRole({
          userId: currentUserId,
          roleName,
        }).unwrap();

        if (!result.success) {
          setError(result.message || 'Error al asignar el rol');
        }
      }
      
      // Refrescar los roles del usuario
      refetchUserRoles();
    } catch (err: any) {
      console.error('Error toggling role:', err);
      setError(
        err?.data?.message || 
        err?.message || 
        'Error inesperado al gestionar el rol'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Usuario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Seleccionar Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentUserId} onValueChange={handleUserSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un usuario..." />
            </SelectTrigger>
            <SelectContent>
              {usersLoading ? (
                <SelectItem value="loading" disabled>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando usuarios...
                  </div>
                </SelectItem>
              ) : (
                users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.nombre && user.apellido
                          ? `${user.nombre} ${user.apellido}`
                          : user.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Gestión de Roles */}
      {currentUserId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5" />
              Gestionar Roles
            </CardTitle>
            {userRolesData && (
              <div className="text-sm text-muted-foreground">
                Usuario: {userRolesData.nombre && userRolesData.apellido
                  ? `${userRolesData.nombre} ${userRolesData.apellido}`
                  : userRolesData.email}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {userRolesLoading || rolesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Cargando roles...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Roles actuales */}
                <div>
                  <h4 className="font-medium mb-2">Roles Actuales:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {userRoles.length > 0 ? (
                      userRoles.map((role) => (
                        <Badge key={role} variant="default">
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Sin roles asignados
                      </span>
                    )}
                  </div>
                </div>

                {/* Lista de todos los roles disponibles */}
                <div>
                  <h4 className="font-medium mb-3">Todos los Roles:</h4>
                  <div className="space-y-3">
                    {allRoles.map((role) => {
                      const isAssigned = userRoles.includes(role.name);
                      return (
                        <div
                          key={role.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={isAssigned}
                              onCheckedChange={() =>
                                handleRoleToggle(role.name, isAssigned)
                              }
                              disabled={isLoading}
                            />
                            <div>
                              <div className="font-medium">{role.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {role.normalizedName}
                              </div>
                            </div>
                          </div>
                          <Badge variant={isAssigned ? "default" : "outline"}>
                            {isAssigned ? "Asignado" : "Disponible"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <AlertError error={error || undefined} />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}