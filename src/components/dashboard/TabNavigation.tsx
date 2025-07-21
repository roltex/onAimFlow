import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface TabNavigationProps {
  activeTab: 'flows' | 'customNodes' | 'compositeNodes'
  onTabChange: (tab: 'flows' | 'customNodes' | 'compositeNodes') => void
  flowsCount: number
  customNodesCount: number
  compositeNodesCount: number
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  flowsCount,
  customNodesCount,
  compositeNodesCount
}) => {
  const { isDark } = useTheme()

  return (
    <div className="flex space-x-1 mb-6">
      <button
        onClick={() => onTabChange('flows')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
          activeTab === 'flows'
            ? isDark 
              ? 'bg-blue-500 text-white' 
              : 'bg-blue-600 text-white'
            : isDark 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Workflows ({flowsCount})
      </button>
      <button
        onClick={() => onTabChange('customNodes')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
          activeTab === 'customNodes'
            ? isDark 
              ? 'bg-purple-500 text-white' 
              : 'bg-purple-600 text-white'
            : isDark 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Custom Nodes ({customNodesCount})
      </button>
      <button
        onClick={() => onTabChange('compositeNodes')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
          activeTab === 'compositeNodes'
            ? isDark 
              ? 'bg-green-500 text-white' 
              : 'bg-green-600 text-white'
            : isDark 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Composite Nodes ({compositeNodesCount})
      </button>
    </div>
  )
} 