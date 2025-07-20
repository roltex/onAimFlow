import React, { useCallback, useMemo } from 'react'
import { useTheme } from '../ThemeProvider'
import type { NodeType, DynamicNodeType } from '../../types'

// Optimized node type definitions with better categorization
const NODE_TYPES: NodeType[] = [
  {
    id: 'event',
    type: 'event',
    label: 'EVENT',
    description: 'Trigger events and actions',
    icon: '⚡',
    color: 'from-blue-500 to-blue-600',
    category: 'trigger'
  },
  {
    id: 'filter',
    type: 'filter',
    label: 'FILTER',
    description: 'Filter and validate data',
    icon: '🔍',
    color: 'from-green-500 to-green-600',
    category: 'process'
  },
  {
    id: 'select',
    type: 'select',
    label: 'SELECT',
    description: 'Select and transform data',
    icon: '📊',
    color: 'from-purple-500 to-purple-600',
    category: 'process'
  },
  {
    id: 'output',
    type: 'output',
    label: 'OUTPUT',
    description: 'Output and export results',
    icon: '📤',
    color: 'from-orange-500 to-orange-600',
    category: 'output'
  }
]

interface EdgeDropModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (nodeType: NodeType | DynamicNodeType) => void
  position?: { x: number; y: number }
  sourceNodeLabel?: string
  dynamicNodeTypes?: DynamicNodeType[]
}

/**
 * Optimized modal component for edge drop functionality
 */
export const EdgeDropModal: React.FC<EdgeDropModalProps> = React.memo(({
  isOpen,
  onClose,
  onSelect,
  sourceNodeLabel,
  dynamicNodeTypes = []
}) => {
  const { isDark } = useTheme()

  // Memoize node types by category for better performance
  const nodeTypesByCategory = useMemo(() => {
    // Convert dynamic node types to a compatible format
    const dynamicNodeTypesFormatted = dynamicNodeTypes.map(dynamicType => ({
      id: dynamicType.id,
      type: dynamicType.id,
      label: dynamicType.name,
      description: dynamicType.description,
      icon: dynamicType.icon,
      color: dynamicType.color,
      category: 'custom',
      isCustom: true
    }))

    // Combine built-in and dynamic node types
    const allNodeTypes = [...NODE_TYPES, ...dynamicNodeTypesFormatted]
    
    const categories = allNodeTypes.reduce((acc, nodeType) => {
      const category = nodeType.category || 'other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(nodeType)
      return acc
    }, {} as Record<string, any[]>)

    return Object.entries(categories)
  }, [dynamicNodeTypes])

  // Optimized select handler with useCallback
  const handleSelect = useCallback((nodeType: any) => {
    onSelect(nodeType)
    onClose()
  }, [onSelect, onClose])

  // Optimized backdrop click handler
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])



  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
          rounded-xl border shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col transform transition-all duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Add Node
            </h2>
            {sourceNodeLabel && (
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Connecting from: <span className="font-medium">{sourceNodeLabel}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Select the type of node to create:
          </p>

          {/* Node Type Options */}
          <div className="space-y-3">
            {nodeTypesByCategory.map(([category, nodes]) => (
              <div key={category} className="space-y-2">
                <h3 className={`text-xs font-medium uppercase tracking-wide ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {category}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {nodes.map((nodeType) => (
                    <button
                      key={nodeType.id}
                      onClick={() => handleSelect(nodeType)}
                      className={`p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] text-left group ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700 hover:border-gray-500' 
                          : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className={`w-10 h-10 bg-gradient-to-r ${nodeType.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow`}
                        >
                          <span className="text-white text-lg">{nodeType.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {nodeType.label || nodeType.name}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {nodeType.description}
                          </div>
                          {nodeType.isCustom && (
                            <div className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                              Custom
                            </div>
                          )}
                        </div>
                        <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
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
        </div>
      </div>
    </div>
  )
})

EdgeDropModal.displayName = 'EdgeDropModal' 