import { useState } from 'react';
import { motion } from 'framer-motion';
import PermissionMatrix, { ActionT } from '@/components/admin/PermissionMatrix';

const PermissionSettingsPage = () => {
  const [modules, setModules] = useState([
    { id: 'users', name: 'کاربران', read: true, create: false, update: false, delete: false },
    // ... سایر ماژول‌ها
  ]);

  const handlePermissionChange = (moduleId:string, action:string, value:boolean) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, [action]: value } : m
    ));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          تنظیمات دسترسی‌ها
        </h1>
        
        <div className="space-y-4">
          {/* <Alert severity="info" className="mb-4">
            دسترسی‌های تعیین شده در این بخش به صورت سراسری اعمال خواهند شد
          </Alert> */}
          
          <PermissionMatrix 
            permissions={modules}
            onUpdate={handlePermissionChange}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PermissionSettingsPage;