import { useMemo, useCallback } from 'react'
import type { CompositeNode, Node, Edge } from '../types'

interface CompositeOptimizationOptions {
  maxNodes?: number
  maxEdges?: number
  enableVirtualization?: boolean
  cacheResults?: boolean
}

interface OptimizationResult {
  isOptimized: boolean
  performanceScore: number
  recommendations: string[]
  estimatedRenderTime: number
}

/**
 * Hook for optimizing composite node performance
 */
export const useCompositeOptimization = (options: CompositeOptimizationOptions = {}) => {
  const {
    maxNodes = 50,
    maxEdges = 100,
    enableVirtualization = true,
    cacheResults = true
  } = options

  // Calculate performance metrics for a composite node
  const analyzePerformance = useCallback((composite: CompositeNode): OptimizationResult => {
    const nodeCount = composite.internalNodes.length
    const edgeCount = composite.internalEdges.length
    const portCount = composite.exposedInputs.length + composite.exposedOutputs.length

    // Calculate performance score (0-100, higher is better)
    let performanceScore = 100

    // Penalize for large node count
    if (nodeCount > maxNodes) {
      performanceScore -= Math.min(30, (nodeCount - maxNodes) * 2)
    }

    // Penalize for large edge count
    if (edgeCount > maxEdges) {
      performanceScore -= Math.min(20, (edgeCount - maxEdges))
    }

    // Penalize for too many exposed ports
    if (portCount > 10) {
      performanceScore -= Math.min(15, (portCount - 10) * 1.5)
    }

    // Estimate render time (rough calculation)
    const estimatedRenderTime = Math.max(100, nodeCount * 5 + edgeCount * 2 + portCount * 10)

    // Generate recommendations
    const recommendations: string[] = []

    if (nodeCount > maxNodes) {
      recommendations.push(`Consider splitting into smaller composites (${nodeCount} > ${maxNodes} nodes)`)
    }

    if (edgeCount > maxEdges) {
      recommendations.push(`Reduce internal connections (${edgeCount} > ${maxEdges} edges)`)
    }

    if (portCount > 10) {
      recommendations.push(`Limit exposed ports to essential ones (${portCount} > 10 ports)`)
    }

    if (performanceScore < 50) {
      recommendations.push('Consider optimizing the composite structure for better performance')
    }

    return {
      isOptimized: performanceScore >= 70,
      performanceScore: Math.max(0, performanceScore),
      recommendations,
      estimatedRenderTime
    }
  }, [maxNodes, maxEdges])

  // Optimize node positions for better layout
  const optimizeNodePositions = useCallback((nodes: Node[], edges: Edge[]) => {
    // Simple layout optimization - could be enhanced with more sophisticated algorithms
    const nodeMap = new Map<string, Node>()
    nodes.forEach(node => nodeMap.set(node.id, node))

    // Calculate center point
    const centerX = nodes.reduce((sum, node) => sum + node.position.x, 0) / nodes.length
    const centerY = nodes.reduce((sum, node) => sum + node.position.y, 0) / nodes.length

    // Optimize positions to reduce edge crossings
    const optimizedNodes = nodes.map(node => {
      const connectedEdges = edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      )

      // Adjust position based on connections
      let newX = node.position.x
      let newY = node.position.y

      connectedEdges.forEach(edge => {
        const connectedNode = nodeMap.get(edge.source === node.id ? edge.target : edge.source)
        if (connectedNode) {
          const dx = connectedNode.position.x - node.position.x
          const dy = connectedNode.position.y - node.position.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance > 0) {
            // Move slightly towards connected nodes
            newX += (dx / distance) * 10
            newY += (dy / distance) * 10
          }
        }
      })

      // Keep within reasonable bounds
      newX = Math.max(0, Math.min(1000, newX))
      newY = Math.max(0, Math.min(1000, newY))

      return {
        ...node,
        position: { x: newX, y: newY }
      }
    })

    return optimizedNodes
  }, [])

  // Memoize composite analysis results
  const memoizedAnalysis = useMemo(() => {
    if (!cacheResults) return null
    return new Map<string, OptimizationResult>()
  }, [cacheResults])

  // Get cached analysis or compute new one
  const getOptimizedAnalysis = useCallback((composite: CompositeNode): OptimizationResult => {
    if (cacheResults && memoizedAnalysis?.has(composite.id)) {
      return memoizedAnalysis.get(composite.id)!
    }

    const result = analyzePerformance(composite)
    
    if (cacheResults && memoizedAnalysis) {
      memoizedAnalysis.set(composite.id, result)
    }

    return result
  }, [analyzePerformance, cacheResults, memoizedAnalysis])

  // Batch optimization for multiple composites
  const optimizeBatch = useCallback((composites: CompositeNode[]) => {
    return composites.map(composite => ({
      composite,
      optimization: getOptimizedAnalysis(composite)
    }))
  }, [getOptimizedAnalysis])

  // Get performance recommendations for a composite
  const getRecommendations = useCallback((composite: CompositeNode): string[] => {
    const analysis = getOptimizedAnalysis(composite)
    return analysis.recommendations
  }, [getOptimizedAnalysis])

  // Check if a composite needs optimization
  const needsOptimization = useCallback((composite: CompositeNode): boolean => {
    const analysis = getOptimizedAnalysis(composite)
    return !analysis.isOptimized
  }, [getOptimizedAnalysis])

  return {
    analyzePerformance,
    optimizeNodePositions,
    getOptimizedAnalysis,
    optimizeBatch,
    getRecommendations,
    needsOptimization
  }
} 