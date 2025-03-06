// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    _id: string;
    name?: string | null;
    username?: string | null;
    roles: string[];
    permissions: string[];
    managedUsers?: string[]; // اضافه کردن فیلدهای جدید
    managedBy?: string;
    maxPermissions?: string[];
  }

  interface Session {
    user?: {
      id: string;
      _id: string;
      name?: string | null;
      username?: string | null;
      roles: string[];
      permissions: string[];
      managedUsers?: string[]; // اضافه کردن فیلدهای جدید
      managedBy?: string;
      maxPermissions?: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      _id: string;
      name?: string | null;
      username?: string | null;
      roles: string[];
      permissions: string[];
      managedUsers?: string[]; // اضافه کردن فیلدهای جدید
      managedBy?: string;
      maxPermissions?: string[];
    };
  }
}