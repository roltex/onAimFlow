import React, { memo } from 'react'
import { useTheme } from './ThemeProvider'
import { useDynamicNodes } from '../contexts/DynamicNodeContext'
import type { NodeType } from '../types'



interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void
  disabled?: boolean
}

/**
 * Sidebar palette for draggable tools
 */
export const NodePalette = memo<NodePaletteProps>(({ onDragStart, disabled = false }) => {
  const { isDark } = useTheme()
  const { getAllNodeTypes } = useDynamicNodes()
  
  // Get all node types (built-in + dynamic)
  const allNodeTypes = getAllNodeTypes()
  
  // Separate built-in and custom node types
  const builtInNodeTypes = allNodeTypes.filter(nodeType => !nodeType.isCustom)
  const customNodeTypes = allNodeTypes.filter(nodeType => nodeType.isCustom)

  return (
    <aside 
      className={`w-64 h-full ${isDark ? 'bg-white/8' : 'bg-white/70'} backdrop-blur-md border-r ${isDark ? 'border-white/20' : 'border-gray-200'} transition-colors duration-300`}
      aria-label="Tools palette"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Tools
          </h3>
          {disabled && (
            <div className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
              Read Only
            </div>
          )}
        </div>
        
        {/* Built-in Node Types Section */}
        <div className="mb-6">
          <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
            Built-in Tools
          </h4>
          <div className="space-y-3">
            {builtInNodeTypes.map((nodeType) => (
              <div
                key={nodeType.id}
                draggable={!disabled}
                onDragStart={(e) => onDragStart(e, nodeType)}
                className={`p-3 rounded-lg border ${isDark ? 'border-white/20' : 'border-gray-200'} transition-all duration-200 ${
                  disabled 
                    ? `${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} cursor-not-allowed opacity-50` 
                    : `cursor-grab active:cursor-grabbing hover:scale-105 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/50 hover:bg-white/70'}`
                }`}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label={`Drag ${nodeType.label} tool`}
                aria-disabled={disabled}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-10 h-10 bg-gradient-to-r ${nodeType.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                    aria-hidden="true"
                  >
                    <span className="text-white text-lg">{nodeType.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {nodeType.label || nodeType.name}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                      {nodeType.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Custom Node Types Section */}
        {customNodeTypes.length > 0 && (
          <div>
            <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
              Custom Tools ({customNodeTypes.length})
            </h4>
            <div className="space-y-3">
              {customNodeTypes.map((nodeType) => (
                <div
                  key={nodeType.id}
                  draggable={!disabled}
                  onDragStart={(e) => onDragStart(e, nodeType)}
                  className={`p-3 rounded-lg border ${isDark ? 'border-white/20' : 'border-gray-200'} transition-all duration-200 ${
                    disabled 
                      ? `${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} cursor-not-allowed opacity-50` 
                      : `cursor-grab active:cursor-grabbing hover:scale-105 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/50 hover:bg-white/70'}`
                  }`}
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-label={`Drag ${nodeType.label} tool`}
                  aria-disabled={disabled}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-10 h-10 bg-gradient-to-r ${nodeType.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                      aria-hidden="true"
                    >
                      <span className="text-white text-lg">{nodeType.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {nodeType.label || nodeType.name}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                        {nodeType.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}) 