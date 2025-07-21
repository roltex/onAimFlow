import React, { memo, useMemo } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useDynamicNodes } from '../hooks/useDynamicNodes'
import { useCompositeNodes } from '../hooks/useCompositeNodes'
import { IconRenderer } from './IconRenderer'
import type { DynamicNodeType, NodeTypeEnum } from '../types'

export interface NormalizedNodeType {
  id: string
  type: NodeTypeEnum | 'dynamic'
  label: string
  description: string
  icon: string
  color: string
  category?: string
  isCustom?: boolean
}

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: NormalizedNodeType) => void
  disabled?: boolean
}

/**
 * Sidebar palette for draggable tools
 */
export const NodePalette = memo<NodePaletteProps>(({ onDragStart, disabled = false }) => {
  const { isDark } = useTheme()
  const { getAllNodeTypes } = useDynamicNodes()
  const { compositeNodes } = useCompositeNodes()
  
  // Normalize node types to have consistent structure
  const normalizedNodeTypes = useMemo((): NormalizedNodeType[] => {
    const allNodeTypes = getAllNodeTypes()
    return allNodeTypes.map(nodeType => {
      // Check if it's a DynamicNodeType (has 'name' property)
      if ('name' in nodeType && 'isCustom' in nodeType) {
        const dynamicNode = nodeType as DynamicNodeType
        return {
          id: dynamicNode.id,
          type: 'dynamic',
          label: dynamicNode.name, // Convert name to label
          description: dynamicNode.description,
          icon: dynamicNode.icon,
          color: dynamicNode.color,
          category: dynamicNode.category,
          isCustom: dynamicNode.isCustom
        }
      } else {
        // Built-in node type (already has label)
        const builtInNode = nodeType as Record<string, unknown>
        return {
          id: builtInNode.id as string,
          type: builtInNode.type as NodeTypeEnum,
          label: builtInNode.label as string,
          description: builtInNode.description as string,
          icon: builtInNode.icon as string,
          color: builtInNode.color as string,
          category: builtInNode.category as string
        }
      }
    })
  }, [getAllNodeTypes])
  
  // Separate built-in and custom node types
  const builtInNodeTypes = normalizedNodeTypes.filter(nodeType => !('isCustom' in nodeType) || !nodeType.isCustom)
  const customNodeTypes = normalizedNodeTypes.filter(nodeType => 'isCustom' in nodeType && nodeType.isCustom)

  // Filter published composite nodes
  const publishedCompositeNodes = compositeNodes.filter(composite => composite.published)

  // Handle composite node drag start
  const handleCompositeDragStart = (event: React.DragEvent, composite: any) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    
    const compositeNodeType = {
      type: 'composite',
      label: composite.name,
      description: composite.description,
      icon: composite.icon,
      color: composite.color,
      compositeNodeId: composite.id
    }
    
    event.dataTransfer.setData('application/reactflow', JSON.stringify(compositeNodeType))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside 
      className={`w-64 h-full ${isDark ? 'bg-white/8' : 'bg-white/70'} backdrop-blur-md border-r ${isDark ? 'border-white/20' : 'border-gray-200'} transition-colors duration-300 overflow-y-auto`}
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
                    <IconRenderer icon={nodeType.icon} className="text-white text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {nodeType.label}
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
          <div className="mb-6">
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
                      <IconRenderer icon={nodeType.icon} className="text-white text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {nodeType.label}
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

        {/* Composite Nodes Section */}
        {publishedCompositeNodes.length > 0 && (
          <div className="mb-6">
            <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
              Composite Tools ({publishedCompositeNodes.length})
            </h4>
            <div className="space-y-3">
              {publishedCompositeNodes.map((composite) => (
                <div
                  key={composite.id}
                  draggable={!disabled}
                  onDragStart={(e) => handleCompositeDragStart(e, composite)}
                  className={`p-3 rounded-lg border ${isDark ? 'border-white/20' : 'border-gray-200'} transition-all duration-200 ${
                    disabled 
                      ? `${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} cursor-not-allowed opacity-50` 
                      : `cursor-grab active:cursor-grabbing hover:scale-105 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/50 hover:bg-white/70'}`
                  }`}
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-label={`Drag ${composite.name} composite tool`}
                  aria-disabled={disabled}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-10 h-10 bg-gradient-to-r ${composite.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                      aria-hidden="true"
                    >
                      <IconRenderer icon={composite.icon} className="text-white text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {composite.name}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                        {composite.description}
                      </div>
                      <div className={`text-xs mt-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                        {composite.exposedInputs.length} inputs • {composite.exposedOutputs.length} outputs
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