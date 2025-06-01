'use server'
import AdminExamGroupResultPage from '@/components/admin/AdminExamGroupResultPage';
import React from 'react'

const AdminExamGroupResult = async({
  params,
}: {
  params: Promise<{ examId: string }>;
}) => {
   const examId = (await params).examId;

  return (
    <AdminExamGroupResultPage examId={examId}/>
  )
}

export default AdminExamGroupResult