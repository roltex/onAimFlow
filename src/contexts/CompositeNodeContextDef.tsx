import { createContext } from 'react'
import type { CompositeNode } from '../types'
import type { CompositeValidationResult } from '../utils/compositeValidation'

interface CompositeNodeContextType {
  compositeNodes: CompositeNode[]
  createCompositeNode: (composite: Omit<CompositeNode, 'id' | 'metadata'>) => CompositeNode
  updateCompositeNode: (id: string, updates: Partial<CompositeNode>) => void
  deleteCompositeNode: (id: string) => void
  getCompositeNode: (id: string) => CompositeNode | undefined
  toggleCompositePublished: (id: string) => CompositeValidationResult
  publishComposite: (id: string) => CompositeValidationResult
  unpublishComposite: (id: string) => void
  validateCompositeForPublish: (id: string) => CompositeValidationResult
  exportCompositeNodes: (nodeIds?: string[]) => void
  importCompositeNodes: (compositeNodes: CompositeNode[]) => void
}

export const CompositeNodeContext = createContext<CompositeNodeContextType | undefined>(undefined) 