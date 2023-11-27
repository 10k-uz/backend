import { UserType } from '@prisma/client';
import { Request } from 'express';

export interface DecodedUserToken {
  info: {
    id: number;
    adminId: number | null;
    name: string;
    phone: string;
    username: string;
    password: string;
    roleId: number;
    createdAt: string;
    updatedAt: string;
    createdRoles: any[];
  };
  userType: UserType;
  permissions: string[];
  iat: number;
  exp: number;
}

export interface Permissions {
  name?: string;
  children?: {
    can_read_all?: boolean;
    can_read_related?: boolean;
    can_write?: boolean;
    can_update_all?: boolean;
    can_update_related?: boolean;
    can_delete_all?: boolean;
    can_delete_related?: boolean;
    can_search_all?: boolean;
    can_search_related?: boolean;
  };
}

export interface UserRequest extends Request {
  from: string;
  user: DecodedUserToken;
}

export interface paginationData {
  page?: number;
  limit?: number;
  categoryId?: string;
  keyword?: string;
  role?: UserType;
}
