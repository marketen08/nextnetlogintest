export interface ApplicationUser {
  id: string;
  userName: string;
  email: string;
  emailConfirmed?: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: string;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  
  // Campos personalizados
  nombre: string;
  apellido: string;
  proyectoId?: string;
  clienteId?: string;
  sociedadId?: string;
  terminalId?: string;
  color?: string;
  profileImageUrl?: string;
  
  // Roles (viene del JWT o endpoint separado)
  roles?: string[];
}

// Para el endpoint /auth/profile que devuelve directamente el usuario
export interface ProfileResponse extends ApplicationUser {
}

export interface UpdateProfileImageRequest {
  profileImageUrl: string;
}

export interface UpdateProfileImageResponse {
  success: boolean;
  data: {
    profileImageUrl: string;
  };
  message?: string;
}
