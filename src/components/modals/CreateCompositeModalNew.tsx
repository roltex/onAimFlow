import React, { useState } from 'react'
import { useTheme } from '../ThemeProvider'
import { IconSelector } from '../IconSelector'

interface CreateCompositeModalNewProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, description: string, connectionType: 'input' | 'output' | 'input/output', icon: string, category: string, color: string) => void
}

export const CreateCompositeModalNew: React.FC<CreateCompositeModalNewProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { isDark } = useTheme()
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [connectionType, setConnectionType] = useState<'input' | 'output' | 'input/output'>('input/output')
  const [icon, setIcon] = useState('🔗')
  const [category, setCategory] = useState('composite')
  const [color, setColor] = useState('from-purple-500 to-purple-600')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    onSubmit(name.trim(), description.trim(), connectionType, icon, category, color)
    
    // Reset form
    setName('')
    setDescription('')
    setConnectionType('input/output')
    setIcon('🔗')
    setCategory('composite')
    setColor('from-purple-500 to-purple-600')
    setError('')
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setConnectionType('input/output')
    setIcon('🔗')
    setCategory('composite')
    setColor('from-purple-500 to-purple-600')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Create Composite Node
        </h2>
        
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Composite Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter composite name"
                autoFocus
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="composite">Composite</option>
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
                value={icon}
                onChange={setIcon}
                placeholder="Select an icon..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Color
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="from-purple-500 to-purple-600">Purple</option>
                <option value="from-blue-500 to-blue-600">Blue</option>
                <option value="from-green-500 to-green-600">Green</option>
                <option value="from-orange-500 to-orange-600">Orange</option>
                <option value="from-red-500 to-red-600">Red</option>
                <option value="from-yellow-500 to-yellow-600">Yellow</option>
                <option value="from-pink-500 to-pink-600">Pink</option>
                <option value="from-gray-500 to-gray-600">Gray</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Connection Type
            </label>
            <select
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value as 'input' | 'output' | 'input/output')}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="input/output">Input & Output</option>
              <option value="input">Input Only</option>
              <option value="output">Output Only</option>
            </select>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose how this composite node will connect to other nodes
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark 
                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              name.trim()
                ? isDark 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                : isDark
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
} 