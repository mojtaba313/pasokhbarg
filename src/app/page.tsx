'use client'
import { useState, useEffect } from 'react'
import { PlusIcon, DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import axios from 'axios'
import CreateTestModal from '../components/CreateTestModal'
import ConfirmModal from '../components/ConfirmModal'

interface Test {
  _id: string
  title: string
  startQuestion: number
  endQuestion: number
  startTime: string
}

export default function Home() {
  const [tests, setTests] = useState<Test[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [testToDelete, setTestToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchTests = async () => {
      const { data } = await axios.get('/api/tests')
      setTests(data)
    }
    fetchTests()
  }, [])

  const handleDeleteTest = async () => {
    if (!testToDelete) return

    try {
      await axios.delete(`/api/tests/${testToDelete}`)
      setTests(tests.filter(test => test._id !== testToDelete))
      setShowConfirmModal(false)
    } catch (error) {
      console.error('Failed to delete test:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            آزمون‌های من
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg hover:shadow-blue-500/50"
          >
            <PlusIcon className="w-5 h-5" />
            آزمون جدید
          </button>
        </div>

        {/* لیست آزمون‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map(test => (
            <div
              key={test._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 relative group"
            >
              {/* دکمه حذف */}
              <button
                onClick={() => {
                  setTestToDelete(test._id)
                  setShowConfirmModal(true)
                }}
                className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <TrashIcon className="w-6 h-6" />
              </button>

              {/* محتوای کارت */}
              <Link href={`/test/${test._id}`}>
                <DocumentTextIcon className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {test.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  سوالات {test.startQuestion} تا {test.endQuestion}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(test.startTime).toLocaleDateString('fa-IR')}
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/* مودال ایجاد آزمون */}
        <CreateTestModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />

        {/* مودال تأیید حذف */}
        <ConfirmModal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteTest}
          title="حذف آزمون"
          description="آیا مطمئن هستید که می‌خواهید این آزمون را حذف کنید؟ این عمل برگشت‌ناپذیر است."
        />
      </div>
    </div>
  )
}