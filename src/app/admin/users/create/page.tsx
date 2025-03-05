"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    roles: ["user"],
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/users");
      } else {
        const data = await res.json();
        setError(data.error || "خطا در ایجاد کاربر");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">ایجاد کاربر جدید</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block">نام</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block">نام کاربری</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block">رمز عبور</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="roles" className="block">نقش‌ها</label>
            <select
              id="roles"
              multiple
              value={formData.roles}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roles: Array.from(e.target.selectedOptions, (opt) => opt.value),
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="admin">مدیر</option>
              <option value="user">کاربر عادی</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            ایجاد کاربر
          </button>
        </div>
      </form>
    </div>
  );
}
