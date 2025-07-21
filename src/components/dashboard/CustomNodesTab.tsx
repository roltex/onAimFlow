import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { CustomNodesTable } from './CustomNodesTable'
import type { DynamicNodeType } from '../../types'

interface CustomNodesTabProps {
  dynamicNodeTypes: DynamicNodeType[]
  selectedNodeTypes: Set<string>
  onNodeTypeSelection: (nodeTypeId: string, checked: boolean) => void
  onSelectAllNodeTypes: (checked: boolean) => void
  onEditNodeType: (nodeType: DynamicNodeType) => void
  onDeleteNodeType: (nodeTypeId: string, nodeTypeName: string) => void
  onCreateNodeType: () => void
  onExportNodeTypes: () => void
  onImportNodeTypes: (event: React.ChangeEvent<HTMLInputElement>) => void
  importError: string
  importSuccess: string
}

export const CustomNodesTab: React.FC<CustomNodesTabProps> = ({
  dynamicNodeTypes,
  selectedNodeTypes,
  onNodeTypeSelection,
  onSelectAllNodeTypes,
  onEditNodeType,
  onDeleteNodeType,
  onCreateNodeType,
  onExportNodeTypes,
  onImportNodeTypes,
  importError,
  importSuccess
}) => {
  const { isDark } = useTheme()

  return (
    <>
      {/* Custom Nodes Tab Header with Export/Import */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Custom Node Types ({dynamicNodeTypes.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onCreateNodeType}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark 
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            + Create Node Type
          </button>
          <button
            onClick={onExportNodeTypes}
            disabled={dynamicNodeTypes.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              dynamicNodeTypes.length === 0
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
              onChange={onImportNodeTypes}
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

      {/* Custom Nodes Table */}
      <CustomNodesTable
        dynamicNodeTypes={dynamicNodeTypes}
        selectedNodeTypes={selectedNodeTypes}
        onNodeTypeSelection={onNodeTypeSelection}
        onSelectAllNodeTypes={onSelectAllNodeTypes}
        onEditNodeType={onEditNodeType}
        onDeleteNodeType={onDeleteNodeType}
        onCreateNodeType={onCreateNodeType}
      />
    </>
  )
} 