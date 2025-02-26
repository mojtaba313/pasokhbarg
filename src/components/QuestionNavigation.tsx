'use client'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

interface QuestionNavigationProps {
  questions: Array<{
    number: number
    selectedOption?: number
    timeSpent: number
  }>
  currentQuestion: number
  onChangeQuestion: (index: number) => void
  mobilePage: number
  onPageChange: (page: number) => void
}

export default function QuestionNavigation({
  questions,
  currentQuestion,
  onChangeQuestion,
  mobilePage,
  onPageChange,
}: QuestionNavigationProps) {
  const itemsPerPage = 10
  const totalPages = Math.ceil(questions?.length / itemsPerPage)

  // پیکربندی برای نمایش دسکتاپ
  const DesktopView = () => (
    <div className="hidden md:block w-64">
      <div className="grid grid-cols-5 gap-2">
        {questions?.map((q, index) => (
          <button
            key={q.number}
            onClick={() => onChangeQuestion(index)}
            className={clsx(
              'w-full p-2 rounded text-sm transition-colors',
              {
                'bg-blue-500 text-white': currentQuestion === index,
                'bg-green-100 dark:bg-green-900': q.selectedOption !== undefined,
                'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600':
                  currentQuestion !== index && q.selectedOption === undefined,
              }
            )}
          >
            {q.number}
          </button>
        ))}
      </div>
    </div>
  )

  // پیکربندی برای نمایش موبایل
  const MobilePagination = () => (
    <div className="md:hidden">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => onPageChange(Math.max(1, mobilePage - 1))}
          disabled={mobilePage === 1}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          قبلی
        </button>
        
        <span className="text-sm">
          صفحه {mobilePage} از {totalPages}
        </span>

        <button
          onClick={() => onPageChange(Math.min(totalPages, mobilePage + 1))}
          disabled={mobilePage === totalPages}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          بعدی
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {questions
          .slice((mobilePage - 1) * itemsPerPage, mobilePage * itemsPerPage)
          .map((q, index) => {
            const absoluteIndex = (mobilePage - 1) * itemsPerPage + index
            return (
              <button
                key={q.number}
                onClick={() => onChangeQuestion(absoluteIndex)}
                className={clsx(
                  'w-full p-2 rounded text-sm transition-colors',
                  {
                    'bg-blue-500 text-white': currentQuestion === absoluteIndex,
                    'bg-green-100 dark:bg-green-900': q.selectedOption !== undefined,
                    'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600':
                      currentQuestion !== absoluteIndex && q.selectedOption === undefined,
                  }
                )}
              >
                {q.number}
              </button>
            )
          })}
      </div>
    </div>
  )

  return (
    <>
      <DesktopView />
      <MobilePagination />
    </>
  )
}