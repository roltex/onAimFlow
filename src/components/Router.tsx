import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { FlowEditor } from './FlowEditor'
import { CompositeNodeEditor } from './CompositeNodeEditor'
import { useFlowManager } from '../hooks/useFlowManager'

/**
 * Router component that handles navigation between dashboard and flows
 */
export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard route */}
        <Route path="/" element={<DashboardWrapper />} />
        
        {/* Flow editor route */}
        <Route path="/flow/:flowId" element={<FlowEditorWrapper />} />
        
        {/* Composite editor route */}
        <Route path="/composite/:compositeId?" element={<CompositeEditorWrapper />} />
        
        {/* Redirect any unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

/**
 * Wrapper component for Dashboard that handles navigation
 */
const DashboardWrapper: React.FC = () => {
  const navigate = useNavigate()
  
  const handleOpenFlow = (flowId: string) => {
    navigate(`/flow/${flowId}`)
  }
  
  const handleOpenCompositeEditor = (compositeId?: string) => {
    navigate(`/composite/${compositeId || ''}`)
  }
  
  return <Dashboard onOpenFlow={handleOpenFlow} onOpenCompositeEditor={handleOpenCompositeEditor} />
}

/**
 * Wrapper component for FlowEditor that handles routing
 */
const FlowEditorWrapper: React.FC = () => {
  const { getFlow } = useFlowManager()
  const navigate = useNavigate()
  const { flowId } = useParams<{ flowId: string }>()
  
  // Check if flow exists
  const flow = flowId ? getFlow(flowId) : null
  
  if (!flowId || !flow) {
    // If flow doesn't exist, redirect to dashboard
    return <Navigate to="/" replace />
  }
  
  const handleBackToDashboard = () => {
    navigate('/')
  }
  
  return (
    <FlowEditor 
      flowId={flowId} 
      onBackToDashboard={handleBackToDashboard}
    />
  )
}

/**
 * Wrapper component for CompositeNodeEditor that handles routing
 */
const CompositeEditorWrapper: React.FC = () => {
  const navigate = useNavigate()
  const { compositeId } = useParams<{ compositeId?: string }>()
  
  const handleBackToDashboard = () => {
    navigate('/')
  }
  

  
  return (
    <CompositeNodeEditor 
      compositeId={compositeId} 
      onBack={handleBackToDashboard}
    />
  )
} 