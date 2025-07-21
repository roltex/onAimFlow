import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface CompositeHeaderProps {
  compositeName?: string
  onBackToDashboard?: () => void
  onClearComposite?: () => void
  onCreateComposite?: () => void
  onTogglePublish?: () => void
  isPublished?: boolean
}

/**
 * Header component for composite node editor
 */
export const CompositeHeader: React.FC<CompositeHeaderProps> = ({ 
  compositeName, 
  onBackToDashboard, 
  onClearComposite, 
  onCreateComposite, 
  onTogglePublish, 
  isPublished 
}) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className={`${isDark ? 'bg-white/8' : 'bg-white/70'} backdrop-blur-md border-b ${isDark ? 'border-white/20' : 'border-gray-200'} flex-shrink-0 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Title */}
          <div className="flex items-center">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                Composite Editor
              </h1>
              {compositeName && (
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  {compositeName}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Create Composite Button */}
            {onCreateComposite && (
              <button 
                onClick={onCreateComposite}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isDark 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title="Create New Composite"
              >
                + Create Composite
              </button>
            )}
            
            {/* Back to Dashboard Button */}
            {onBackToDashboard && (
              <button 
                onClick={onBackToDashboard}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title="Back to Dashboard"
              >
                ← Dashboard
              </button>
            )}
            
            {/* Publish/Unpublish Button */}
            {onTogglePublish && (
              <button 
                onClick={onTogglePublish}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isPublished
                    ? isDark 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                    : isDark
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                title={isPublished ? 'Unpublish this composite' : 'Publish this composite'}
              >
                {isPublished ? '📤 Unpublish' : '🚀 Publish'}
              </button>
            )}
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'bg-white/8 hover:bg-white/15 text-white' 
                  : 'bg-white/50 hover:bg-white/70 text-gray-700'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Clear Composite Button */}
            {onClearComposite && (
              <button 
                onClick={onClearComposite}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isDark 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                title="Delete this composite"
              >
                Delete Composite
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 