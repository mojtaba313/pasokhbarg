// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    _id: string;
    name?: string | null;
    username?: string | null;
    roles?: string[]; // اضافه کردن فیلد roles
    permissions?: string[]; // اضافه کردن فیلد permissions
  }

  interface Session {
    user?: {
      id: string;
      _id: string;
      name?: string | null;
      username?: string | null;
      roles?: string[]; // اضافه کردن فیلد roles
      permissions?: string[]; // اضافه کردن فیلد permissions
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
      roles?: string[]; // اضافه کردن فیلد roles
      permissions?: string[]; // اضافه کردن فیلد permissions
    };
  }
}