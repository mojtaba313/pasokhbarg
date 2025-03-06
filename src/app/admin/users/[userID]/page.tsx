import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { ShieldCheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import PaginationControls from "@/components/PaginationControls";

// Placeholder components (replace with your actual implementations)
const Badge = ({
  count,
  color,
  className,
}: {
  count: number;
  color: string;
  className?: string;
}) => (
  <span
    className={`bg-${color}-100 text-${color}-800 text-xs font-semibold px-2.5 py-0.5 rounded ${className}`}
  >
    {count}
  </span>
);

const RoleFilter = ({
  currentRole,
  onChange,
}: {
  currentRole: string;
  onChange: (role: string) => void;
}) => (
  <select
    value={currentRole}
    onChange={(e) => onChange(e.target.value)}
    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
  >
    <option value="all">همه نقش‌ها</option>
    <option value="admin">ادمین</option>
    <option value="user">کاربر</option>
  </select>
);

const SearchInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full max-w-md"
  />
);

const ActionButton = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
  >
    {icon}
  </button>
);

// Define the User type
type User = {
  id: string;
  name: string;
  username: string;
  roles: string[];
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentRole, setCurrentRole] = useState("all");

  const columns = useMemo(
    () => [
      {
        header: "اطلاعات کاربر",
        columns: [
          { accessorKey: "name", header: "نام کامل" },
          { accessorKey: "username", header: "نام کاربری" },
          {
            accessorKey: "roles",
            header: "نقش‌ها",
            cell: ({ getValue }: { getValue: () => string[] }) =>
              getValue().join(", "),
          },
        ],
      },
      {
        header: "مدیریت",
        columns: [
          {
            id: "actions",
            cell: ({ row }: { row: { original: User } }) => (
              <div className="flex gap-2">
                <ActionButton
                  icon={<ShieldCheckIcon className="w-5 h-5" />} // Updated icon
                  onClick={() => openRoleModal(row.original)}
                />
                <ActionButton
                  icon={<PlusIcon className="w-5 h-5" />} // Updated icon
                  onClick={() => openHierarchyModal(row.original)}
                />
              </div>
            ),
          },
        ],
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Placeholder functions for modals
  const openRoleModal = (user: User) => {
    console.log("Open role modal for:", user);
  };

  const openHierarchyModal = (user: User) => {
    console.log("Open hierarchy modal for:", user);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          مدیریت کاربران
          <Badge count={users.length} color="blue" className="mr-2" />
        </h1>

        <RoleFilter currentRole={currentRole} onChange={setCurrentRole} />
      </div>

      <div className="mb-4">
        <SearchInput
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="جستجو در کاربران..."
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border rounded-lg overflow-hidden"
      >
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <motion.tr
                key={row.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <PaginationControls
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        onPrev={table.previousPage}
        onNext={table.nextPage}
      />
    </div>
  );
};

export default UsersPage;
