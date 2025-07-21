import React from 'react'
import { useTheme } from '../hooks/useTheme'
import { 
  FiZap, 
  FiTrendingUp, 
  FiMinus, 
  FiCornerDownRight,
  FiArrowDown, 
  FiArrowRight,
  FiPlay,
  FiPause
} from 'react-icons/fi'
import type { LayoutDirection } from '../utils/layoutUtils'
import { getLayoutDirectionLabel } from '../utils/layoutUtils'

export type EdgeType = 'smoothstep' | 'bezier' | 'straight' | 'step'
export type EdgeStyle = 'solid' | 'dashed'
export type EdgeAnimation = 'animated' | 'static'

interface FlowControlsProps {
  onLayout: (direction: LayoutDirection) => void
  onEdgeStyleChange: (edgeType: EdgeType) => void
  onEdgeStyleToggle: (style: EdgeStyle) => void
  onEdgeAnimationToggle: (animation: EdgeAnimation) => void
  currentEdgeType?: EdgeType
  currentEdgeStyle?: EdgeStyle
  currentEdgeAnimation?: EdgeAnimation
  disabled?: boolean
}

/**
 * Unified flow controls component combining edge style and layout controls
 */
export const FlowControls: React.FC<FlowControlsProps> = ({
  onLayout,
  onEdgeStyleChange,
  onEdgeStyleToggle,
  onEdgeAnimationToggle,
  currentEdgeType = 'smoothstep',
  currentEdgeStyle = 'solid',
  currentEdgeAnimation = 'animated',
  disabled = false
}) => {
  const { isDark } = useTheme()

  const layoutDirections: LayoutDirection[] = ['TB', 'LR']
  const edgeTypes: EdgeType[] = ['smoothstep', 'bezier', 'straight', 'step']
  const edgeStyles: EdgeStyle[] = ['solid', 'dashed']
  const edgeAnimations: EdgeAnimation[] = ['animated', 'static']

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

  // Icon mapping for edge styles
  const getEdgeStyleIcon = (style: EdgeStyle) => {
    switch (style) {
      case 'solid': return <FiMinus className="w-3 h-3" />
      case 'dashed': return <div className="w-3 h-3 flex items-center justify-center">
        <div className="w-full h-0.5 bg-current" style={{ background: 'repeating-linear-gradient(to right, currentColor 0, currentColor 2px, transparent 2px, transparent 4px)' }}></div>
      </div>
      default: return <FiMinus className="w-3 h-3" />
    }
  }

  // Labels for edge styles
  const getEdgeStyleLabel = (style: EdgeStyle) => {
    switch (style) {
      case 'solid': return 'Solid'
      case 'dashed': return 'Dashed'
      default: return 'Solid'
    }
  }

  // Icon mapping for edge animations
  const getEdgeAnimationIcon = (animation: EdgeAnimation) => {
    switch (animation) {
      case 'animated': return <FiPlay className="w-3 h-3" />
      case 'static': return <FiPause className="w-3 h-3" />
      default: return <FiPlay className="w-3 h-3" />
    }
  }

  // Labels for edge animations
  const getEdgeAnimationLabel = (animation: EdgeAnimation) => {
    switch (animation) {
      case 'animated': return 'Animated'
      case 'static': return 'Static'
      default: return 'Animated'
    }
  }

  const handleLayout = (direction: LayoutDirection) => {
    if (!disabled) {
      onLayout(direction)
    }
  }

  return (
    <div className={`absolute top-4 right-4 z-10 ${
      disabled ? 'opacity-50 pointer-events-none' : ''
    }`}>
      <div className={`px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm border ${
        isDark 
          ? 'bg-gray-800/90 border-gray-600/30' 
          : 'bg-white/90 border-gray-200/50'
      }`}>
        <div className="flex items-center space-x-4">
          {/* Edge Type Controls */}
          <div className="flex items-center space-x-2">
            <div className={`text-xs font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Edge Type:
            </div>
            
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

          {/* Edge Style Controls */}
          <div className="flex items-center space-x-2">
            <div className={`text-xs font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Line Style:
            </div>
            
            <div className="flex space-x-1">
              {edgeStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => onEdgeStyleToggle(style)}
                  disabled={disabled}
                  className={`
                    group relative p-1.5 rounded-md text-xs transition-all duration-200
                    ${disabled 
                      ? `${isDark 
                          ? 'bg-gray-700/50 text-gray-500' 
                          : 'bg-gray-100/50 text-gray-400'
                        } cursor-not-allowed`
                      : `${currentEdgeStyle === style
                          ? isDark
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-500 text-white shadow-md'
                          : isDark 
                            ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-200 hover:text-white border border-gray-600/50 hover:border-gray-500/50' 
                            : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900 border border-gray-300/50 hover:border-gray-400/50'
                        } hover:scale-105 active:scale-95 shadow-sm hover:shadow-md`
                    }
                  `}
                  title={`${getEdgeStyleLabel(style)}`}
                >
                  <span className={`transition-colors duration-200 ${
                    disabled ? 'opacity-50' : 'group-hover:text-blue-400'
                  }`}>
                    {getEdgeStyleIcon(style)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Edge Animation Controls */}
          <div className="flex items-center space-x-2">
            <div className={`text-xs font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Animation:
            </div>
            
            <div className="flex space-x-1">
              {edgeAnimations.map((animation) => (
                <button
                  key={animation}
                  onClick={() => onEdgeAnimationToggle(animation)}
                  disabled={disabled}
                  className={`
                    group relative p-1.5 rounded-md text-xs transition-all duration-200
                    ${disabled 
                      ? `${isDark 
                          ? 'bg-gray-700/50 text-gray-500' 
                          : 'bg-gray-100/50 text-gray-400'
                        } cursor-not-allowed`
                      : `${currentEdgeAnimation === animation
                          ? isDark
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-500 text-white shadow-md'
                          : isDark 
                            ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-200 hover:text-white border border-gray-600/50 hover:border-gray-500/50' 
                            : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900 border border-gray-300/50 hover:border-gray-400/50'
                        } hover:scale-105 active:scale-95 shadow-sm hover:shadow-md`
                    }
                  `}
                  title={`${getEdgeAnimationLabel(animation)}`}
                >
                  <span className={`transition-colors duration-200 ${
                    disabled ? 'opacity-50' : 'group-hover:text-blue-400'
                  }`}>
                    {getEdgeAnimationIcon(animation)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Layout Controls */}
          <div className="flex items-center space-x-2">
            <div className={`text-xs font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Auto Layout:
            </div>
            
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
      </div>
    </div>
  )
} 