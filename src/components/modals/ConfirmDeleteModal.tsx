import React from 'react'
import { useTheme } from '../ThemeProvider'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName: string
  itemType?: string
}

/**
 * Modal component for confirming delete actions
 */
export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  itemType = 'item'
}) => {
  const { isDark } = useTheme()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🗑️</span>
            </div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
            {message}
          </p>
          
          <div className={`p-3 rounded-lg border ${
            isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <div>
                <p className={`font-medium ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                  {itemType}: "{itemName}"
                </p>
                <p className={`text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
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
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Delete {itemType}
          </button>
        </div>
      </div>
    </div>
  )
} 