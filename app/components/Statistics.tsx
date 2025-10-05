'use client'

import { Clock, Target, Zap, Calendar } from 'lucide-react'
import { Statistics as StatsType } from '../types/timer'

interface StatisticsProps {
  stats: StatsType
  onReset: () => void
}

export const Statistics = ({ stats, onReset }: StatisticsProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="text-purple-400" size={20} />
          Your Progress
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-white/60 hover:text-white/80 transition-colors"
        >
          Reset Stats
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="text-yellow-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalWorkSessions}</div>
          <div className="text-sm text-white/70">Sessions</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="text-blue-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white">{formatTime(stats.totalWorkTime)}</div>
          <div className="text-sm text-white/70">Focus Time</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="text-green-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white">{stats.streakCount}</div>
          <div className="text-sm text-white/70">Daily Streak</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="text-purple-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white">{formatTime(stats.totalBreakTime)}</div>
          <div className="text-sm text-white/70">Break Time</div>
        </div>
      </div>
    </div>
  )
}