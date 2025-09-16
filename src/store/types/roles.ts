export interface Role {
  id: string;
  name: string;
  normalizedName: string;
}

export interface RolesResponse {
  roles: Role[];
  message: string;
}

export interface UserWithRoles {
  userId: string;
  email: string;
  nombre: string;
  apellido: string;
  roles: string[];
}

export interface AssignRoleRequest {
  userId: string;
  roleName: string;
}

export interface RemoveRoleRequest {
  userId: string;
  roleName: string;
}

export interface CreateRoleRequest {
  roleName: string;
}

export interface CreateRoleResponse {
  success: boolean;
  message: string;
  role?: Role;
}

export interface AssignRoleResponse {
  success: boolean;
  message: string;
}

export interface RemoveRoleResponse {
  success: boolean;
  message: string;
}