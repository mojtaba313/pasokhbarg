// next-auth.d.ts
import "next-auth/jwt";
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    _id: string; // اضافه کردن فیلد _id
    name?: string | null;
    username?: string | null;
  }

  interface Session {
    user?: {
      id: string;
      _id: string; // اضافه کردن فیلد _id
      name?: string | null;
      username?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      _id: string; // اضافه کردن فیلد _id
      name?: string | null;
      username?: string | null;
    };
  }
}