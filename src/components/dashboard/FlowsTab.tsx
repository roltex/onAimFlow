import React from 'react'
import { useTheme } from '../ThemeProvider'
import { FlowsTable } from './FlowsTable'
import type { Flow } from '../../types'

interface FlowsTabProps {
  flows: Flow[]
  filteredFlows: Flow[]
  filter: 'all' | 'published' | 'draft'
  onFilterChange: (filter: 'all' | 'published' | 'draft') => void
  selectedFlows: Set<string>
  onFlowSelection: (flowId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onOpenFlow: (flowId: string) => void
  onEditFlow: (flow: Flow) => void
  onTogglePublish: (flowId: string, flowName: string, isCurrentlyPublished: boolean) => void
  onDeleteFlow: (flowId: string, flowName: string) => void
  onCreateFlow: () => void
  onExportFlows: () => void
  onImportFlows: (event: React.ChangeEvent<HTMLInputElement>) => void
  importError: string
  importSuccess: string
}

export const FlowsTab: React.FC<FlowsTabProps> = ({
  flows,
  filteredFlows,
  filter,
  onFilterChange,
  selectedFlows,
  onFlowSelection,
  onSelectAll,
  onOpenFlow,
  onEditFlow,
  onTogglePublish,
  onDeleteFlow,
  onCreateFlow,
  onExportFlows,
  onImportFlows,
  importError,
  importSuccess
}) => {
  const { isDark } = useTheme()

  return (
    <>
      {/* Flows Tab Header with Export/Import */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? isDark 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-600 text-white'
                : isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Flows ({flows.length})
          </button>
          <button
            onClick={() => onFilterChange('published')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'published'
                ? isDark 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-600 text-white'
                : isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🟢 Published ({flows.filter(f => f.published).length})
          </button>
          <button
            onClick={() => onFilterChange('draft')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'draft'
                ? isDark 
                  ? 'bg-gray-500 text-white' 
                  : 'bg-gray-600 text-white'
                : isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ⚪ Drafts ({flows.filter(f => !f.published).length})
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCreateFlow}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            + Create Flow
          </button>
          <button
            onClick={onExportFlows}
            disabled={flows.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              flows.length === 0
                ? isDark 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isDark 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <label className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer ${
            isDark 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import
            <input
              type="file"
              accept=".json"
              onChange={onImportFlows}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Import Error/Success Display */}
      {importError && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{importError}</p>
        </div>
      )}
      {importSuccess && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
          <p className="text-green-700 dark:text-green-300 text-sm">{importSuccess}</p>
        </div>
      )}

      {/* Flows Table */}
      <FlowsTable
        flows={flows}
        filteredFlows={filteredFlows}
        selectedFlows={selectedFlows}
        onFlowSelection={onFlowSelection}
        onSelectAll={onSelectAll}
        onOpenFlow={onOpenFlow}
        onEditFlow={onEditFlow}
        onTogglePublish={onTogglePublish}
        onDeleteFlow={onDeleteFlow}
        onCreateFlow={onCreateFlow}
      />
    </>
  )
} 