'use client'
import { useState, useEffect } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'

interface TimerProps {
  startTime: Date
  endTime?: Date
}

export default function Timer({ startTime, endTime }: TimerProps) {
  const [time, setTime] = useState<string>('00:00:00')
  const [isRunning, setIsRunning] = useState(!endTime)

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRunning) {
      interval = setInterval(() => {
        const now = endTime ? new Date(endTime) : new Date()
        const diff = now.getTime() - new Date(startTime).getTime()
        setTime(formatTime(diff))
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, startTime, endTime])

  return (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
      <ClockIcon className="w-5 h-5" />
      <span className="font-mono">{time}</span>
    </div>
  )
}