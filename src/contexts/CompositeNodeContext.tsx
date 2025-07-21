import React, { useState, useCallback, useEffect } from 'react'
import type { CompositeNode } from '../types'
import { validateCompositeForPublish as validateCompositeForPublishUtil } from '../utils/compositeValidation'
import { useDynamicNodes } from '../hooks/useDynamicNodes'
import { CompositeNodeContext } from './CompositeNodeContextDef'

const STORAGE_KEY = 'onAimFlow-composite-nodes'



interface CompositeNodeProviderProps {
  children: React.ReactNode
}

export const CompositeNodeProvider: React.FC<CompositeNodeProviderProps> = ({ children }) => {
  const [compositeNodes, setCompositeNodes] = useState<CompositeNode[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { dynamicNodeTypes } = useDynamicNodes()

  // Load composite nodes from localStorage on mount
  useEffect(() => {
    const savedCompositeNodes = localStorage.getItem(STORAGE_KEY)
    if (savedCompositeNodes) {
      try {
        const parsed = JSON.parse(savedCompositeNodes)
        // Convert date strings back to Date objects and ensure published/connectionType fields exist
        const nodesWithDates = parsed.map((node: Record<string, unknown>) => ({
          ...node,
          published: (node.published as boolean) ?? false,
          connectionType: (node.connectionType as string) ?? 'input/output',
          metadata: {
            ...(node.metadata as Record<string, unknown>),
            createdAt: new Date((node.metadata as Record<string, unknown>).createdAt as string),
            updatedAt: new Date((node.metadata as Record<string, unknown>).updatedAt as string)
          }
        }))
        setCompositeNodes(nodesWithDates)
      } catch (_error) {
        // Error handling can be added here if needed
      }
    }
    setIsInitialized(true)
  }, [])

  // Save composite nodes to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compositeNodes))
  }, [compositeNodes, isInitialized])

  const generateId = useCallback(() => {
    return `composite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const createCompositeNode = useCallback((composite: Omit<CompositeNode, 'id' | 'metadata'>) => {
    const newComposite: CompositeNode = {
      ...composite,
      id: generateId(),
      published: false,
      metadata: {
        author: 'User',
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: []
      }
    }
    setCompositeNodes(prev => [...prev, newComposite])
    return newComposite
  }, [generateId])

  const updateCompositeNode = useCallback((id: string, updates: Partial<CompositeNode>) => {
    setCompositeNodes(prev => prev.map(node => 
      node.id === id 
        ? { 
            ...node, 
            ...updates, 
            metadata: { 
              ...node.metadata, 
              ...updates.metadata,
              updatedAt: new Date() 
            } 
          }
        : node
    ))
  }, [])

  const deleteCompositeNode = useCallback((id: string) => {
    setCompositeNodes(prev => prev.filter(node => node.id !== id))
    localStorage.removeItem(`onAimFlow-nodes-composite-${id}`)
    localStorage.removeItem(`onAimFlow-edges-composite-${id}`)
  }, [])

  const toggleCompositePublished = useCallback((id: string) => {
    const composite = compositeNodes.find(c => c.id === id)
    if (!composite) {
      throw new Error(`Composite with ID ${id} not found.`)
    }
    if (composite.published) {
      setCompositeNodes(prev => 
        prev.map(node => 
          node.id === id 
            ? { ...node, published: false }
            : node
        )
      )
      return { isValid: true, errors: [], warnings: [] }
    } else {
      const validationResult = validateCompositeForPublishUtil(composite, dynamicNodeTypes)
      if (validationResult.isValid) {
        setCompositeNodes(prev => 
          prev.map(node => 
            node.id === id 
              ? { ...node, published: true }
              : node
          )
        )
      }
      return validationResult
    }
  }, [compositeNodes, dynamicNodeTypes])

  const publishComposite = useCallback((id: string) => {
    const composite = compositeNodes.find(c => c.id === id)
    if (!composite) {
      throw new Error(`Composite with ID ${id} not found.`)
    }
    const validationResult = validateCompositeForPublishUtil(composite, dynamicNodeTypes)
    if (validationResult.isValid) {
      setCompositeNodes(prev => 
        prev.map(node => 
          node.id === id 
            ? { ...node, published: true }
            : node
        )
      )
    }
    return validationResult
  }, [compositeNodes, dynamicNodeTypes])

  const unpublishComposite = useCallback((id: string) => {
    setCompositeNodes(prev => 
      prev.map(node => 
        node.id === id 
          ? { ...node, published: false }
          : node
      )
    )
  }, [])

  const validateCompositeForPublishContext = useCallback((id: string) => {
    const composite = compositeNodes.find(c => c.id === id)
    if (!composite) {
      throw new Error(`Composite with ID ${id} not found.`)
    }
    return validateCompositeForPublishUtil(composite, dynamicNodeTypes)
  }, [compositeNodes, dynamicNodeTypes])

  const getCompositeNode = useCallback((id: string) => {
    return compositeNodes.find(node => node.id === id)
  }, [compositeNodes])

  const exportCompositeNodes = useCallback((nodeIds?: string[]) => {
    const nodesToExport = nodeIds 
      ? compositeNodes.filter(node => nodeIds.includes(node.id))
      : compositeNodes

    if (nodesToExport.length === 0) {
      throw new Error('No composite nodes selected for export')
    }

    const dataStr = JSON.stringify(nodesToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `onAimFlow-composite-nodes-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(link.href)
  }, [compositeNodes])

  const importCompositeNodes = useCallback((importedNodes: CompositeNode[]) => {
    // Validate imported nodes
    importedNodes.forEach(node => {
      if (!node.id || !node.name || !node.internalNodes || !node.internalEdges) {
        throw new Error('Invalid composite node data: missing required fields')
      }
    })

    // Add imported nodes with new IDs to avoid conflicts
    const nodesWithNewIds = importedNodes.map(node => ({
      ...node,
      id: generateId(),
      metadata: {
        ...node.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))

    setCompositeNodes(prev => [...prev, ...nodesWithNewIds])
  }, [generateId])

  return (
    <CompositeNodeContext.Provider
      value={{
        compositeNodes,
        createCompositeNode,
        updateCompositeNode,
        deleteCompositeNode,
        getCompositeNode,
        toggleCompositePublished,
        publishComposite,
        unpublishComposite,
        validateCompositeForPublish: validateCompositeForPublishContext,
        exportCompositeNodes,
        importCompositeNodes
      }}
    >
      {children}
    </CompositeNodeContext.Provider>
  )
} 