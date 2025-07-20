import React from 'react'
import { useTheme } from '../ThemeProvider'
import type { FlowValidationResult } from '../../types'
import { getValidationSummary } from '../../utils/flowValidation'

interface ValidationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  validationResult: FlowValidationResult
  flowName: string
  action: 'publish' | 'validate'
}

/**
 * Modal component for displaying flow validation results
 */
export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  validationResult,
  flowName,
  action
}) => {
  const { isDark } = useTheme()

  if (!isOpen) return null

  const canProceed = validationResult.isValid
  const summary = getValidationSummary(validationResult)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {action === 'publish' ? 'Publish Flow' : 'Flow Validation'}
          </h2>
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

        {/* Flow Name */}
        <div className="mb-4">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Flow: <span className="font-medium">{flowName}</span>
          </p>
        </div>

        {/* Validation Summary */}
        <div className={`p-4 rounded-lg mb-4 ${
          validationResult.isValid
            ? isDark ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
            : isDark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`font-medium ${
            validationResult.isValid
              ? isDark ? 'text-green-300' : 'text-green-800'
              : isDark ? 'text-red-300' : 'text-red-800'
          }`}>
            {summary}
          </p>
        </div>

        {/* Validation Errors */}
        {validationResult.errors.length > 0 && (
          <div className="mb-4">
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
              ❌ Errors ({validationResult.errors.length})
            </h3>
            <ul className="space-y-1">
              {validationResult.errors.map((error, index) => (
                <li 
                  key={index}
                  className={`text-sm p-2 rounded ${
                    isDark ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-700'
                  }`}
                >
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Validation Warnings */}
        {validationResult.warnings && validationResult.warnings.length > 0 && (
          <div className="mb-4">
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
              ⚠️ Warnings ({validationResult.warnings.length})
            </h3>
            <ul className="space-y-1">
              {validationResult.warnings.map((warning, index) => (
                <li 
                  key={index}
                  className={`text-sm p-2 rounded ${
                    isDark ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-50 text-yellow-700'
                  }`}
                >
                  • {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Message */}
        {action === 'publish' && !validationResult.isValid && (
          <div className={`p-3 rounded-lg mb-4 ${
            isDark ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Please fix the errors above before publishing this flow.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark 
                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {action === 'publish' ? 'Cancel' : 'Close'}
          </button>
          
          {action === 'publish' && onConfirm && (
            <button
              onClick={onConfirm}
              disabled={!canProceed}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                canProceed
                  ? isDark 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  : isDark
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🚀 Publish Flow
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 