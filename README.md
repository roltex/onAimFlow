# onAimFlow 🚀

A powerful visual workflow builder with custom node types, built with React, TypeScript, and React Flow. Create, manage, and execute complex workflows through an intuitive drag-and-drop interface.

## ✨ Features

### 🎯 **Visual Workflow Builder**
- **Drag & Drop Interface**: Intuitive node-based workflow creation with real-time visual feedback
- **Smart Connections**: Automatic connection validation and visual indicators
- **Edge Drop Functionality**: Insert nodes between existing connections seamlessly
- **Flow Validation**: Comprehensive validation system before publishing workflows
- **Real-time Preview**: See your workflow structure as you build with instant updates

### 🎨 **Custom Node Types System**
- **Dynamic Node Creation**: Create your own custom node types with full configuration
- **Configurable Fields**: Support for text, number, select, textarea, boolean, and date fields
- **Flexible Connection Points**: Define input, output, or bidirectional ports for each node type
- **Visual Customization**: Choose from 100+ icons and custom color schemes
- **Import/Export System**: Share custom node types between projects and teams
- **Category Organization**: Organize nodes by trigger, process, output, utility, or custom categories

### 📊 **Advanced Workflow Management**
- **Centralized Dashboard**: Comprehensive workflow and node type management
- **Publish/Unpublish System**: Control workflow availability and versioning
- **Bulk Operations**: Select and manage multiple workflows simultaneously
- **Advanced Search & Filter**: Find workflows by status (All, Published, Drafts)
- **Import/Export**: Backup and share complete workflows with metadata
- **Flow Statistics**: Track creation dates, modification times, and usage metrics

### 🎛️ **Professional Features**
- **Composite Nodes**: Create reusable workflow components
- **Node Configuration**: Rich parameter configuration with validation
- **Theme System**: Dark and light mode with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Local Storage**: Persistent data storage with automatic backup
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🛠️ Technology Stack

### Frontend Framework
- **React 18**: Latest React features with concurrent rendering
- **TypeScript**: Type-safe development with strict type checking
- **Vite**: Fast build tool with hot module replacement

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Flow**: Professional-grade flow builder library
- **Custom Icons**: 100+ React Icons (Feather Icons) + emoji support

### State Management
- **React Context API**: Centralized state management with TypeScript
- **Custom Hooks**: Reusable logic for complex state operations
- **Local Storage**: Persistent data storage with automatic serialization

### Development Tools
- **ESLint**: Code quality and consistency
- **TypeScript**: Static type checking and IntelliSense
- **Vite**: Fast development server and optimized builds

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher (or yarn)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd onAimFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 📖 Comprehensive Usage Guide

### 🎯 Creating Your First Workflow

1. **Access the Dashboard**
   - Open the application and you'll see the main dashboard
   - Navigate to the "Flows" tab to see existing workflows

2. **Create a New Flow**
   - Click the "Create Flow" button
   - Enter a name and description for your workflow
   - Click "Create" to open the flow editor

3. **Building Your Workflow**
   - **Add Nodes**: Drag nodes from the left sidebar onto the canvas
   - **Connect Nodes**: Click and drag from output ports to input ports
   - **Configure Nodes**: Double-click any node to configure its parameters
   - **Edge Drop**: Drag a node onto an existing connection to insert it

4. **Validate and Publish**
   - Click the validation button to check your workflow
   - Fix any issues highlighted by the validation system
   - Click "Publish" to make your workflow available

### 🎨 Creating Custom Node Types

1. **Access Node Management**
   - Go to Dashboard → "Custom Nodes" tab
   - Click "Create Node Type" to open the node editor

2. **Configure Basic Properties**
   - **Name**: Descriptive name for your node type
   - **Description**: Detailed explanation of what the node does
   - **Icon**: Choose from 100+ icons or use custom emojis
   - **Color**: Select from predefined color schemes
   - **Category**: Choose trigger, process, output, utility, or custom

3. **Define Connection Points**
   - **Port Type**: Input, Output, or Input/Output
   - **Port Name**: Descriptive name for the connection
   - **Required**: Mark ports as required or optional

4. **Add Configuration Fields**
   - **Field Types**: Text, Number, Select, Textarea, Boolean, Date
   - **Validation**: Set required fields, min/max values, options
   - **Default Values**: Provide sensible defaults for users

5. **Save and Use**
   - Click "Save" to create your custom node type
   - Your node type now appears in the flow editor sidebar
   - Users can drag and drop your custom node type into workflows

### 📊 Advanced Workflow Management

#### Import/Export System

**Exporting Workflows:**
```bash
1. Select one or more workflows from the dashboard
2. Click "Export" to download a JSON file
3. The file contains complete workflow data including nodes, connections, and metadata
```

**Importing Workflows:**
```bash
1. Click "Import" in the dashboard
2. Select a previously exported workflow JSON file
3. The workflow will be imported with all its components intact
```

#### Custom Node Type Sharing

**Exporting Node Types:**
```bash
1. Go to Custom Nodes tab
2. Select the node types you want to share
3. Click "Export" to download a JSON file
4. Share the file with your team or save for backup
```

**Importing Node Types:**
```bash
1. Click "Import" in the Custom Nodes tab
2. Select a node types JSON file
3. All node types will be imported and available for use
```

## 🏗️ Project Architecture

### Directory Structure

```
src/
├── components/              # React components
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── FlowsTab.tsx    # Workflow management interface
│   │   ├── CustomNodesTab.tsx # Custom node type management
│   │   ├── CompositeNodesTab.tsx # Composite node management
│   │   └── ...
│   ├── forms/              # Reusable form components
│   │   ├── FilterConditionsForm.tsx
│   │   └── OutputStepsForm.tsx
│   ├── modals/             # Modal dialogs
│   │   ├── DynamicNodeEditorModal.tsx # Custom node editor
│   │   ├── EdgeDropModal.tsx # Node insertion modal
│   │   ├── NodeConfigModal.tsx # Node configuration
│   │   └── ...
│   ├── FlowEditor.tsx      # Main flow editor component
│   ├── FlowCanvas.tsx      # React Flow canvas wrapper
│   ├── NodePalette.tsx     # Sidebar with available nodes
│   ├── CustomNode.tsx      # Custom node renderer
│   └── ...
├── contexts/               # React Context providers
│   ├── FlowManagerContext.tsx # Workflow state management
│   ├── DynamicNodeContext.tsx # Custom node type management
│   ├── CompositeNodeContext.tsx # Composite node management
│   └── ...
├── hooks/                  # Custom React hooks
│   ├── useFlowData.ts      # Flow data management
│   ├── useEdgeDrop.ts      # Edge drop functionality
│   ├── useCompositeOptimization.ts # Performance optimization
│   └── ...
├── types/                  # TypeScript type definitions
│   └── index.ts           # Centralized type definitions
├── utils/                  # Utility functions
│   ├── flowValidation.ts  # Workflow validation logic
│   ├── compositeValidation.ts # Composite node validation
│   └── ...
├── App.tsx                # Main application component
├── main.tsx              # Application entry point
└── ...
```

### Core Architecture Patterns

#### 1. **Context-Based State Management**
```typescript
// Centralized state management using React Context
const FlowManagerContext = createContext<FlowManagerContextType | null>(null)

// Usage in components
const { flows, createFlow, updateFlow, deleteFlow } = useFlowManager()
```

#### 2. **Custom Hook Pattern**
```typescript
// Reusable logic encapsulated in custom hooks
export const useEdgeDrop = () => {
  // Edge drop logic implementation
  return { handleEdgeDrop, edgeDropState }
}
```

#### 3. **Type-Safe Development**
```typescript
// Comprehensive type definitions
interface DynamicNodeType {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  ports: PortDefinition[]
  fields: ConfigurableField[]
  createdAt: Date
  updatedAt: Date
  isCustom: boolean
}
```

#### 4. **Component Composition**
```typescript
// Modular component architecture
<FlowEditor>
  <Header />
  <FlowCanvas>
    <CustomNode />
    <EdgeDropModal />
  </FlowCanvas>
  <NodePalette />
</FlowEditor>
```

## 🎨 Key Components Deep Dive

### Core Components

#### **Dashboard Component**
- **Purpose**: Central hub for workflow and node type management
- **Features**: Tab navigation, bulk operations, import/export
- **State Management**: Integrates with multiple contexts for comprehensive data management

#### **FlowEditor Component**
- **Purpose**: Main workflow builder interface
- **Features**: Canvas management, node interactions, validation
- **Integration**: Combines React Flow with custom node system

#### **FlowCanvas Component**
- **Purpose**: React Flow canvas with custom node support
- **Features**: Drag & drop, connection management, edge drop functionality
- **Customization**: Extends React Flow with custom node types

#### **NodePalette Component**
- **Purpose**: Sidebar with available node types
- **Features**: Built-in nodes, custom nodes, composite nodes
- **Organization**: Categorized display with search functionality

#### **CustomNode Component**
- **Purpose**: Renderer for custom node types
- **Features**: Dynamic port rendering, configuration status, visual feedback
- **Flexibility**: Supports all custom node type configurations

### Modal System

#### **DynamicNodeEditorModal**
- **Purpose**: Create and edit custom node types
- **Features**: Form validation, icon selection, field configuration
- **User Experience**: Step-by-step node type creation process

#### **EdgeDropModal**
- **Purpose**: Insert nodes between existing connections
- **Features**: Node type selection, connection preservation
- **Workflow**: Maintains flow integrity during node insertion

#### **NodeConfigModal**
- **Purpose**: Configure node parameters and settings
- **Features**: Dynamic field rendering, validation, error handling
- **Integration**: Works with all node types (built-in and custom)

## 🔧 Development Best Practices

### Code Organization

#### **1. Component Structure**
```typescript
// Follow consistent component structure
interface ComponentProps {
  // Props interface
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  const { state, setState } = useState()
  
  // Event handlers
  const handleEvent = useCallback(() => {
    // Event logic
  }, [dependencies])
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}
```

#### **2. Type Safety**
```typescript
// Use strict TypeScript configuration
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

#### **3. State Management**
```typescript
// Use Context for global state
// Use local state for component-specific data
// Use custom hooks for complex state logic
```

#### **4. Performance Optimization**
```typescript
// Use React.memo for expensive components
// Use useCallback for event handlers
// Use useMemo for expensive calculations
// Implement proper dependency arrays
```

### Adding New Features

#### **1. Custom Node Types**
```typescript
// Extend the DynamicNodeType interface
interface CustomNodeType extends DynamicNodeType {
  customProperty: string
}

// Add to the node types array
const customNodeTypes: CustomNodeType[] = [
  // Your custom node types
]
```

#### **2. New Node Categories**
```typescript
// Add to the built-in node types
const builtInNodeTypes: NodeType[] = [
  // Existing node types
  {
    id: 'new-category',
    type: 'newCategory',
    label: 'New Category',
    description: 'Description of new category',
    icon: '🎯',
    color: 'from-purple-500 to-purple-600'
  }
]
```

#### **3. Validation Rules**
```typescript
// Extend validation logic in flowValidation.ts
export const validateCustomRule = (flow: Flow): ValidationResult => {
  // Custom validation logic
  return {
    isValid: true,
    errors: [],
    warnings: []
  }
}
```

#### **4. UI Components**
```typescript
// Follow existing component patterns
// Use consistent styling with Tailwind CSS
// Implement proper accessibility features
// Add comprehensive TypeScript types
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```bash
# Create .env file for production
VITE_APP_TITLE=onAimFlow
VITE_APP_VERSION=1.0.0
```

### Deployment Platforms
- **Vercel**: Optimized for Vite applications
- **Netlify**: Static site hosting with CI/CD
- **GitHub Pages**: Free hosting for open source projects
- **AWS S3**: Scalable static hosting

## 📝 API Documentation

### Context APIs

#### **FlowManagerContext**
```typescript
interface FlowManagerContextType {
  flows: Flow[]
  createFlow: (flowData: CreateFlowData) => Flow
  updateFlow: (id: string, updates: Partial<Flow>) => void
  deleteFlow: (id: string) => void
  togglePublish: (id: string) => void
  exportFlows: (flowIds?: string[]) => void
  importFlows: (flowsData: Flow[]) => void
}
```

#### **DynamicNodeContext**
```typescript
interface DynamicNodeContextType {
  dynamicNodeTypes: DynamicNodeType[]
  createDynamicNodeType: (nodeType: CreateNodeTypeData) => DynamicNodeType
  updateDynamicNodeType: (id: string, updates: Partial<DynamicNodeType>) => void
  deleteDynamicNodeType: (id: string) => void
  exportDynamicNodeTypes: (nodeTypeIds?: string[]) => void
  importDynamicNodeTypes: (nodeTypesData: DynamicNodeType[]) => void
}
```

### Hook APIs

#### **useEdgeDrop**
```typescript
interface EdgeDropHook {
  handleEdgeDrop: (event: React.DragEvent) => void
  edgeDropState: EdgeDropState
  resetEdgeDrop: () => void
}
```

#### **useFlowData**
```typescript
interface FlowDataHook {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  saveFlow: () => void
  loadFlow: () => void
}
```

## 🐛 Troubleshooting

### Common Issues

#### **1. Node Types Not Loading**
```bash
# Check localStorage for corrupted data
localStorage.clear()
# Refresh the application
```

#### **2. Flow Validation Errors**
```bash
# Check node configuration
# Verify all required fields are filled
# Ensure proper connections between nodes
```

#### **3. Import/Export Issues**
```bash
# Verify JSON file format
# Check file encoding (should be UTF-8)
# Ensure file size is reasonable
```

#### **4. Performance Issues**
```bash
# Check for memory leaks in custom components
# Optimize large workflows with pagination
# Use React DevTools for performance profiling
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Install dependencies (`npm install`)
4. Start development server (`npm run dev`)
5. Make your changes
6. Run tests and linting (`npm run lint`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Code Standards
- **TypeScript**: Use strict typing, avoid `any`
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use consistent code formatting
- **Testing**: Add tests for new features
- **Documentation**: Update README and add JSDoc comments

### Pull Request Guidelines
- **Clear Description**: Explain what the PR does and why
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how to test the changes
- **Breaking Changes**: Clearly mark any breaking changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Flow**: For the excellent flow builder library
- **React Icons**: For the comprehensive icon library
- **Tailwind CSS**: For the utility-first CSS framework
- **Vite**: For the fast build tool and development experience

## 📞 Support

### Getting Help
1. **Documentation**: Check this README and inline code comments
2. **Issues**: Search existing issues on GitHub
3. **Discussions**: Use GitHub Discussions for questions
4. **Email**: Contact the maintainers for private support

### Reporting Bugs
When reporting bugs, please include:
- **Environment**: Browser, OS, Node.js version
- **Steps**: Detailed steps to reproduce the issue
- **Expected vs Actual**: What you expected vs what happened
- **Screenshots**: Visual evidence of the issue
- **Console Logs**: Any error messages from the browser console

---

**Built with ❤️ using React, TypeScript, and React Flow**

*onAimFlow - Empowering visual workflow creation for everyone*
