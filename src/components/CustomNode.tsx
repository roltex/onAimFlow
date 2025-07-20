import React, { memo, useMemo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { useTheme } from './ThemeProvider'
import { useDynamicNodes } from '../contexts/DynamicNodeContext'
import type { CustomNodeData } from '../types'

interface CustomNodeProps {
  data: CustomNodeData
  onClick?: () => void
}

/**
 * Custom node component for the workflow
 */
export const CustomNode = memo<CustomNodeProps>(({ data, onClick }) => {
  const { isDark } = useTheme()
  const { getDynamicNodeType } = useDynamicNodes()

  // Memoize handle styles to prevent recalculation
  const handleStyles = useMemo(() => ({
    input: {
      width: '16px',
      height: '16px',
      background: isDark ? '#3b82f6' : '#2563eb',
      border: `2px solid ${isDark ? '#60a5fa' : '#3b82f6'}`,
      borderRadius: '50%',
      boxShadow: isDark
        ? '0 2px 8px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        : '0 2px 8px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      transition: 'all 0.2s ease-in-out',
    },
    output: {
      width: '16px',
      height: '16px',
      background: isDark ? '#10b981' : '#059669',
      border: `2px solid ${isDark ? '#34d399' : '#10b981'}`,
      borderRadius: '50%',
      boxShadow: isDark
        ? '0 2px 8px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        : '0 2px 8px rgba(5, 150, 105, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      transition: 'all 0.2s ease-in-out',
    },
  }), [isDark])

  // Handle hover effects
  const handleMouseEnter = (type: 'input' | 'output') => (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    target.style.boxShadow = isDark
      ? type === 'input'
        ? '0 4px 12px rgba(59, 130, 246, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        : '0 4px 12px rgba(16, 185, 129, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
      : type === 'input'
        ? '0 4px 12px rgba(37, 99, 235, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
        : '0 4px 12px rgba(5, 150, 105, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
  }

  const handleMouseLeave = (type: 'input' | 'output') => (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    target.style.boxShadow = handleStyles[type].boxShadow
  }

  const isEventNode = data.nodeType === 'event'
  const isOutputNode = data.nodeType === 'output'
  
  // Get dynamic node type if this is a dynamic node
  const dynamicNodeType = data.dynamicNodeTypeId ? getDynamicNodeType(data.dynamicNodeTypeId) : null
  const isDynamicNode = dynamicNodeType !== null

  // Get port definitions for dynamic nodes
  const inputPorts = isDynamicNode && dynamicNodeType 
    ? dynamicNodeType.ports.filter(port => port.type === 'input' || port.type === 'input/output')
    : []
  const outputPorts = isDynamicNode && dynamicNodeType 
    ? dynamicNodeType.ports.filter(port => port.type === 'output' || port.type === 'input/output')
    : []

  // Check if node is properly configured
  const isConfigured = (() => {
    switch (data.nodeType) {
      case 'event':
        return !!(data.eventSource && data.eventType)
      case 'filter':
        return !!(data.filterConditions && data.filterConditions.length > 0)
      case 'select':
        return !!(data.selectProperty && data.selectProperty.trim() !== '')
      case 'output':
        return !!(data.outputSteps && data.outputSteps.length > 0)
      default:
        // For dynamic nodes, check if required fields are filled
        if (isDynamicNode && dynamicNodeType) {
          const requiredFields = dynamicNodeType.fields.filter(field => field.required)
          return requiredFields.every(field => {
            const value = data.dynamicFieldValues?.[field.id]
            return value !== undefined && value !== null && value !== ''
          })
        }
        return true
    }
  })()

  return (
    <div 
      className={`
        ${isDark ? 'bg-white/15' : 'bg-white/80'} rounded-xl p-4 border 
        ${isConfigured 
          ? isDark ? 'border-white/30' : 'border-gray-300'
          : isDark ? 'border-red-400/50' : 'border-red-300'
        } 
        shadow-lg transform-gpu backdrop-blur-sm relative group cursor-pointer hover:shadow-xl transition-all duration-200
        ${!isConfigured ? 'ring-2 ring-red-400/20' : ''}
      `}
      onClick={onClick}
    >
      {/* Configuration Status Indicator */}
      {!isConfigured && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      )}

      {/* Input handles */}
      {isDynamicNode ? (
        // For dynamic nodes, render handles based on port definitions
        inputPorts.length === 1 ? (
          // Single input port - center it
          <Handle
            key={`input-${inputPorts[0].id}`}
            type="target"
            position={Position.Left}
            id={inputPorts[0].id}
            style={handleStyles.input}
            onMouseEnter={handleMouseEnter('input')}
            onMouseLeave={handleMouseLeave('input')}
          />
        ) : (
          // Multiple input ports - distribute them evenly
          inputPorts.map((port, index) => {
            const totalPorts = inputPorts.length
            const spacing = 100 / (totalPorts + 1) // Distribute evenly across 100% height
            const topPosition = spacing * (index + 1)
            
            return (
              <Handle
                key={`input-${port.id}`}
                type="target"
                position={Position.Left}
                id={port.id}
                style={{
                  ...handleStyles.input,
                  top: `${topPosition}%`,
                  transform: 'translateY(-50%)', // Center the handle on its position
                }}
                onMouseEnter={handleMouseEnter('input')}
                onMouseLeave={handleMouseLeave('input')}
              />
            )
          })
        )
      ) : (
        // For built-in nodes, use existing logic
        !isEventNode && (
          <Handle
            type="target"
            position={Position.Left}
            style={handleStyles.input}
            onMouseEnter={handleMouseEnter('input')}
            onMouseLeave={handleMouseLeave('input')}
          />
        )
      )}
      
      {/* Node content */}
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 bg-gradient-to-r ${data.color || 'from-blue-500 to-purple-600'} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
          <span className="text-white text-sm font-bold">{data.icon}</span>
        </div>
        <div className="min-w-0">
          <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {data.label}
          </div>
          <div className={`text-xs truncate ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            {data.description}
          </div>
          
          {/* Configuration Status */}
          {!isConfigured ? (
            <div className={`text-xs truncate ${isDark ? 'text-red-300' : 'text-red-600'} font-medium`}>
              ⚠️ Not configured
            </div>
          ) : (
            <>
              {/* Show configuration status for EVENT nodes */}
              {isEventNode && (data.eventSource && data.eventType) && (
                <div className={`text-xs truncate ${isDark ? 'text-blue-300' : 'text-blue-600'} font-medium`}>
                  {data.eventSource}: {data.eventType}
                </div>
              )}
              
              {/* Show configuration status for FILTER nodes */}
              {data.nodeType === 'filter' && data.filterConditions && data.filterConditions.length > 0 && (
                <div className={`text-xs truncate ${isDark ? 'text-green-300' : 'text-green-600'} font-medium`}>
                  {data.filterConditions.length} condition{data.filterConditions.length !== 1 ? 's' : ''}
                </div>
              )}
              
              {/* Show configuration status for SELECT nodes */}
              {data.nodeType === 'select' && data.selectProperty && (
                <div className={`text-xs truncate ${isDark ? 'text-purple-300' : 'text-purple-600'} font-medium`}>
                  Select: {data.selectProperty}
                </div>
              )}
              
              {/* Show configuration status for OUTPUT nodes */}
              {data.nodeType === 'output' && data.outputSteps && data.outputSteps.length > 0 && (
                <div className={`text-xs truncate ${isDark ? 'text-orange-300' : 'text-orange-600'} font-medium`}>
                  {data.outputSteps.length} step{data.outputSteps.length !== 1 ? 's' : ''}
                </div>
              )}
              
              {/* Show configuration status for DYNAMIC nodes */}
              {isDynamicNode && dynamicNodeType && data.dynamicFieldValues && (
                <div className={`text-xs truncate ${isDark ? 'text-indigo-300' : 'text-indigo-600'} font-medium`}>
                  {Object.keys(data.dynamicFieldValues).length} field{Object.keys(data.dynamicFieldValues).length !== 1 ? 's' : ''} configured
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Output handles */}
      {isDynamicNode ? (
        // For dynamic nodes, render handles based on port definitions
        outputPorts.length === 1 ? (
          // Single output port - center it
          <Handle
            key={`output-${outputPorts[0].id}`}
            type="source"
            position={Position.Right}
            id={outputPorts[0].id}
            style={handleStyles.output}
            onMouseEnter={handleMouseEnter('output')}
            onMouseLeave={handleMouseLeave('output')}
          />
        ) : (
          // Multiple output ports - distribute them evenly
          outputPorts.map((port, index) => {
            const totalPorts = outputPorts.length
            const spacing = 100 / (totalPorts + 1) // Distribute evenly across 100% height
            const topPosition = spacing * (index + 1)
            
            return (
              <Handle
                key={`output-${port.id}`}
                type="source"
                position={Position.Right}
                id={port.id}
                style={{
                  ...handleStyles.output,
                  top: `${topPosition}%`,
                  transform: 'translateY(-50%)', // Center the handle on its position
                }}
                onMouseEnter={handleMouseEnter('output')}
                onMouseLeave={handleMouseLeave('output')}
              />
            )
          })
        )
      ) : (
        // For built-in nodes, use existing logic
        !isOutputNode && (
          <Handle
            type="source"
            position={Position.Right}
            style={handleStyles.output}
            onMouseEnter={handleMouseEnter('output')}
            onMouseLeave={handleMouseLeave('output')}
          />
        )
      )}
    </div>
  )
})