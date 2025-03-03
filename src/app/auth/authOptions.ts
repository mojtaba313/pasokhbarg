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
        return { id: user._id, _id: user._id, username: user.username, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          _id: user._id, // اضافه کردن فیلد _id
          username: user.username,
          name: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          id: token.user.id,
          _id: token.user._id, // اضافه کردن فیلد _id
          username: token.user.username,
          name: token.user.name,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // مسیر صفحه ورود
    error: "/auth/signin", // مسیر صفحه خطا (اختیاری)
  },
  secret: 'the-testsecretkey', // کلید رمزنگاری
};