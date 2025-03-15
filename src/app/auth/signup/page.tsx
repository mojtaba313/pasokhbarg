"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";

export default function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsFetching(true);
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      if (res.ok) {
        router.push("/auth/signin");
      } else {
        const data = await res.json();
        setError(data.message || "خطا در ثبت‌نام");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    }
    setIsFetching(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          ثبت‌نام
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="نام"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="username"
              placeholder="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <button
              type="submit"
              disabled={isFetching}
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300/30 disabled:cursor-not-allowed flex justify-center"
            >
              {isFetching ? (
                <Spinner style={{ width: 20, height: 20 }} />
              ) : (
                "ثبت‌نام"
              )}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          قبلاً حساب کاربری دارید؟{" "}
          <Link href="/auth/signin" className="text-blue-500 hover:underline">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}
