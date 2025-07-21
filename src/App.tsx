import React from 'react'
import '@xyflow/react/dist/style.css'
import { ThemeProvider, Layout, Router } from './components'
import { FlowManagerProvider } from './contexts/FlowManagerContext'
import { DynamicNodeProvider } from './contexts/DynamicNodeContext'
import { CompositeNodeProvider } from './contexts/CompositeNodeContext'

/**
 * Main application component with routing
 */
const App: React.FC = () => {
  return (
    <FlowManagerProvider>
      <DynamicNodeProvider>
        <CompositeNodeProvider>
          <ThemeProvider>
            <Layout>
              <Router />
            </Layout>
          </ThemeProvider>
        </CompositeNodeProvider>
      </DynamicNodeProvider>
    </FlowManagerProvider>
  )
}

export default App
