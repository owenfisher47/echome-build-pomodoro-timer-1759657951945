'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { TimerState, TimerSettings, SessionType, Statistics } from '../types/timer'

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
}

const DEFAULT_STATS: Statistics = {
  totalWorkSessions: 0,
  totalWorkTime: 0,
  totalBreakTime: 0,
  streakCount: 0,
  lastSessionDate: '',
}

export const useTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS)
  const [timerState, setTimerState] = useState<TimerState>({
    timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
    isRunning: false,
    sessionType: 'work',
    sessionCount: 0,
    currentSession: 1,
  })
  const [statistics, setStatistics] = useState<Statistics>(DEFAULT_STATS)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Load saved data from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoro-settings')
    const savedStats = localStorage.getItem('pomodoro-stats')
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      setTimerState(prev => ({
        ...prev,
        timeRemaining: parsed.workDuration * 60,
      }))
    }
    
    if (savedStats) {
      setStatistics(JSON.parse(savedStats))
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings))
  }, [settings])

  // Save statistics to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-stats', JSON.stringify(statistics))
  }, [statistics])

  // Timer countdown logic
  useEffect(() => {
    if (timerState.isRunning && timerState.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }))
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState.isRunning, timerState.timeRemaining])

  // Handle session completion
  useEffect(() => {
    if (timerState.timeRemaining === 0 && timerState.isRunning) {
      handleSessionComplete()
    }
  }, [timerState.timeRemaining, timerState.isRunning])

  const playNotificationSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }, [])

  const handleSessionComplete = useCallback(() => {
    playNotificationSound()
    
    setTimerState(prev => {
      let nextSessionType: SessionType
      let nextSessionCount = prev.sessionCount
      let nextCurrentSession = prev.currentSession

      if (prev.sessionType === 'work') {
        nextSessionCount += 1
        if (nextSessionCount % settings.longBreakInterval === 0) {
          nextSessionType = 'longBreak'
        } else {
          nextSessionType = 'shortBreak'
        }
      } else {
        nextSessionType = 'work'
        if (prev.sessionType === 'shortBreak' || prev.sessionType === 'longBreak') {
          nextCurrentSession += 1
        }
      }

      const getDuration = (type: SessionType) => {
        switch (type) {
          case 'work': return settings.workDuration * 60
          case 'shortBreak': return settings.shortBreakDuration * 60
          case 'longBreak': return settings.longBreakDuration * 60
        }
      }

      return {
        ...prev,
        timeRemaining: getDuration(nextSessionType),
        isRunning: false,
        sessionType: nextSessionType,
        sessionCount: nextSessionCount,
        currentSession: nextCurrentSession,
      }
    })

    // Update statistics
    setStatistics(prev => {
      const today = new Date().toDateString()
      const newStats = { ...prev }

      if (timerState.sessionType === 'work') {
        newStats.totalWorkSessions += 1
        newStats.totalWorkTime += settings.workDuration
        if (prev.lastSessionDate === today) {
          newStats.streakCount += 1
        } else {
          newStats.streakCount = 1
        }
        newStats.lastSessionDate = today
      } else {
        const breakDuration = timerState.sessionType === 'shortBreak' 
          ? settings.shortBreakDuration 
          : settings.longBreakDuration
        newStats.totalBreakTime += breakDuration
      }

      return newStats
    })
  }, [settings, timerState.sessionType, playNotificationSound])

  const startTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: true }))
  }, [])

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: false }))
  }, [])

  const resetTimer = useCallback(() => {
    const duration = {
      work: settings.workDuration,
      shortBreak: settings.shortBreakDuration,
      longBreak: settings.longBreakDuration,
    }[timerState.sessionType] * 60

    setTimerState(prev => ({
      ...prev,
      timeRemaining: duration,
      isRunning: false,
    }))
  }, [settings, timerState.sessionType])

  const skipSession = useCallback(() => {
    setTimerState(prev => ({ ...prev, timeRemaining: 0 }))
  }, [])

  const resetAllSessions = useCallback(() => {
    setTimerState({
      timeRemaining: settings.workDuration * 60,
      isRunning: false,
      sessionType: 'work',
      sessionCount: 0,
      currentSession: 1,
    })
  }, [settings])

  const updateSettings = useCallback((newSettings: Partial<TimerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const resetStatistics = useCallback(() => {
    setStatistics(DEFAULT_STATS)
  }, [])

  return {
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
  }
}