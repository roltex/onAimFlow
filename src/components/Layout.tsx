import React, { memo } from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface LayoutProps {
  children: React.ReactNode
}

/**
 * Main layout wrapper with theme-aware background gradient
 */
export const Layout = memo<LayoutProps>(({ children }) => {
  const { isDark } = useTheme()

  return (
    <div 
      className={`h-screen flex flex-col transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-50'
      }`}
    >
      {children}
    </div>
  )
}) 