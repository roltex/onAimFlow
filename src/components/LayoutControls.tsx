import React from 'react'
import { Panel } from '@xyflow/react'
import { useTheme } from '../hooks/useTheme'
import type { LayoutDirection } from '../utils/layoutUtils'
import { getLayoutDirectionLabel } from '../utils/layoutUtils'
import { 
  FiArrowDown, 
  FiArrowRight
} from 'react-icons/fi'

interface LayoutControlsProps {
  onLayout: (direction: LayoutDirection) => void
  disabled?: boolean
}

/**
 * Layout controls component for automatic node arrangement
 */
export const LayoutControls: React.FC<LayoutControlsProps> = ({ onLayout, disabled = false }) => {
  const { isDark } = useTheme()

  const layoutDirections: LayoutDirection[] = ['TB', 'LR']

  // Icon mapping for each direction
  const getDirectionIcon = (direction: LayoutDirection) => {
    switch (direction) {
      case 'TB': return <FiArrowDown className="w-3 h-3" />
      case 'LR': return <FiArrowRight className="w-3 h-3" />
      default: return <FiArrowDown className="w-3 h-3" />
    }
  }

  // Better labels for each direction
  const getDirectionLabel = (direction: LayoutDirection) => {
    switch (direction) {
      case 'TB': return 'Vertical'
      case 'LR': return 'Horizontal'
      default: return 'Vertical'
    }
  }

  const handleLayout = (direction: LayoutDirection) => {
    if (!disabled) {
      onLayout(direction)
    }
  }

  return (
    <Panel position="top-right" className="z-10">
      <div className={`px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border ${
        isDark 
          ? 'bg-gray-800/90 border-gray-600/30' 
          : 'bg-white/90 border-gray-200/50'
      }`}>
        <div className="flex items-center space-x-2">
          {/* Label */}
          <div className={`text-xs font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Auto Layout:
          </div>
          
          {/* Layout Buttons */}
          <div className="flex space-x-1">
            {layoutDirections.map((direction) => (
              <button
                key={direction}
                onClick={() => handleLayout(direction)}
                disabled={disabled}
                className={`
                  group relative px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                  flex items-center space-x-1.5
                  ${disabled 
                    ? `${isDark 
                        ? 'bg-gray-700/50 text-gray-500' 
                        : 'bg-gray-100/50 text-gray-400'
                      } cursor-not-allowed`
                    : `${isDark 
                        ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-200 hover:text-white border border-gray-600/50 hover:border-gray-500/50' 
                        : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900 border border-gray-300/50 hover:border-gray-400/50'
                      } hover:scale-105 active:scale-95 shadow-sm hover:shadow-md`
                  }
                `}
                title={`${getLayoutDirectionLabel(direction)} (Ctrl+${direction === 'TB' ? '1' : '2'})`}
              >
                <span className={`transition-colors duration-200 ${
                  disabled ? 'opacity-50' : 'group-hover:text-blue-400'
                }`}>
                  {getDirectionIcon(direction)}
                </span>
                <span className="font-medium">
                  {getDirectionLabel(direction)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
} 