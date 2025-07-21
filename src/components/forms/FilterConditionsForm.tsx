import React, { useCallback } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import type { FilterCondition, ConditionalOperator } from '../../types'

interface FilterConditionsFormProps {
  conditions: FilterCondition[]
  onChange: (conditions: FilterCondition[]) => void
}

const CONDITIONAL_OPERATORS: { value: ConditionalOperator; label: string }[] = [
  { value: 'equals', label: 'equals' },
  { value: 'not equals', label: 'not equals' },
  { value: 'greater than', label: 'greater than' },
  { value: 'less than', label: 'less than' },
]

/**
 * Form component for managing filter conditions
 */
export const FilterConditionsForm: React.FC<FilterConditionsFormProps> = ({
  conditions,
  onChange,
}) => {
  const { isDark } = useTheme()

  const addCondition = useCallback(() => {
    const newCondition: FilterCondition = {
      id: `condition-${Date.now()}`,
      propertyName: '',
      operator: 'equals',
      value: '',
    }
    onChange([...conditions, newCondition])
  }, [conditions, onChange])

  const removeCondition = useCallback((conditionId: string) => {
    onChange(conditions.filter(condition => condition.id !== conditionId))
  }, [conditions, onChange])

  const updateCondition = useCallback((conditionId: string, updates: Partial<FilterCondition>) => {
    onChange(conditions.map(condition => 
      condition.id === conditionId 
        ? { ...condition, ...updates }
        : condition
    ))
  }, [conditions, onChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
          Filter Conditions
        </h3>
        <button
          onClick={addCondition}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            isDark 
              ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          + Add Condition
        </button>
      </div>

      {conditions.length === 0 ? (
        <div className={`text-center py-6 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
          <p className="text-sm">No conditions added yet</p>
          <p className="text-xs mt-1">Click "Add Condition" to create your first filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <div 
              key={condition.id}
              className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                  Condition {index + 1}
                </span>
                <button
                  onClick={() => removeCondition(condition.id)}
                  className={`p-1 rounded transition-colors ${
                    isDark 
                      ? 'hover:bg-red-500/20 text-red-300' 
                      : 'hover:bg-red-100 text-red-600'
                  }`}
                  title="Remove condition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Property Name */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Property Name
                  </label>
                  <input
                    type="text"
                    value={condition.propertyName}
                    onChange={(e) => updateCondition(condition.id, { propertyName: e.target.value })}
                    placeholder="e.g., amount, userId, status"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                {/* Operator and Value */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      Operator
                    </label>
                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(condition.id, { operator: e.target.value as ConditionalOperator })}
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      {CONDITIONAL_OPERATORS.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      Value
                    </label>
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                      placeholder="e.g., 100, active, user123"
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 