import React, { useCallback } from 'react'
import { useTheme } from '../ThemeProvider'
import type { OutputStep } from '../../types'

interface OutputStepsFormProps {
  steps: OutputStep[]
  onChange: (steps: OutputStep[]) => void
}

/**
 * Form component for managing output steps
 */
export const OutputStepsForm: React.FC<OutputStepsFormProps> = ({
  steps,
  onChange,
}) => {
  const { isDark } = useTheme()

  const addStep = useCallback(() => {
    const newStep: OutputStep = {
      id: `step-${Date.now()}`,
      progress: 0,
      point: 0,
    }
    onChange([...steps, newStep])
  }, [steps, onChange])

  const removeStep = useCallback((stepId: string) => {
    onChange(steps.filter(step => step.id !== stepId))
  }, [steps, onChange])

  const updateStep = useCallback((stepId: string, updates: Partial<OutputStep>) => {
    onChange(steps.map(step => 
      step.id === stepId 
        ? { ...step, ...updates }
        : step
    ))
  }, [steps, onChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
          Output Steps
        </h3>
        <button
          onClick={addStep}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            isDark 
              ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' 
              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
          }`}
        >
          + Add Step
        </button>
      </div>

      {steps.length === 0 ? (
        <div className={`text-center py-6 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
          <p className="text-sm">No steps added yet</p>
          <p className="text-xs mt-1">Click "Add Step" to create your first output step</p>
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                  Step {index + 1}
                </span>
                <button
                  onClick={() => removeStep(step.id)}
                  className={`p-1 rounded transition-colors ${
                    isDark 
                      ? 'hover:bg-red-500/20 text-red-300' 
                      : 'hover:bg-red-100 text-red-600'
                  }`}
                  title="Remove step"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Progress */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Progress
                  </label>
                  <input
                    type="number"
                    value={step.progress}
                    onChange={(e) => updateStep(step.id, { progress: Number(e.target.value) || 0 })}
                    min="0"
                    step="1"
                    placeholder="0"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                {/* Point */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Point
                  </label>
                  <input
                    type="number"
                    value={step.point}
                    onChange={(e) => updateStep(step.id, { point: Number(e.target.value) || 0 })}
                    min="0"
                    step="1"
                    placeholder="0"
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {steps.length > 0 && (
        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'} mt-2`}>
          <p>Configure progress milestones and corresponding point values for the output.</p>
        </div>
      )}
    </div>
  )
} 