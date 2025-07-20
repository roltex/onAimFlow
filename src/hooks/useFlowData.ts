import { useCallback } from 'react'

/**
 * Hook for managing flow data operations
 */
export const useFlowData = () => {
  /**
   * Clear all flow data from localStorage and reload the page
   */
  const clearFlow = useCallback(() => {
    localStorage.removeItem('onAimFlow-nodes')
    localStorage.removeItem('onAimFlow-edges')
    window.location.reload()
  }, [])

  return {
    clearFlow
  }
} 