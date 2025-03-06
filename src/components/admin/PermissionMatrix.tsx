interface Permission {
  id: string;
  name: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export type ActionT = "read" | "create" | "update" | "delete";

interface PermissionMatrixProps {
  permissions: Permission[];
  onUpdate: (moduleId: string, action: string, value: boolean) => void;
}

const PermissionMatrix = ({ permissions, onUpdate }: PermissionMatrixProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              ماژول
            </th>
            <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              مشاهده
            </th>
            <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              ایجاد
            </th>
            <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              ویرایش
            </th>
            <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              حذف
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {permissions.map((module) => (
            <tr key={module.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {module.name}
              </td>
              {(["read", "create", "update", "delete"] as ActionT[]).map(
                (action) => (
                  <td
                    key={action}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    {/* <Switch
                      checked={module[action]}
                      onChange={(e) =>
                        onUpdate(module.id, action, e.target.checked)
                      }
                      color="primary"
                    /> */}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionMatrix;
