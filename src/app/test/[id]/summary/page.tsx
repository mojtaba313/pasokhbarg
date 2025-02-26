// app/test/[id]/summary/page.tsx
'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
// import TestSummary from '../../../components/TestSummary'

export default function SummaryPage({ params }: { params: { id: string } }) {
  const [test, setTest] = useState<any>(null)

  useEffect(() => {
    const fetchTest = async () => {
      const { data } = await axios.get(`/api/tests/${params.id}`)
      setTest(data)
    }
    fetchTest()
  }, [params.id])

  if (!test) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* <TestSummary test={test} /> */}
      </div>
    </div>
  )
}