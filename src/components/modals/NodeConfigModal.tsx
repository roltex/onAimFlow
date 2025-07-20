import React, { useState, useCallback, useEffect } from 'react'
import { useTheme } from '../ThemeProvider'
import { FilterConditionsForm } from '../forms/FilterConditionsForm'
import { OutputStepsForm } from '../forms/OutputStepsForm'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import { useDynamicNodes } from '../../contexts/DynamicNodeContext'
import type { CustomNodeData, EventSource, FilterCondition, OutputStep } from '../../types'

interface NodeConfigModalProps {
  isOpen: boolean
  onClose: () => void
  nodeData: CustomNodeData
  onSave: (updatedData: CustomNodeData) => void
  onDelete?: () => void
}

// Event type options based on source
const EVENT_TYPE_OPTIONS = {
  Hub: ['Bet', 'Win'],
  Leaderboard: ['PositionChange', 'TakeWinnigPlace'],
  External: ['Deposit', 'Bet', 'Login']
} as const

/**
 * Modal component for configuring node properties
 */
export const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  isOpen,
  onClose,
  nodeData,
  onSave,
  onDelete,
}) => {
  const { isDark } = useTheme()
  const { getDynamicNodeType } = useDynamicNodes()
  
  // Local state for form fields
  const [eventSource, setEventSource] = useState<EventSource | undefined>(nodeData.eventSource)
  const [eventType, setEventType] = useState<string | undefined>(nodeData.eventType)
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>(nodeData.filterConditions || [])
  const [selectProperty, setSelectProperty] = useState<string>(nodeData.selectProperty || '')
  const [outputSteps, setOutputSteps] = useState<OutputStep[]>(nodeData.outputSteps || [])
  
  // Dynamic node field values
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, any>>(nodeData.dynamicFieldValues || {})

  // Delete confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Get dynamic node type if this is a dynamic node
  const dynamicNodeType = nodeData.dynamicNodeTypeId ? getDynamicNodeType(nodeData.dynamicNodeTypeId) : null

  // Update local state when nodeData changes
  useEffect(() => {
    setEventSource(nodeData.eventSource)
    setEventType(nodeData.eventType)
    setFilterConditions(nodeData.filterConditions || [])
    setSelectProperty(nodeData.selectProperty || '')
    setOutputSteps(nodeData.outputSteps || [])
    setDynamicFieldValues(nodeData.dynamicFieldValues || {})
  }, [nodeData])

  // Handle event source change
  const handleEventSourceChange = useCallback((newSource: EventSource) => {
    setEventSource(newSource)
    setEventType(undefined) // Reset event type when source changes
  }, [])

  // Handle save
  const handleSave = useCallback(() => {
    const updatedData: CustomNodeData = {
      ...nodeData,
      eventSource,
      eventType,
      filterConditions,
      selectProperty,
      outputSteps,
      dynamicFieldValues,
    }
    onSave(updatedData)
    onClose()
  }, [nodeData, eventSource, eventType, filterConditions, selectProperty, outputSteps, dynamicFieldValues, onSave, onClose])

  // Handle cancel
  const handleCancel = useCallback(() => {
    // Reset to original values
    setEventSource(nodeData.eventSource)
    setEventType(nodeData.eventType)
    setFilterConditions(nodeData.filterConditions || [])
    setSelectProperty(nodeData.selectProperty || '')
    setOutputSteps(nodeData.outputSteps || [])
    setDynamicFieldValues(nodeData.dynamicFieldValues || {})
    onClose()
  }, [nodeData.eventSource, nodeData.eventType, nodeData.filterConditions, nodeData.selectProperty, nodeData.outputSteps, nodeData.dynamicFieldValues, onClose])

  // Handle delete
  const handleDelete = useCallback(() => {
    setShowDeleteConfirm(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    onDelete?.()
    setShowDeleteConfirm(false)
    onClose()
  }, [onDelete, onClose])

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false)
  }, [])

  // Handle dynamic field value change
  const handleDynamicFieldChange = useCallback((fieldId: string, value: any) => {
    setDynamicFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }, [])

  // Get available event types based on selected source
  const availableEventTypes = eventSource ? EVENT_TYPE_OPTIONS[eventSource] : []

  if (!isOpen) return null

  const isEventNode = nodeData.nodeType === 'event'
  const isFilterNode = nodeData.nodeType === 'filter'
  const isSelectNode = nodeData.nodeType === 'select'
  const isOutputNode = nodeData.nodeType === 'output'
  const isDynamicNode = dynamicNodeType !== null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${nodeData.color || 'from-blue-500 to-purple-600'} rounded-lg flex items-center justify-center shadow-md`}>
              <span className="text-white text-lg font-bold">{nodeData.icon}</span>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Configure {nodeData.label}
              </h2>
              <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                {nodeData.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-white/60 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isEventNode ? (
            <>
              {/* Event Source Dropdown */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Event Source *
                </label>
                <select
                  value={eventSource || ''}
                  onChange={(e) => handleEventSourceChange(e.target.value as EventSource)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select Event Source</option>
                  <option value="Hub">Hub</option>
                  <option value="Leaderboard">Leaderboard</option>
                  <option value="External">External</option>
                </select>
              </div>

              {/* Event Type Dropdown */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Event Type *
                </label>
                <select
                  value={eventType || ''}
                  onChange={(e) => setEventType(e.target.value)}
                  disabled={!eventSource}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed`}
                >
                  <option value="">Select Event Type</option>
                  {availableEventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {!eventSource && (
                  <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                    Please select an Event Source first
                  </p>
                )}
              </div>
            </>
          ) : isFilterNode ? (
            <>
              {/* Filter Conditions */}
              <FilterConditionsForm
                conditions={filterConditions}
                onChange={setFilterConditions}
              />
            </>
          ) : isSelectNode ? (
            <>
              {/* Select Property */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Property Name *
                </label>
                <input
                  type="text"
                  value={selectProperty}
                  onChange={(e) => setSelectProperty(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="e.g., amount, userId, email, timestamp"
                  autoFocus
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                  Specify which property you want to select from the incoming data
                </p>
              </div>
            </>
          ) : isOutputNode ? (
            <>
              {/* Output Steps */}
              <OutputStepsForm
                steps={outputSteps}
                onChange={setOutputSteps}
              />
            </>
          ) : isDynamicNode ? (
            <>
              {/* Dynamic Node Configuration */}
              <div className="space-y-4">
                {dynamicNodeType?.fields.map((field) => (
                  <div key={field.id}>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      {field.name} {field.required && '*'}
                    </label>
                    
                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={dynamicFieldValues[field.id] || field.defaultValue || ''}
                        onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder={field.placeholder || field.description}
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'number' && (
                      <input
                        type="number"
                        value={dynamicFieldValues[field.id] || field.defaultValue || ''}
                        onChange={(e) => handleDynamicFieldChange(field.id, parseFloat(e.target.value) || 0)}
                        min={field.validation?.min}
                        max={field.validation?.max}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder={field.placeholder || field.description}
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'select' && (
                      <select
                        value={dynamicFieldValues[field.id] || field.defaultValue || ''}
                        onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        required={field.required}
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {field.type === 'textarea' && (
                      <textarea
                        value={dynamicFieldValues[field.id] || field.defaultValue || ''}
                        onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder={field.placeholder || field.description}
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'boolean' && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={dynamicFieldValues[field.id] || field.defaultValue || false}
                          onChange={(e) => handleDynamicFieldChange(field.id, e.target.checked)}
                          className={`w-4 h-4 rounded border-2 ${
                            isDark 
                              ? 'bg-gray-600 border-gray-500 text-blue-500' 
                              : 'bg-white border-gray-300 text-blue-600'
                          }`}
                        />
                        <span className={`ml-2 text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}>
                          {field.description || 'Enable this option'}
                        </span>
                      </div>
                    )}
                    
                    {field.type === 'date' && (
                      <input
                        type="date"
                        value={dynamicFieldValues[field.id] || field.defaultValue || ''}
                        onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        required={field.required}
                      />
                    )}
                    
                    {field.description && (
                      <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                        {field.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
              <p>This node type doesn't have configurable properties yet.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6">
          {/* Delete Button (Left Side) */}
          {onDelete && (
            <button
              onClick={handleDelete}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title="Delete this node"
            >
              🗑️ Delete Node
            </button>
          )}
          
          {/* Cancel & Save Buttons (Right Side) */}
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Node"
        message="Are you sure you want to delete this node?"
        itemName={nodeData.label}
        itemType="Node"
      />
    </div>
  )
} 