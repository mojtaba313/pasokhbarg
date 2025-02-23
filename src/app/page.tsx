'use client'
import { useState, useEffect } from 'react'
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import axios from 'axios'
import CreateTestModal from '../components/CreateTestModal'

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

  useEffect(() => {
    const fetchTests = async () => {
      const { data } = await axios.get('/api/tests')
      setTests(data)
    }
    fetchTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">آزمون‌های من</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            آزمون جدید
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map(test => (
            <Link
              key={test._id}
              href={`/test/${test._id}`}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <DocumentTextIcon className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
              <p className="text-gray-600">
                سوالات {test.startQuestion} تا {test.endQuestion}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(test.startTime).toLocaleDateString('fa-IR')}
              </p>
            </Link>
          ))}
        </div>

        <CreateTestModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </div>
  )
}