// app/admin/access/page.tsx
"use client";
import { useState, useEffect } from "react";
import PageAccess, { IPageAccess } from "@/models/PageAccess";
import User, { IUser } from "@/models/User";
import { useSession } from "next-auth/react";

export default function AccessManagement() {
  const { data: session } = useSession();
  const [pages, setPages] = useState<IPageAccess[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    fetch("/api/admin/access")
      .then((res) => res.json())
      .then((data) => setPages(data));

    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const updatePageAccess = async (
    pageId: string,
    updates: Partial<IPageAccess>
  ) => {
    const res = await fetch(`/api/admin/access/${pageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updatedPage = await res.json();
    setPages(pages.map((p) => (p._id === updatedPage._id ? updatedPage : p)));
  };

  if (!session?.user?.roles?.includes("admin")) {
    console.log(session?.user)
    return <div>دسترسی غیرمجاز</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">مدیریت دسترسی صفحات</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th>مسیر صفحه</th>
            <th>عمومی</th>
            <th>کاربران مجاز</th>
            <th>نقش‌های مجاز</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id}>
              <td>{page.pageRoute}</td>
              <td>
                <input
                  type="checkbox"
                  checked={page.isPublic}
                  onChange={(e) =>
                    updatePageAccess(page._id, { isPublic: e.target.checked })
                  }
                />
              </td>
              <td>
                <select
                  multiple
                  value={page.allowedUsers.map((u) => u.toString())}
                  onChange={(e) => {
                    const selectedUsers = Array.from(
                      e.target.selectedOptions,
                      (opt) => opt.value
                    );
                    updatePageAccess(page._id, { allowedUsers: selectedUsers });
                  }}
                >
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.username})
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  multiple
                  value={page.allowedRoles}
                  onChange={(e) => {
                    const selectedRoles = Array.from(
                      e.target.selectedOptions,
                      (opt) => opt.value
                    );
                    updatePageAccess(page._id, { allowedRoles: selectedRoles });
                  }}
                >
                  <option value="admin">مدیر</option>
                  <option value="user">کاربر عادی</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() =>
                    updatePageAccess(page._id, { isPublic: !page.isPublic })
                  }
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  ذخیره
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
