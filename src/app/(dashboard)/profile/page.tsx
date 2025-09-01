"use client";

import { withAuth } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileImage } from '@/components/profile-image';
import { 
  useGetProfileQuery, 
  useUpdateProfileMutation 
} from '@/store/services/profile';
import { 
  useGetClientesPagedQuery 
} from '@/store/services/clientes';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Palette,
  Save,
  RefreshCw
} from 'lucide-react';

function ProfilePage() {
  const { data: user, isLoading, error, refetch } = useGetProfileQuery(undefined, {
    // Forzar la consulta incluso si no hay datos en caché
    refetchOnMountOrArgChange: true,
  });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  
  // Obtener lista de clientes para el select
  const { data: clientesResponse, isLoading: isLoadingClientes } = useGetClientesPagedQuery({
    page: 1,
    pagesize: 100, // Obtener una lista amplia para el select
  });
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    phoneNumber: '',
    proyectoId: '',
    clienteId: null as string | null, // Permitir null para clienteId
    sociedadId: '',
    terminalId: '',
    color: '#3b82f6',
  });

  // Debug logging
  console.log('ProfilePage - user:', user);
  console.log('ProfilePage - isLoading:', isLoading);
  console.log('ProfilePage - error:', error);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        phoneNumber: user.phoneNumber || '',
        proyectoId: user.proyectoId || '',
        clienteId: user.clienteId || null, // Usar null en lugar de string vacío
        sociedadId: user.sociedadId || '',
        terminalId: user.terminalId || '',
        color: user.color || '#3b82f6',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      // Convertir null a undefined para clienteId antes de enviar
      const dataToSend = {
        ...formData,
        clienteId: formData.clienteId || undefined, // Convertir null/string vacío a undefined
      };
      
      const result = await updateProfile(dataToSend).unwrap();
      
      // Si llegamos aquí, la actualización fue exitosa
      toast.success('Perfil actualizado correctamente');
      refetch(); // Refresh the profile data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Manejar diferentes tipos de error
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error('Error al actualizar el perfil');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive">Error al cargar el perfil</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No se pudo cargar la información del perfil</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Image and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <ProfileImage 
                  user={user} 
                  size="xl" 
                  showEditButton 
                  onImageUpdated={() => refetch()}
                />
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {user.nombre && user.apellido 
                      ? `${user.nombre} ${user.apellido}`
                      : 'Nombre no definido'
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  
                  {/* Cliente asignado */}
                  {formData.clienteId && formData.clienteId !== "__no_client__" && (
                    <div className="mt-2">
                      {(() => {
                        const cliente = clientesResponse?.data?.find(c => c.id === formData.clienteId);
                        return cliente ? (
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            {cliente.urlLogo && (
                              <img 
                                src={cliente.urlLogo} 
                                alt={cliente.nombre}
                                className="h-4 w-4 rounded object-cover"
                              />
                            )}
                            <span>{cliente.nombre}</span>
                            {cliente.esContratista && (
                              <Badge variant="outline" className="text-xs">
                                Contratista
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">Cliente: {formData.clienteId}</p>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 justify-center">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role, index) => (
                      <Badge key={index} variant="secondary">
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">Usuario</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">El email no se puede modificar</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Teléfono</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color de perfil</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Información Organizacional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proyectoId">Proyecto ID</Label>
                  <Input
                    id="proyectoId"
                    value={formData.proyectoId}
                    onChange={(e) => handleInputChange('proyectoId', e.target.value)}
                    placeholder="ID del proyecto"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente</Label>
                  <Select
                    value={formData.clienteId || "__no_client__"} // Usar un valor especial en lugar de string vacío
                    onValueChange={(value) => handleInputChange('clienteId', value === "__no_client__" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingClientes ? "Cargando clientes..." : "Seleccionar cliente"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__no_client__">Sin cliente asignado</SelectItem>
                      {clientesResponse?.data?.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          <div className="flex items-center gap-2">
                            {cliente.urlLogo && (
                              <img 
                                src={cliente.urlLogo} 
                                alt={cliente.nombre}
                                className="h-4 w-4 rounded object-cover"
                              />
                            )}
                            <span>{cliente.nombre}</span>
                            {cliente.esContratista && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                Contratista
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sociedadId">Sociedad ID</Label>
                  <Input
                    id="sociedadId"
                    value={formData.sociedadId}
                    onChange={(e) => handleInputChange('sociedadId', e.target.value)}
                    placeholder="ID de la sociedad"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="terminalId">Terminal ID</Label>
                  <Input
                    id="terminalId"
                    value={formData.terminalId}
                    onChange={(e) => handleInputChange('terminalId', e.target.value)}
                    placeholder="ID del terminal"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleUpdateProfile} 
              disabled={isUpdating}
              size="lg"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
