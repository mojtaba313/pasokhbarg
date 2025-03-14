"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { IUser } from "@/models/User";

export default function UserManagement() {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">مدیریت کاربران</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th>نام</th>
            <th>نقش</th>
            <th>دستیار</th>
            <th>دسترسی‌ها</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.roles.join(", ")}</td>
              <td>
                {user.managedBy
                  ? (user.managedBy as unknown as IUser).name
                  : "-"}
              </td>
              <td>{user.permissions?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}