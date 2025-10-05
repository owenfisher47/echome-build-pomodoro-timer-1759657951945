'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, X } from 'lucide-react'
import { TimerSettings } from '../types/timer'

interface SettingsProps {
  settings: TimerSettings
  onUpdate: (settings: Partial<TimerSettings>) => void
}

export const Settings = ({ settings, onUpdate }: SettingsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempSettings, setTempSettings] = useState(settings)

  const handleSave = () => {
    onUpdate(tempSettings)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempSettings(settings)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary flex items-center gap-2"
        title="Settings"
      >
        <SettingsIcon size={16} />
        Settings
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <SettingsIcon className="text-purple-400" size={20} />
            Timer Settings
          </h3>
          <button
            onClick={handleCancel}
            className="text-white/60 hover:text-white/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Focus Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={tempSettings.workDuration}
              onChange={(e) =>
                setTempSettings(prev => ({
                  ...prev,
                  workDuration: parseInt(e.target.value) || 25,
                }))
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                         text-white placeholder-white/50 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Short Break Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={tempSettings.shortBreakDuration}
              onChange={(e) =>
                setTempSettings(prev => ({
                  ...prev,
                  shortBreakDuration: parseInt(e.target.value) || 5,
                }))
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                         text-white placeholder-white/50 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Long Break Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={tempSettings.longBreakDuration}
              onChange={(e) =>
                setTempSettings(prev => ({
                  ...prev,
                  longBreakDuration: parseInt(e.target.value) || 15,
                }))
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                         text-white placeholder-white/50 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Long Break Interval (sessions)
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={tempSettings.longBreakInterval}
              onChange={(e) =>
                setTempSettings(prev => ({
                  ...prev,
                  longBreakInterval: parseInt(e.target.value) || 4,
                }))
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                         text-white placeholder-white/50 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-white/60 mt-1">
              Take a long break every N work sessions
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} className="btn-primary flex-1">
            Save Changes
          </button>
          <button onClick={handleCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}