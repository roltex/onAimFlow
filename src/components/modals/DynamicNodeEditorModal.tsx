import React, { useState, useCallback, useEffect } from 'react'
import { useTheme } from '../ThemeProvider'
import { useDynamicNodes } from '../../contexts/DynamicNodeContext'
import { IconSelector } from '../IconSelector'
import type { DynamicNodeType, PortDefinition, ConfigurableField, FieldType, SelectOption } from '../../types'

interface DynamicNodeEditorModalProps {
  isOpen: boolean
  onClose: () => void
  nodeType?: DynamicNodeType // For editing existing node type
}

/**
 * Modal for creating and editing dynamic node types
 */
export const DynamicNodeEditorModal: React.FC<DynamicNodeEditorModalProps> = ({
  isOpen,
  onClose,
  nodeType
}) => {
  const { isDark } = useTheme()
  const { createDynamicNodeType, updateDynamicNodeType } = useDynamicNodes()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🔧',
    color: 'from-gray-500 to-gray-600',
    category: 'custom'
  })
  
  // Ports state - simplified to just one connection type
  const [connectionType, setConnectionType] = useState<'input' | 'output' | 'input/output'>('input/output')
  
  // Fields state
  const [fields, setFields] = useState<ConfigurableField[]>([])
  
  // Error state
  const [error, setError] = useState<string>('')

  // Initialize form when editing
  useEffect(() => {
    if (nodeType) {
      setFormData({
        name: nodeType.name,
        description: nodeType.description,
        icon: nodeType.icon,
        color: nodeType.color,
        category: nodeType.category
      })
      // Set connection type based on existing ports
      if (nodeType.ports.length > 0) {
        const hasInput = nodeType.ports.some(port => port.type === 'input' || port.type === 'input/output')
        const hasOutput = nodeType.ports.some(port => port.type === 'output' || port.type === 'input/output')
        if (hasInput && hasOutput) {
          setConnectionType('input/output')
        } else if (hasInput) {
          setConnectionType('input')
        } else if (hasOutput) {
          setConnectionType('output')
        }
      }
      setFields(nodeType.fields)
    } else {
      // Reset form for new node type
      setFormData({
        name: '',
        description: '',
        icon: '🔧',
        color: 'from-gray-500 to-gray-600',
        category: 'custom'
      })
      setConnectionType('input/output')
      setFields([])
    }
    setError('')
  }, [nodeType, isOpen])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Node type name is required')
      return
    }

    try {
      // Create a single port based on the connection type
      const ports: PortDefinition[] = [{
        id: 'main-port',
        name: 'Main',
        type: connectionType,
        description: 'Main connection point',
        required: true
      }]
      
      const nodeTypeData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
        color: formData.color,
        category: formData.category,
        ports,
        fields
      }

      if (nodeType) {
        // Update existing node type
        updateDynamicNodeType(nodeType.id, nodeTypeData)
      } else {
        // Create new node type
        createDynamicNodeType(nodeTypeData)
      }
      
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save node type')
    }
  }, [formData, connectionType, fields, nodeType, createDynamicNodeType, updateDynamicNodeType, onClose])



  // Add new field
  const addField = useCallback(() => {
    const newField: ConfigurableField = {
      id: `field-${Date.now()}`,
      name: '',
      type: 'text',
      description: '',
      required: false,
      defaultValue: '',
      placeholder: ''
    }
    setFields(prev => [...prev, newField])
  }, [])

  // Update field
  const updateField = useCallback((id: string, updates: Partial<ConfigurableField>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }, [])

  // Remove field
  const removeField = useCallback((id: string) => {
    setFields(prev => prev.filter(field => field.id !== id))
  }, [])

  // Add select option
  const addSelectOption = useCallback((fieldId: string) => {
    const newOption: SelectOption = {
      value: '',
      label: ''
    }
    setFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, options: [...(field.options || []), newOption] }
        : field
    ))
  }, [])

  // Update select option
  const updateSelectOption = useCallback((fieldId: string, optionIndex: number, updates: Partial<SelectOption>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { 
            ...field, 
            options: field.options?.map((option, index) => 
              index === optionIndex ? { ...option, ...updates } : option
            )
          }
        : field
    ))
  }, [])

  // Remove select option
  const removeSelectOption = useCallback((fieldId: string, optionIndex: number) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { 
            ...field, 
            options: field.options?.filter((_, index) => index !== optionIndex)
          }
        : field
    ))
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {nodeType ? 'Edit Node Type' : 'Create New Node Type'}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter node type name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="custom">Custom</option>
                <option value="trigger">Trigger</option>
                <option value="process">Process</option>
                <option value="output">Output</option>
                <option value="utility">Utility</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Icon
              </label>
              <IconSelector
                value={formData.icon}
                onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
                placeholder="Select an icon..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Color
              </label>
              <select
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="from-gray-500 to-gray-600">Gray</option>
                <option value="from-blue-500 to-blue-600">Blue</option>
                <option value="from-green-500 to-green-600">Green</option>
                <option value="from-purple-500 to-purple-600">Purple</option>
                <option value="from-orange-500 to-orange-600">Orange</option>
                <option value="from-red-500 to-red-600">Red</option>
                <option value="from-yellow-500 to-yellow-600">Yellow</option>
                <option value="from-pink-500 to-pink-600">Pink</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Describe what this node type does..."
            />
          </div>

                    {/* Connection Points Section - Simplified */}
          <div>
            <div className="flex items-center mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Connection Type
              </h3>
              <div className="ml-2 relative group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-help ${
                  isDark ? 'border-gray-400 text-gray-400' : 'border-gray-500 text-gray-500'
                }`}>
                  <span className="text-xs font-bold">?</span>
                </div>
                {/* Tooltip */}
                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 rounded-lg text-sm w-80 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
                  isDark 
                    ? 'bg-gray-800 text-white border border-gray-600 shadow-lg' 
                    : 'bg-white text-gray-900 border border-gray-200 shadow-lg'
                }`}>
                  <div className="text-center">
                    <strong>Connection Type:</strong> Define how this node connects to other nodes.
                    <br />
                    • <strong>Input</strong> = Only receives data from other nodes
                    <br />
                    • <strong>Output</strong> = Only sends data to other nodes  
                    <br />
                    • <strong>Input/Output</strong> = Can both receive and send data
                  </div>
                  {/* Arrow */}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                    isDark ? 'border-t-gray-800' : 'border-t-white'
                  }`}></div>
                </div>
              </div>
            </div>

            <div>
              <select
                value={connectionType}
                onChange={(e) => setConnectionType(e.target.value as 'input' | 'output' | 'input/output')}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="input">Input Only</option>
                <option value="output">Output Only</option>
                <option value="input/output">Input & Output</option>
              </select>
            </div>
          </div>

          {/* Node Configuration Fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Node Configuration ({fields.length})
                </h3>
                <div className="ml-2 relative group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-help ${
                    isDark ? 'border-gray-400 text-gray-400' : 'border-gray-500 text-gray-500'
                  }`}>
                    <span className="text-xs font-bold">?</span>
                  </div>
                  {/* Tooltip */}
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 rounded-lg text-sm w-80 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
                    isDark 
                      ? 'bg-gray-800 text-white border border-gray-600 shadow-lg' 
                      : 'bg-white text-gray-900 border border-gray-200 shadow-lg'
                  }`}>
                    <div className="text-center">
                      <strong>Configuration Fields:</strong> These are settings that users can configure when they add this node to their workflow.
                      <br />
                      • <strong>Text/Number/Select</strong> = User input fields for node configuration
                      <br />
                      • <strong>Boolean</strong> = Toggle switches for enabling/disabling features
                      <br />
                      • <strong>Date</strong> = Date pickers for time-based configurations
                    </div>
                    {/* Arrow */}
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                      isDark ? 'border-t-gray-800' : 'border-t-white'
                    }`}></div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={addField}
                className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                  isDark 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                + Add Configuration Field
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Field Name
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        className={`w-full px-2 py-1 text-sm rounded border ${
                          isDark 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Field name"
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                        className={`w-full px-2 py-1 text-sm rounded border ${
                          isDark 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                        <option value="textarea">Textarea</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                      </select>
                    </div>

                    <div className="flex items-end gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className={`w-4 h-4 rounded border-2 mr-2 ${
                            isDark 
                              ? 'bg-gray-600 border-gray-500 text-blue-500' 
                              : 'bg-white border-gray-300 text-blue-600'
                          }`}
                        />
                        <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Required
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className={`px-2 py-1 text-sm rounded transition-colors ${
                          isDark 
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Default Value
                      </label>
                      <input
                        type="text"
                        value={field.defaultValue || ''}
                        onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
                        className={`w-full px-2 py-1 text-sm rounded border ${
                          isDark 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Default value"
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className={`w-full px-2 py-1 text-sm rounded border ${
                          isDark 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Placeholder text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Description
                    </label>
                    <input
                      type="text"
                      value={field.description || ''}
                      onChange={(e) => updateField(field.id, { description: e.target.value })}
                      className={`w-full px-2 py-1 text-sm rounded border ${
                        isDark 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Field description (optional)"
                    />
                  </div>

                  {/* Select Options for Select Type Fields */}
                  {field.type === 'select' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Options
                        </label>
                        <button
                          type="button"
                          onClick={() => addSelectOption(field.id)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            isDark 
                              ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          + Add Option
                        </button>
                      </div>
                      <div className="space-y-2">
                        {field.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={option.value}
                              onChange={(e) => updateSelectOption(field.id, optionIndex, { value: e.target.value })}
                              className={`flex-1 px-2 py-1 text-sm rounded border ${
                                isDark 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                              placeholder="Value"
                            />
                            <input
                              type="text"
                              value={option.label}
                              onChange={(e) => updateSelectOption(field.id, optionIndex, { label: e.target.value })}
                              className={`flex-1 px-2 py-1 text-sm rounded border ${
                                isDark 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                              placeholder="Label"
                            />
                            <button
                              type="button"
                              onClick={() => removeSelectOption(field.id, optionIndex)}
                              className={`px-2 py-1 text-sm rounded transition-colors ${
                                isDark 
                                  ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
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
              type="submit"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {nodeType ? 'Update Node Type' : 'Create Node Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 