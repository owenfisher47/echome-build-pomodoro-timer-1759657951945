'use client'

import { Play, Pause, RotateCcw, SkipForward, Square } from 'lucide-react'

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
  onResetAll: () => void
}

export const TimerControls = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
  onResetAll,
}: TimerControlsProps) => {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={isRunning ? onPause : onStart}
          className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onReset}
          className="btn-secondary flex items-center gap-2 text-sm"
          title="Reset current timer"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        
        <button
          onClick={onSkip}
          className="btn-secondary flex items-center gap-2 text-sm"
          title="Skip to next session"
        >
          <SkipForward size={16} />
          Skip
        </button>
        
        <button
          onClick={onResetAll}
          className="btn-secondary flex items-center gap-2 text-sm"
          title="Reset all sessions"
        >
          <Square size={16} />
          Reset All
        </button>
      </div>
    </div>
  )
}