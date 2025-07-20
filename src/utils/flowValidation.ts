import type { Node, Edge } from '@xyflow/react'
import type { FlowValidationResult, CustomNodeData, DynamicNodeType } from '../types'

/**
 * Validates a flow to ensure it meets publishing requirements
 */
export const validateFlow = (nodes: Node[], edges: Edge[], dynamicNodeTypes: DynamicNodeType[] = []): FlowValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if there are any nodes
  if (nodes.length === 0) {
    errors.push('Flow must contain at least one node')
    return { isValid: false, errors, warnings }
  }

  // Find EVENT and OUTPUT nodes
  const eventNodes = nodes.filter(node => {
    const data = node.data as unknown as CustomNodeData
    return data.nodeType === 'event'
  })
  
  const outputNodes = nodes.filter(node => {
    const data = node.data as unknown as CustomNodeData
    return data.nodeType === 'output'
  })

  // Validation Rule 1: Must have at least one EVENT node
  if (eventNodes.length === 0) {
    errors.push('Flow must contain at least one EVENT node to trigger the workflow')
  }

  // Validation Rule 2: Must have at least one OUTPUT node
  if (outputNodes.length === 0) {
    errors.push('Flow must contain at least one OUTPUT node to produce results')
  }

  // Validation Rule 3: Check for disconnected nodes
  const connectedNodeIds = new Set<string>()
  edges.forEach(edge => {
    connectedNodeIds.add(edge.source)
    connectedNodeIds.add(edge.target)
  })

  const disconnectedNodes = nodes.filter(node => !connectedNodeIds.has(node.id))
  if (disconnectedNodes.length > 0) {
    if (nodes.length > 1) { // Only error if there are multiple nodes
      errors.push(`${disconnectedNodes.length} node(s) are not connected: ${disconnectedNodes.map(n => (n.data as unknown as CustomNodeData).label).join(', ')}`)
    }
  }

  // Validation Rule 4: Check for valid paths from EVENT to OUTPUT
  if (eventNodes.length > 0 && outputNodes.length > 0 && edges.length > 0) {
    const hasValidPath = eventNodes.some(eventNode => 
      outputNodes.some(outputNode => 
        hasPath(eventNode.id, outputNode.id, edges)
      )
    )

    if (!hasValidPath) {
      errors.push('There must be at least one valid path from an EVENT node to an OUTPUT node')
    }
  }

  // Validation Rule 5: Check node configurations (REQUIRED for publishing)
  const configurationErrors: string[] = []
  
  nodes.forEach(node => {
    const data = node.data as unknown as CustomNodeData
    const nodeName = data.label
    
    switch (data.nodeType) {
      case 'event':
        if (!data.eventSource) {
          configurationErrors.push(`${nodeName}: Event Source is required`)
        }
        if (!data.eventType) {
          configurationErrors.push(`${nodeName}: Event Type is required`)
        }
        break
      case 'filter':
        if (!data.filterConditions || data.filterConditions.length === 0) {
          configurationErrors.push(`${nodeName}: At least one filter condition is required`)
        }
        break
      case 'select':
        if (!data.selectProperty || data.selectProperty.trim() === '') {
          configurationErrors.push(`${nodeName}: Property Name is required`)
        }
        break
      case 'output':
        if (!data.outputSteps || data.outputSteps.length === 0) {
          configurationErrors.push(`${nodeName}: At least one output step is required`)
        }
        break
      default:
        // Check custom nodes (dynamic nodes)
        if (data.dynamicNodeTypeId) {
          const dynamicNodeType = dynamicNodeTypes.find(type => type.id === data.dynamicNodeTypeId)
          if (dynamicNodeType) {
            const requiredFields = dynamicNodeType.fields.filter(field => field.required)
            const missingFields = requiredFields.filter(field => {
              const value = data.dynamicFieldValues?.[field.id]
              return value === undefined || value === null || value === ''
            })
            
            if (missingFields.length > 0) {
              const fieldNames = missingFields.map(field => field.name).join(', ')
              configurationErrors.push(`${nodeName}: Required fields missing: ${fieldNames}`)
            }
          } else {
            configurationErrors.push(`${nodeName}: Custom node type not found`)
          }
        }
        break
    }
  })

  if (configurationErrors.length > 0) {
    errors.push('Node configuration errors:')
    configurationErrors.forEach(error => errors.push(`• ${error}`))
  }

  // Additional validation: Check for partially configured nodes (warnings only)
  const partiallyConfiguredNodes = nodes.filter(node => {
    const data = node.data as unknown as CustomNodeData
    
    switch (data.nodeType) {
      case 'event':
        // Already fully validated above, no partial states
        return false
      case 'filter':
        // Check if conditions exist but are incomplete
        return data.filterConditions && data.filterConditions.length > 0 && 
               data.filterConditions.some(condition => 
                 !condition.propertyName || !condition.operator || condition.value === undefined || condition.value === ''
               )
      case 'select':
        // Already fully validated above, no partial states
        return false
      case 'output':
        // Check if steps exist but are incomplete
        return data.outputSteps && data.outputSteps.length > 0 &&
               data.outputSteps.some(step => 
                 step.progress === undefined || step.point === undefined
               )
      default:
        return false
    }
  })

  if (partiallyConfiguredNodes.length > 0) {
    const nodeNames = partiallyConfiguredNodes.map(n => (n.data as unknown as CustomNodeData).label).join(', ')
    warnings.push(`${partiallyConfiguredNodes.length} node(s) have incomplete configuration: ${nodeNames}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Checks if there's a path between two nodes using BFS
 */
const hasPath = (startNodeId: string, endNodeId: string, edges: Edge[]): boolean => {
  if (startNodeId === endNodeId) return true

  // Build adjacency list
  const adjacencyList = new Map<string, string[]>()
  edges.forEach(edge => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, [])
    }
    adjacencyList.get(edge.source)!.push(edge.target)
  })

  // BFS to find path
  const queue = [startNodeId]
  const visited = new Set<string>([startNodeId])

  while (queue.length > 0) {
    const currentNode = queue.shift()!
    const neighbors = adjacencyList.get(currentNode) || []

    for (const neighbor of neighbors) {
      if (neighbor === endNodeId) {
        return true
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  return false
}

/**
 * Gets a human-readable validation summary
 */
export const getValidationSummary = (result: FlowValidationResult): string => {
  if (result.isValid) {
    return '✅ Flow is valid and ready to publish'
  }

  const errorCount = result.errors.length
  const warningCount = result.warnings?.length || 0
  
  let summary = `❌ ${errorCount} error${errorCount !== 1 ? 's' : ''} found`
  if (warningCount > 0) {
    summary += `, ${warningCount} warning${warningCount !== 1 ? 's' : ''}`
  }
  
  return summary
} 