// components/AssistantManager.tsx
"use client";
import { useState } from "react";
import { IUser } from "@/models/User";

export default function AssistantManager({ admin }: { admin: IUser }) {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  const loadUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.filter((u: IUser) => u.roles.includes('user')));
  };

  const handleAddAssistant = async () => {
    const res = await fetch('/api/admin/hierarchy', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        action: 'add-assistant',
        adminId: admin._id,
        userId: selectedUser,
        permissions
      })
    });
    
    if(res.ok) {
      // Alert('دستیار با موفقیت اضافه شد');
      loadUsers();
    }
  };

  const handlePermissionChange = (perm: string) => {
    const newPerms = permissions.includes(perm)
      ? permissions.filter(p => p !== perm)
      : [...permissions, perm];
    
    // چک کردن دسترسی های مجاز
    if(admin.permissions.some(p => newPerms.includes(p))) {
      setPermissions(newPerms);
    } else {
      // Alert.error('دستیار نمی تواند دسترسی بیشتری از ادمین داشته باشد');
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="text-xl mb-4">مدیریت دستیارها</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* <Select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          displayEmpty
          className="w-full"
        >
          <option value="">انتخاب کاربر</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.username})
            </option>
          ))}
        </Select> */}

        <div className="grid grid-cols-2 gap-2">
          {admin.permissions?.map(perm => (
            <div key={perm} className="flex items-center">
              {/* <Checkbox
                checked={permissions.includes(perm)}
                onChange={() => handlePermissionChange(perm)}
              /> */}
              <span>{perm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* <Button 
        variant="contained" 
        className="mt-4"
        onClick={handleAddAssistant}
        disabled={!selectedUser || permissions.length === 0}
      >
        افزودن دستیار
      </Button> */}
    </div>
  );
}