import React from 'react'
import { useTheme } from '../ThemeProvider'
import type { Flow } from '../../types'

interface FlowsTableProps {
  flows: Flow[]
  filteredFlows: Flow[]
  selectedFlows: Set<string>
  onFlowSelection: (flowId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onOpenFlow: (flowId: string) => void
  onEditFlow: (flow: Flow) => void
  onTogglePublish: (flowId: string, flowName: string, isCurrentlyPublished: boolean) => void
  onDeleteFlow: (flowId: string, flowName: string) => void
  onCreateFlow: () => void
}

export const FlowsTable: React.FC<FlowsTableProps> = ({
  flows,
  filteredFlows,
  selectedFlows,
  onFlowSelection,
  onSelectAll,
  onOpenFlow,
  onEditFlow,
  onTogglePublish,
  onDeleteFlow,
  onCreateFlow
}) => {
  const { isDark } = useTheme()

  return (
    <>
      {/* Selection Summary */}
      {selectedFlows.size > 0 && (
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            {selectedFlows.size} flow{selectedFlows.size !== 1 ? 's' : ''} selected for export
          </p>
        </div>
      )}

      {/* Flows Table */}
      <div className={`${isDark ? 'bg-white/8' : 'bg-white/70'} backdrop-blur-md rounded-xl border ${isDark ? 'border-white/20' : 'border-gray-200'} overflow-hidden`}>
        {filteredFlows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {flows.length === 0 
                ? 'No workflows yet' 
                : 'No workflows found'
              }
            </h3>
            <p className={`${isDark ? 'text-white/60' : 'text-gray-600'} mb-6`}>
              {flows.length === 0 
                ? 'Create your first workflow to get started'
                : 'Try adjusting your filter'
              }
            </p>
            <button
              onClick={onCreateFlow}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isDark 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Create Your First Flow
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
                        checked={selectedFlows.size === filteredFlows.length && filteredFlows.length > 0}
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
                    Nodes
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Connections
                  </th>
                  <th className={`text-left p-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFlows.map((flow) => (
                  <tr 
                    key={flow.id} 
                    className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50/50'} transition-colors`}
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFlows.has(flow.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            onFlowSelection(flow.id, e.target.checked)
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
                      onClick={() => onOpenFlow(flow.id)}
                    >
                      <div className="font-semibold">{flow.name}</div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {flow.description || 'No description'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          flow.published
                            ? isDark 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-green-100 text-green-800'
                            : isDark
                              ? 'bg-gray-500/20 text-gray-300'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {flow.published ? '🟢 Published' : '⚪ Draft'}
                        </span>
                      </div>
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {flow.nodeCount}
                    </td>
                    <td className={`p-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {flow.edgeCount}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onOpenFlow(flow.id)
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
                            onEditFlow(flow)
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
                            onTogglePublish(flow.id, flow.name, flow.published)
                          }}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            flow.published
                              ? isDark 
                                ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' 
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : isDark
                                ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {flow.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteFlow(flow.id, flow.name)
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