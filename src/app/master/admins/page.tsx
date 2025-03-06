"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { IUser } from "@/models/User";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import {
  ExclamationCircleIcon,
  TrashIcon,
  PlusIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import mongoose from "mongoose";
import { Loader } from "@/components/Loader";
import Link from "next/link";
import UserSelectionPopup from '@/components/layout/UserSelectionPopup'

const SingleAdminManage = () => {
  const { data: session } = useSession();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [allAdmins, setAllAdmins] = useState<IUser[]>([]);

  const fetchUsers = async () => {
    const adminId =
      (session?.user?._id as unknown as mongoose.Types.ObjectId) || "";
    if (!session?.user?._id || !adminId) return;

    try {
      setIsLoading(true);
      const res = await fetch("/api/master/admins");
      if (!res.ok) throw new Error("Failed to fetch users");
      const { admins, users } = await res.json();
      setAllUsers(users);
      setAllAdmins(admins);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching all admins:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.roles?.includes("master")) {
      fetchUsers();
    }
  }, [session]);

  const showToast = (severity: "success" | "error", message: string) => {
    toast.current?.show({
      severity,
      summary: severity === "success" ? "Success" : "Error",
      detail: message,
    });
  };

  const handleAddAdmin = async (
    selectedUsers: IUser[],
    callback?: () => void
  ) => {
    try {
      const res = await fetch("/api/master/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-admin",
          userIds: selectedUsers.map((u) => u._id),
        }),
      });

      if (res.ok) {
        showToast("success", "مدیران با موفقیت اضافه شدند");
        fetchUsers();
        setIsAddUserModalVisible(false);
        callback?.();
      } else {
        showToast("error", "خطا در افزودن مدیران");
      }
    } catch (error) {
      showToast("error", "خطا در ارتباط با سرور");
    }
  };

  const handleRemoveFromَAdmins = async (user: IUser) => {
    confirmDialog({
      header: "حذف کاربر از لیست مدیران",
      message: (
        <div className="flex items-center">
          <ExclamationCircleIcon className="text-2xl mx-2 text-red-500" />
          <h3>
            آیا مطمئن هستید که می‌خواهید کاربر{" "}
            <span className="text-primary">{user.name}</span> را از لیست مدیران
            حذف کنید؟
          </h3>
        </div>
      ),
      accept: async () => {
        try {
          const res = await fetch(`/api/master/admins`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "remove-admin",
              adminId: user._id,
            }),
          });

          if (res.ok) {
            showToast("success", "کاربر با موفقیت از زیرمجموعه حذف شد");
            fetchUsers();
          } else {
            showToast("error", "خطا در حذف کاربر از زیرمجموعه");
          }
        } catch (error) {
          showToast("error", "خطا در ارتباط با سرور");
        }
      },
      acceptLabel: "آره، حذفش کن",
      rejectLabel: "بی خیال",
    });
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <section className="bg-white rounded-md shadow-md p-5">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <InputText
              placeholder="جستجو..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64"
            />
            <Button
              icon={<PlusIcon className="h-5 w-5" />}
              label="افزودن کاربر"
              onClick={() => setIsAddUserModalVisible(true)}
              className="p-button-success"
            />
          </div>
          <DataTable
            value={allAdmins}
            editMode="row"
            dataKey="_id"
            tableStyle={{ minWidth: "15rem" }}
            className="w-full border rounded-md overflow-hidden"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
          >
            <Column field="name" header="نام" />
            <Column field="username" header="نام کاربری" />
            <Column
              header="عملیات"
              body={(rowData: IUser) => (
                <div className="flex items-center gap-2">
                  <Button
                    icon={<TrashIcon className="h-4 w-4 text-red-500" />}
                    className="p-button-text p-button-danger"
                    onClick={() => handleRemoveFromَAdmins(rowData)}
                  />
                  <Link href={`admins/${rowData._id}`}>
                    <ArrowLongLeftIcon width={20} className="text-blue-500" />
                  </Link>
                </div>
              )}
            />
          </DataTable>
        </div>
      </section>

      <UserSelectionPopup
        isShow={isAddUserModalVisible}
        setIsShow={setIsAddUserModalVisible}
        users={allUsers}
        onSubmit={handleAddAdmin}
      />

      <Toast ref={toast} />
      <ConfirmDialog />
    </>
  );
};

export default SingleAdminManage;
