import React from 'react'
import { useTheme } from '../ThemeProvider'
import type { CompositeNode } from '../../types'

interface CompositeNodesTableProps {
  compositeNodes: CompositeNode[]
  filteredCompositeNodes: CompositeNode[]
  selectedCompositeNodes: Set<string>
  onCompositeSelection: (compositeId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onOpenComposite: (compositeId: string) => void
  onEditComposite: (composite: CompositeNode) => void
  onTogglePublish: (compositeId: string) => void
  onDeleteComposite: (compositeId: string) => void
  onCreateComposite: () => void
}

export const CompositeNodesTable: React.FC<CompositeNodesTableProps> = ({
  compositeNodes,
  filteredCompositeNodes,
  selectedCompositeNodes,
  onCompositeSelection,
  onSelectAll,
  onOpenComposite,
  onEditComposite,
  onTogglePublish,
  onDeleteComposite,
  onCreateComposite
}) => {
  const { isDark } = useTheme()

  return (
    <>
      {/* Selection Summary */}
      {selectedCompositeNodes.size > 0 && (
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            {selectedCompositeNodes.size} composite node{selectedCompositeNodes.size !== 1 ? 's' : ''} selected for export
          </p>
        </div>
      )}

      {/* Composite Nodes Table */}
      <div className={`${isDark ? 'bg-white/8' : 'bg-white/70'} backdrop-blur-md rounded-xl border ${isDark ? 'border-white/20' : 'border-gray-200'} overflow-hidden`}>
        {filteredCompositeNodes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {compositeNodes.length === 0 
                ? 'No composite nodes yet' 
                : 'No composite nodes found'
              }
            </h3>
            <p className={`${isDark ? 'text-white/60' : 'text-gray-600'} mb-6`}>
              {compositeNodes.length === 0 
                ? 'Create your first composite node to get started'
                : 'Try adjusting your filter'
              }
            </p>
            <button
              onClick={onCreateComposite}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isDark 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Create Your First Composite
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
                        checked={selectedCompositeNodes.size === filteredCompositeNodes.length && filteredCompositeNodes.length > 0}
                        onChange={(e) => onSelectAll(e.target.checked)}
                        className={`w-4 h-4 rounded border-2 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-blue-500' 
                            : 'bg-white border-gray-300 text-blue-600'
                        } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                      />
                    </div>
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Name
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Description
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Status
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Internal Nodes
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Connections
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Connection Type
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompositeNodes.map((composite) => (
                  <tr 
                    key={composite.id} 
                    className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50/50'} transition-colors`}
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCompositeNodes.has(composite.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            onCompositeSelection(composite.id, e.target.checked)
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
                    <td 
                      className={`p-4 ${isDark ? 'text-white' : 'text-gray-900'} cursor-pointer`}
                      onClick={() => onOpenComposite(composite.id)}
                    >
                      <div className="font-semibold">{composite.name}</div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {composite.description || 'No description'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          composite.published
                            ? isDark 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-green-100 text-green-800'
                            : isDark
                              ? 'bg-gray-500/20 text-gray-300'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {composite.published ? '🟢 Published' : '⚪ Draft'}
                        </span>
                      </div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {composite.internalNodes.length}
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {composite.internalEdges.length}
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        composite.connectionType === 'input/output'
                          ? isDark 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-blue-100 text-blue-800'
                          : composite.connectionType === 'input'
                            ? isDark 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-green-100 text-green-800'
                            : isDark 
                              ? 'bg-purple-500/20 text-purple-300' 
                              : 'bg-purple-100 text-purple-800'
                      }`}>
                        {composite.connectionType === 'input/output' ? 'Input & Output' : 
                         composite.connectionType === 'input' ? 'Input Only' : 'Output Only'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onOpenComposite(composite.id)
                          }}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            isDark 
                              ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          Open
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditComposite(composite)
                          }}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            isDark 
                              ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30' 
                              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onTogglePublish(composite.id)
                          }}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            composite.published
                              ? isDark 
                                ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' 
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : isDark
                                ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {composite.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteComposite(composite.id)
                          }}
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