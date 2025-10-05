'use client'

import { CircularProgress } from './CircularProgress'
import { SessionType } from '../types/timer'

interface TimerDisplayProps {
  timeRemaining: number
  totalTime: number
  sessionType: SessionType
  currentSession: number
}

export const TimerDisplay = ({
  timeRemaining,
  totalTime,
  sessionType,
  currentSession,
}: TimerDisplayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const percentage = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0

  const getSessionConfig = (type: SessionType) => {
    switch (type) {
      case 'work':
        return {
          label: 'Focus Time',
          color: '#8b5cf6',
          bgColor: 'from-purple-500/20 to-pink-500/20',
          emoji: '🍅',
        }
      case 'shortBreak':
        return {
          label: 'Short Break',
          color: '#10b981',
          bgColor: 'from-green-500/20 to-blue-500/20',
          emoji: '☕',
        }
      case 'longBreak':
        return {
          label: 'Long Break',
          color: '#f59e0b',
          bgColor: 'from-yellow-500/20 to-orange-500/20',
          emoji: '🎯',
        }
    }
  }

  const config = getSessionConfig(sessionType)

  return (
    <div className={`glass rounded-2xl p-8 text-center bg-gradient-to-br ${config.bgColor}`}>
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">{config.emoji}</span>
          <h2 className="text-xl font-semibold text-white/90">{config.label}</h2>
        </div>
        <p className="text-sm text-white/70">Session {currentSession}</p>
      </div>
      
      <div className="relative mb-6">
        <CircularProgress
          percentage={percentage}
          size={240}
          strokeWidth={12}
          color={config.color}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-white mb-1">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-white/60">
              {Math.ceil(timeRemaining / 60)} min left
            </div>
          </div>
        </div>
      </div>
      
      {timeRemaining === 0 && (
        <div className="animate-pulse-slow">
          <p className="text-lg font-semibold text-white">
            {sessionType === 'work' ? 'Time for a break!' : 'Ready to focus?'}
          </p>
        </div>
      )}
    </div>
  )
}