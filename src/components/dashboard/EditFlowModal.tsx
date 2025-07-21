import React from 'react'
import { useTheme } from '../ThemeProvider'

interface EditFlowModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  flowName: string
  flowDescription: string
  onFlowNameChange: (name: string) => void
  onFlowDescriptionChange: (description: string) => void
  error: string
}

export const EditFlowModal: React.FC<EditFlowModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  flowName,
  flowDescription,
  onFlowNameChange,
  onFlowDescriptionChange,
  error
}) => {
  const { isDark } = useTheme()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md mx-4`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Edit Flow
        </h2>
        
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Flow Name *
            </label>
            <input
              type="text"
              value={flowName}
              onChange={(e) => onFlowNameChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter flow name"
              autoFocus
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={flowDescription}
              onChange={(e) => onFlowDescriptionChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter flow description (optional)"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark 
                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!flowName.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              flowName.trim()
                ? isDark 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                : isDark
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Update Flow
          </button>
        </div>
      </div>
    </div>
  )
} 