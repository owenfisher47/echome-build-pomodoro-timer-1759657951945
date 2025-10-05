'use client'

import { useTimer } from './hooks/useTimer'
import { TimerDisplay } from './components/TimerDisplay'
import { TimerControls } from './components/TimerControls'
import { Statistics } from './components/Statistics'
import { Settings } from './components/Settings'
import { useEffect } from 'react'

export default function Home() {
  const {
    timerState,
    settings,
    statistics,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    resetAllSessions,
    updateSettings,
    resetStatistics,
  } = useTimer()

  const getTotalTime = () => {
    switch (timerState.sessionType) {
      case 'work':
        return settings.workDuration * 60
      case 'shortBreak':
        return settings.shortBreakDuration * 60
      case 'longBreak':
        return settings.longBreakDuration * 60
    }
  }

  // Update document title with remaining time
  useEffect(() => {
    const minutes = Math.floor(timerState.timeRemaining / 60)
    const seconds = timerState.timeRemaining % 60
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    
    const sessionEmoji = {
      work: '🍅',
      shortBreak: '☕',
      longBreak: '🎯',
    }[timerState.sessionType]

    document.title = timerState.isRunning 
      ? `${timeString} ${sessionEmoji} | Pomodoro Timer`
      : 'Pomodoro Timer - Focus & Productivity'
  }, [timerState.timeRemaining, timerState.isRunning, timerState.sessionType])

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🍅 Pomodoro Timer
          </h1>
          <p className="text-white/70">
            Boost your productivity with focused work sessions
          </p>
        </header>

        {/* Main Timer Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <TimerDisplay
              timeRemaining={timerState.timeRemaining}
              totalTime={getTotalTime()}
              sessionType={timerState.sessionType}
              currentSession={timerState.currentSession}
            />
            
            <div className="mt-6">
              <TimerControls
                isRunning={timerState.isRunning}
                onStart={startTimer}
                onPause={pauseTimer}
                onReset={resetTimer}
                onSkip={skipSession}
                onResetAll={resetAllSessions}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <Statistics
              stats={statistics}
              onReset={resetStatistics}
            />
          </div>
        </div>

        {/* Settings */}
        <div className="flex justify-center">
          <Settings
            settings={settings}
            onUpdate={updateSettings}
          />
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-white/50 text-sm">
          <p>
            Based on the Pomodoro Technique® by Francesco Cirillo
          </p>
        </footer>
      </div>
    </main>
  )
}