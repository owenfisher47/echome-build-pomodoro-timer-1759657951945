export type SessionType = 'work' | 'shortBreak' | 'longBreak'

export interface TimerSettings {
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  longBreakInterval: number // after how many work sessions
}

export interface TimerState {
  timeRemaining: number // in seconds
  isRunning: boolean
  sessionType: SessionType
  sessionCount: number
  currentSession: number
}

export interface Statistics {
  totalWorkSessions: number
  totalWorkTime: number // in minutes
  totalBreakTime: number // in minutes
  streakCount: number
  lastSessionDate: string
}