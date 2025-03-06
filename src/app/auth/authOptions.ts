// app/auth/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials?.username || !credentials?.password) {
          throw new Error("لطفاً نام کاربری و رمز عبور را وارد کنید");
        }

        const user = await User.findOne({ username: credentials.username });
        if (!user) {
          throw new Error("کاربر یافت نشد");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("رمز عبور نامعتبر است");
        }

        return {
          id: user._id.toString(),
          _id: user._id.toString(),
          username: user.username,
          name: user.name,
          roles: user.roles,
          permissions: user.permissions, // اضافه کردن فیلد permissions
          managedUsers: user.managedUsers?.map((u:any) => u.toString()), // اضافه کردن فیلد managedUsers
          managedBy: user.managedBy?.toString(), // اضافه کردن فیلد managedBy
          maxPermissions: user.maxPermissions, // اضافه کردن فیلد maxPermissions
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};