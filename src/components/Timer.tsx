// components/Timer.tsx
'use client'

import { ClockIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface TimerProps {
  startTime: Date
  endTime?: Date
}

export default function Timer({ startTime, endTime }: TimerProps) {
  const [time, setTime] = useState('00:00:00')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = endTime ? new Date(endTime) : new Date()
      const diff = now.getTime() - new Date(startTime).getTime()
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTime(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, endTime])

  return (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
      <ClockIcon className="w-5 h-5" />
      <span className="font-mono">{time}</span>
    </div>
  )
}