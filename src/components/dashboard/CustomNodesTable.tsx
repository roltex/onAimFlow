import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { IconRenderer } from '../IconRenderer'
import type { DynamicNodeType } from '../../types'

interface CustomNodesTableProps {
  dynamicNodeTypes: DynamicNodeType[]
  selectedNodeTypes: Set<string>
  onNodeTypeSelection: (nodeTypeId: string, checked: boolean) => void
  onSelectAllNodeTypes: (checked: boolean) => void
  onEditNodeType: (nodeType: DynamicNodeType) => void
  onDeleteNodeType: (nodeTypeId: string, nodeTypeName: string) => void
  onCreateNodeType: () => void
}

export const CustomNodesTable: React.FC<CustomNodesTableProps> = ({
  dynamicNodeTypes,
  selectedNodeTypes,
  onNodeTypeSelection,
  onSelectAllNodeTypes,
  onEditNodeType,
  onDeleteNodeType,
  onCreateNodeType
}) => {
  const { isDark } = useTheme()

  return (
    <>
      {/* Selection Summary */}
      {selectedNodeTypes.size > 0 && (
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            {selectedNodeTypes.size} node type{selectedNodeTypes.size !== 1 ? 's' : ''} selected for export
          </p>
        </div>
      )}

      {/* Custom Nodes Table */}
      <div className={`${isDark ? 'bg-white/8' : 'bg-white/70'} backdrop-blur-md rounded-xl border ${isDark ? 'border-white/20' : 'border-gray-200'} overflow-hidden`}>
        {dynamicNodeTypes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No Custom Node Types Yet
            </h3>
            <p className={`${isDark ? 'text-white/60' : 'text-gray-600'} mb-6`}>
              Create your first custom node type to extend your workflow capabilities.
            </p>
            <button
              onClick={onCreateNodeType}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isDark 
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              Create Your First Node Type
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedNodeTypes.size === dynamicNodeTypes.length && dynamicNodeTypes.length > 0}
                        onChange={(e) => onSelectAllNodeTypes(e.target.checked)}
                        className={`w-4 h-4 rounded border-2 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-blue-500' 
                            : 'bg-white border-gray-300 text-blue-600'
                        } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                      />
                    </div>
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Node Type
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Category
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Connection Points
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Configuration Fields
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dynamicNodeTypes.map((nodeType) => (
                  <tr 
                    key={nodeType.id} 
                    className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50/50'} transition-colors`}
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedNodeTypes.has(nodeType.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            onNodeTypeSelection(nodeType.id, e.target.checked)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`w-4 h-4 rounded border-2 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-blue-500' 
                              : 'bg-white border-gray-300 text-blue-600'
                          } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${nodeType.color} rounded-lg flex items-center justify-center`}>
                          <IconRenderer icon={nodeType.icon} className="text-white text-sm" />
                        </div>
                        <div>
                          <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {nodeType.name}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                            {nodeType.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        isDark 
                          ? 'bg-blue-500/20 text-blue-300' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {nodeType.category}
                      </span>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <div className="flex flex-wrap gap-1">
                        {nodeType.ports.map((port) => (
                          <span 
                            key={port.id}
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              port.type === 'input'
                                ? isDark 
                                  ? 'bg-blue-500/20 text-blue-300' 
                                  : 'bg-blue-100 text-blue-800'
                                : port.type === 'output'
                                ? isDark 
                                  ? 'bg-green-500/20 text-green-300' 
                                  : 'bg-green-100 text-green-800'
                                : isDark 
                                  ? 'bg-purple-500/20 text-purple-300' 
                                  : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {port.name} ({port.type})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <div className="flex flex-wrap gap-1">
                        {nodeType.fields.map((field) => (
                          <span 
                            key={field.id}
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              isDark 
                                ? 'bg-gray-500/20 text-gray-300' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {field.name} ({field.type})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditNodeType(nodeType)}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            isDark 
                              ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteNodeType(nodeType.id, nodeType.name)}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            isDark 
                              ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
} 