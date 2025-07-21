import type { EdgeType } from '../components/FlowControls'

export type EdgeStyle = 'solid' | 'dashed'
export type EdgeAnimation = 'animated' | 'static'

interface EdgeStylePreferences {
  edgeType: EdgeType
  edgeStyle: EdgeStyle
  edgeAnimation: EdgeAnimation
}

const STORAGE_KEYS = {
  EDGE_TYPE: 'onAimFlow-edgeType',
  EDGE_STYLE: 'onAimFlow-edgeStyle',
  EDGE_ANIMATION: 'onAimFlow-edgeAnimation'
} as const

const DEFAULT_PREFERENCES: EdgeStylePreferences = {
  edgeType: 'smoothstep',
  edgeStyle: 'dashed',
  edgeAnimation: 'animated'
}

/**
 * Save edge style preferences to localStorage
 */
export const saveEdgeStylePreferences = (preferences: Partial<EdgeStylePreferences>) => {
  try {
    if (preferences.edgeType) {
      localStorage.setItem(STORAGE_KEYS.EDGE_TYPE, preferences.edgeType)
    }
    if (preferences.edgeStyle) {
      localStorage.setItem(STORAGE_KEYS.EDGE_STYLE, preferences.edgeStyle)
    }
    if (preferences.edgeAnimation) {
      localStorage.setItem(STORAGE_KEYS.EDGE_ANIMATION, preferences.edgeAnimation)
    }
  } catch (error) {
    console.warn('Failed to save edge style preferences to localStorage:', error)
  }
}

/**
 * Load edge style preferences from localStorage
 */
export const loadEdgeStylePreferences = (): EdgeStylePreferences => {
  try {
    const edgeType = localStorage.getItem(STORAGE_KEYS.EDGE_TYPE) as EdgeType
    const edgeStyle = localStorage.getItem(STORAGE_KEYS.EDGE_STYLE) as EdgeStyle
    const edgeAnimation = localStorage.getItem(STORAGE_KEYS.EDGE_ANIMATION) as EdgeAnimation

    return {
      edgeType: edgeType || DEFAULT_PREFERENCES.edgeType,
      edgeStyle: edgeStyle || DEFAULT_PREFERENCES.edgeStyle,
      edgeAnimation: edgeAnimation || DEFAULT_PREFERENCES.edgeAnimation
    }
  } catch (error) {
    console.warn('Failed to load edge style preferences from localStorage:', error)
    return DEFAULT_PREFERENCES
  }
}

/**
 * Get a single edge style preference
 */
export const getEdgeStylePreference = <K extends keyof EdgeStylePreferences>(
  key: K
): EdgeStylePreferences[K] => {
  try {
    const preferences = loadEdgeStylePreferences()
    return preferences[key]
  } catch (error) {
    console.warn(`Failed to load ${key} preference:`, error)
    return DEFAULT_PREFERENCES[key]
  }
}

/**
 * Clear all edge style preferences
 */
export const clearEdgeStylePreferences = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.warn('Failed to clear edge style preferences:', error)
  }
} 