import { useContext } from 'react'
import { CompositeNodeContext } from '../contexts/CompositeNodeContextDef'

/**
 * Hook to use the composite node context
 */
export const useCompositeNodes = () => {
  const context = useContext(CompositeNodeContext)
  if (!context) {
    throw new Error('useCompositeNodes must be used within a CompositeNodeProvider')
  }
  return context
} 