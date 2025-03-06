"use server";
import SingleAdminManage from "@/components/master/SingleAdminManage";
import mongoose from "mongoose";
import React from "react";

const SingleAdminManagePage = async ({
  params,
}: {
  params: Promise<{ adminId: string }>;
}) => {
  const adminId = (await params).adminId as unknown as mongoose.Types.ObjectId || "";
  
  return <SingleAdminManage adminId={adminId} />;
};

export default SingleAdminManagePage;
