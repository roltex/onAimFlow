import React from 'react'
import { useTheme } from '../hooks/useTheme'
import { 
  FiZap, 
  FiTrendingUp, 
  FiMinus, 
  FiCornerDownRight 
} from 'react-icons/fi'

export type EdgeType = 'smoothstep' | 'bezier' | 'straight' | 'step'

interface EdgeStyleControlsProps {
  onEdgeStyleChange: (edgeType: EdgeType) => void
  currentEdgeType?: EdgeType
  disabled?: boolean
}

/**
 * Edge style controls component
 */
export const EdgeStyleControls: React.FC<EdgeStyleControlsProps> = ({
  onEdgeStyleChange,
  currentEdgeType = 'smoothstep',
  disabled = false
}) => {
  const { isDark } = useTheme()

  const edgeTypes: EdgeType[] = ['smoothstep', 'bezier', 'straight', 'step']

  // Icon mapping for each edge type
  const getEdgeTypeIcon = (edgeType: EdgeType) => {
    switch (edgeType) {
      case 'smoothstep': return <FiZap className="w-3 h-3" />
      case 'bezier': return <FiTrendingUp className="w-3 h-3" />
      case 'straight': return <FiMinus className="w-3 h-3" />
      case 'step': return <FiCornerDownRight className="w-3 h-3" />
      default: return <FiZap className="w-3 h-3" />
    }
  }

  // Better labels for each edge type
  const getEdgeTypeLabel = (edgeType: EdgeType) => {
    switch (edgeType) {
      case 'smoothstep': return 'Smooth'
      case 'bezier': return 'Curved'
      case 'straight': return 'Straight'
      case 'step': return 'Step'
      default: return 'Smooth'
    }
  }

  // Keyboard shortcuts for each edge type
  const getEdgeTypeShortcut = (edgeType: EdgeType) => {
    switch (edgeType) {
      case 'smoothstep': return 'Ctrl+S'
      case 'bezier': return 'Ctrl+B'
      case 'straight': return 'Ctrl+L'
      case 'step': return 'Ctrl+T'
      default: return 'Ctrl+S'
    }
  }

  return (
    <div className="absolute top-4 right-48 z-10">
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
            Edge Style:
          </div>
          
          {/* Edge Style Buttons */}
          <div className="flex space-x-1">
            {edgeTypes.map((edgeType) => (
              <button
                key={edgeType}
                onClick={() => onEdgeStyleChange(edgeType)}
                disabled={disabled}
                className={`
                  group relative p-1.5 rounded-md text-xs transition-all duration-200
                  ${disabled 
                    ? `${isDark 
                        ? 'bg-gray-700/50 text-gray-500' 
                        : 'bg-gray-100/50 text-gray-400'
                      } cursor-not-allowed`
                    : `${currentEdgeType === edgeType
                        ? isDark
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-blue-500 text-white shadow-md'
                        : isDark 
                          ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-200 hover:text-white border border-gray-600/50 hover:border-gray-500/50' 
                          : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900 border border-gray-300/50 hover:border-gray-400/50'
                      } hover:scale-105 active:scale-95 shadow-sm hover:shadow-md`
                  }
                `}
                title={`${getEdgeTypeLabel(edgeType)} (${getEdgeTypeShortcut(edgeType)})`}
              >
                <span className={`transition-colors duration-200 ${
                  disabled ? 'opacity-50' : 'group-hover:text-blue-400'
                }`}>
                  {getEdgeTypeIcon(edgeType)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 