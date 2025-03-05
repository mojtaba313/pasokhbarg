"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import User, { IUser } from "@/models/User";
import Link from "next/link";

export default function UserManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      let url = '/api/admin/users';
      if (session?.user?.roles?.includes('admin') && !session?.user?.roles?.includes('master')) {
        url += `?adminId=${session.user?._id}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, [session]);

  const getFilteredUsers = () => {
    if (currentAdmin) {
      return users.filter(u => 
        u.supervisors.some((s: any) => s._id === currentAdmin._id)
      );
    }
    return users;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">مدیریت کاربران</h1>
      
      {session?.user?.roles?.includes('master') && (
        <div className="mb-4">
          <button
            onClick={() => setCurrentAdmin(null)}
            className={`mr-2 ${!currentAdmin ? 'bg-blue-500 text-white' : ''}`}
          >
            همه کاربران
          </button>
          {users.filter(u => u.roles.includes('admin')).map(admin => (
            <button
              key={admin._id}
              onClick={() => setCurrentAdmin(admin)}
              className={`mr-2 ${currentAdmin?._id === admin._id ? 'bg-blue-500 text-white' : ''}`}
            >
              {admin.name}
            </button>
          ))}
        </div>
      )}

      <table className="w-full border-collapse">
        {/* ... جدول کاربران با فیلتر مناسب */}
      </table>
    </div>
  );
}