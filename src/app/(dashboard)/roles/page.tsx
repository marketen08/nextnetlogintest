"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, UserCog } from 'lucide-react';

import { RolesList } from './components/RolesList';
import { UserRoleManager } from './components/UserRoleManager';

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState('roles');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administración de Roles</h1>
        <p className="text-muted-foreground">
          Gestiona roles del sistema y asigna permisos a usuarios
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Gestión de Roles</span>
            <span className="sm:hidden">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Asignar a Usuarios</span>
            <span className="sm:hidden">Usuarios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <RolesList />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Asignar Roles a Usuarios
            </h2>
            <p className="text-muted-foreground mb-6">
              Selecciona un usuario y gestiona sus roles del sistema
            </p>
          </div>
          <UserRoleManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}