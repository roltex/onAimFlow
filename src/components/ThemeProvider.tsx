import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Theme provider component that manages dark/light mode
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
  })

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newTheme = !prev
      
      // Update DOM and localStorage
      if (newTheme) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
      
      return newTheme
    })
  }, [])

  // Apply theme on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
} 