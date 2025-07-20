# onAimFlow 🚀

A powerful visual workflow builder with custom node types, built with React, TypeScript, and React Flow.

## ✨ Features

### 🎯 **Visual Workflow Builder**
- **Drag & Drop Interface**: Intuitive node-based workflow creation
- **Real-time Preview**: See your workflow structure as you build
- **Connection Management**: Easy node-to-node connections with visual feedback
- **Flow Validation**: Built-in validation before publishing workflows

### 🎨 **Custom Node Types**
- **Dynamic Node Creation**: Create your own custom node types
- **Configurable Fields**: Add custom configuration fields to nodes
- **Connection Points**: Define input/output ports for each node type
- **Visual Customization**: Custom icons, colors, and styling
- **Import/Export**: Share custom node types between projects

### 📊 **Workflow Management**
- **Dashboard**: Centralized workflow management
- **Publish/Unpublish**: Control workflow availability
- **Import/Export**: Backup and share complete workflows
- **Bulk Operations**: Select and manage multiple workflows
- **Search & Filter**: Find workflows by status (All, Published, Drafts)

### 🎛️ **Advanced Features**
- **Edge Drop**: Insert nodes between existing connections
- **Node Configuration**: Configure node parameters and settings
- **Theme Support**: Dark and light mode
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Persistent data storage

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS
- **Flow Builder**: React Flow (@xyflow/react)
- **Build Tool**: Vite
- **State Management**: React Context API
- **Icons**: Custom SVG icons and emojis

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

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

## 📖 Usage Guide

### Creating Workflows

1. **Start from Dashboard**: Click "Create Flow" to start a new workflow
2. **Add Nodes**: Drag nodes from the sidebar or use edge drop functionality
3. **Connect Nodes**: Click and drag from node ports to create connections
4. **Configure Nodes**: Double-click nodes to configure their settings
5. **Validate & Publish**: Use the validation system before publishing

### Creating Custom Node Types

1. **Access Node Editor**: Go to Dashboard → Custom Nodes tab
2. **Create New Type**: Click "Create Node Type"
3. **Configure Properties**:
   - **Basic Info**: Name, description, icon, color
   - **Connection Points**: Define input/output ports
   - **Configuration Fields**: Add custom fields for node configuration
4. **Save & Use**: Your custom node type is now available in the flow editor

### Importing/Exporting

#### Workflows
- **Export**: Select workflows and click "Export" to download JSON file
- **Import**: Click "Import" and select a workflow JSON file

#### Custom Node Types
- **Export**: Select custom node types and click "Export"
- **Import**: Click "Import" and select a node types JSON file

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── forms/          # Form components
│   ├── modals/         # Modal dialogs
│   └── ...
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── ...
```

## 🎨 Key Components

### Core Components
- **Dashboard**: Main workflow and node type management
- **FlowEditor**: Visual workflow builder interface
- **FlowCanvas**: React Flow canvas with custom nodes
- **NodePalette**: Sidebar with built-in and custom node types
- **CustomNode**: Renderer for custom node types

### Modals
- **DynamicNodeEditorModal**: Create/edit custom node types
- **EdgeDropModal**: Insert nodes between connections
- **NodeConfigModal**: Configure node parameters
- **ValidationModal**: Workflow validation results

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Features

1. **Custom Node Types**: Extend the `DynamicNodeType` interface
2. **New Node Categories**: Add to the built-in node types array
3. **Validation Rules**: Extend the validation logic in `flowValidation.ts`
4. **UI Components**: Follow the existing component patterns

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Issues & Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Built with ❤️ using React, TypeScript, and React Flow**
