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

        console.log("Credentials:", credentials); // لاگ اطلاعات ورودی

        const user = await User.findOne({ username: credentials?.username });
        console.log("user authOptions", user);
        if (!user) {
          console.log("User not found"); // لاگ عدم یافتن کاربر
          throw new Error("کاربر یافت نشد");
        }

        const isValid = await bcrypt.compare(
          credentials?.password || "",
          user.password
        );
        if (!isValid) {
          console.log("Invalid password"); // لاگ رمز عبور نامعتبر
          throw new Error("رمز عبور نامعتبر");
        }

        console.log("User authorized:", user); // لاگ کاربر احراز هویت شده
        return {
          id: user._id,
          _id: user._id,
          username: user.username,
          name: user.name,
          roles: user.roles,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          _id: user._id,
          name: user.name,
          username: user.username,
          roles: user.roles, // اضافه کردن roles به توکن
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          id: token.user.id,
          _id: token.user._id,
          name: token.user.name,
          username: token.user.username,
          roles: token.user.roles, // اضافه کردن roles به session
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // مسیر صفحه ورود
    error: "/auth/signin", // مسیر صفحه خطا (اختیاری)
  },
  secret: process.env.NEXTAUTH_SECRET, // کلید رمزنگاری
};
