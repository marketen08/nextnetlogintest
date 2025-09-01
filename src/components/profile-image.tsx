"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Camera, Upload } from 'lucide-react';
import { useUpdateProfileImageMutation } from '@/store/services/profile';
import { toast } from 'sonner';
import { ApplicationUser } from '@/store/types/user';

interface ProfileImageProps {
  user: ApplicationUser;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showEditButton?: boolean;
  onImageUpdated?: (newImageUrl: string) => void;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

export function ProfileImage({ 
  user, 
  size = 'md', 
  showEditButton = false,
  onImageUpdated 
}: ProfileImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.profileImageUrl || '');
  const [updateProfileImage, { isLoading }] = useUpdateProfileImageMutation();

  const handleUpdateImage = async () => {
    if (!imageUrl.trim()) {
      toast.error('Por favor ingresa una URL válida');
      return;
    }

    try {
      const result = await updateProfileImage({ profileImageUrl: imageUrl }).unwrap();
      
      if (result.success) {
        toast.success('Imagen de perfil actualizada correctamente');
        onImageUpdated?.(result.data.profileImageUrl);
        setIsOpen(false);
      } else {
        toast.error(result.message || 'Error al actualizar la imagen');
      }
    } catch (error: any) {
      console.error('Error updating profile image:', error);
      toast.error('Error al actualizar la imagen de perfil');
    }
  };

  const getUserInitials = () => {
    const nombre = user.nombre || '';
    const apellido = user.apellido || '';
    
    if (nombre && apellido) {
      return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user.nombre && user.apellido) {
      return `${user.nombre} ${user.apellido}`;
    }
    return user.email || 'Usuario';
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage 
          src={user.profileImageUrl} 
          alt={getUserDisplayName()}
        />
        <AvatarFallback style={{ backgroundColor: user.color || '#3b82f6' }}>
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>
      
      {showEditButton && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full"
            >
              <Camera className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Actualizar Imagen de Perfil</DialogTitle>
              <DialogDescription>
                Ingresa la URL de tu nueva imagen de perfil
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col space-y-4">
              {/* Vista previa actual */}
              <div className="flex justify-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={imageUrl || user.profileImageUrl} 
                    alt="Vista previa"
                  />
                  <AvatarFallback style={{ backgroundColor: user.color || '#3b82f6' }}>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Campo de URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de la imagen</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/imagen.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setImageUrl(user.profileImageUrl || '');
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateImage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Actualizar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
