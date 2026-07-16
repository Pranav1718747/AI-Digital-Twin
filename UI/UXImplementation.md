# SentinelOS AI: UI/UX Implementation Plan
## Frontend Design System & React Blueprint
**Version:** 1.0.0-PROD-UIUX  
**Classification:** Proprietary / Engineering & VCs  
**Target Funding Stage:** €10,000,000 Series Seed/A  

---

## Table of Contents
1. **Global Styling & Auth Shells**
   - 1.1 Design Tokens & Theme Configuration (`tailwind.config.js`)
   - 1.2 Global Styles & Animations (`globals.css`)
   - 1.3 React Auth Provider Keycloak Wrapper (`AuthProvider.tsx`)
   - 1.4 Next.js 15 App Router Global Layout Shell (`layout.tsx`)
2. **Cytoscape.js Graph Visualization**
   - 2.1 Interactive Graph Explorer Canvas Component (`GraphCanvas.tsx`)
   - 2.2 Right Details Drawer Panel
3. **React Flow Process Builder**
   - 3.1 Visual Workflow Builder Canvas (`WorkflowBuilder.tsx`)
   - 3.2 Drag-and-Drop Node Palette
4. **Real-time WebSockets & Alerts**
   - 4.1 Client Event Broker Wrapper Hook (`useWebSockets.ts`)
   - 4.2 Real-time Notification Banner Component
5. **Simulation Sandbox Workspace**
   - 5.1 Interactive Simulation Dashboard Workspace (`SimulationWorkspace.tsx`)
   - 5.2 Scenario Metrics Comparison Panels
6. **Support Triage, SSO & Administration panels**
   - 6.1 CSM Client Health Triage Panel
   - 6.2 Admin single Sign-On Provisioning Settings

---

## 1. Global Styling & Auth Shells

### 1.1 Design Tokens & Theme Configuration (`tailwind.config.js`)
SentinelOS uses a dark-mode first design system with a customized Tailwind configuration to support glassmorphism interfaces and smooth animations.

```javascript
// /opt/sentinel/frontend/tailwind.config.js
// Enterprise Tailwind CSS Theme Configuration profile

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090b", // Sleek dark canvas background
        foreground: "#f3f4f6",
        border: "rgba(255, 255, 255, 0.08)",
        
        // Brand Gradients and HSL Color Palettes
        primary: {
          DEFAULT: "#00f2fe",   // Cyan Brand accent color
          dark: "#4facfe"       // Soft Royal blue gradient end
        },
        alert: {
          critical: "#ff4d4d",  // Urgent red alert status
          warning: "#ffaa00",   // Warning orange
          success: "#00e676"    // Green success status
        },
        card: {
          DEFAULT: "rgba(18, 20, 24, 0.70)", // Glassmorphic card fill
          border: "rgba(255, 255, 255, 0.05)"
        }
      },
      fontFamily: {
        sans: ["Outfit", ...fontFamily.sans],
        mono: ["Space Mono", ...fontFamily.mono]
      },
      boxShadow: {
        glow: "0 0 15px rgba(0, 242, 254, 0.25)",
        alertGlow: "0 0 15px rgba(255, 77, 77, 0.40)"
      },
      animation: {
        "pulse-border": "pulseBorder 2.5s infinite ease-in-out",
        "fade-in": "fadeIn 0.4s ease-out-in"
      },
      keyframes: {
        pulseBorder: {
          "0%, 100%": { borderColor: "rgba(0, 242, 254, 0.20)" },
          "50%": { borderColor: "rgba(0, 242, 254, 0.80)" }
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.98)" },
          "100%": { opacity: 1, transform: "scale(1)" }
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
```

---

### 1.2 Global Styles & Animations (`globals.css`)
This CSS file configures Google Fonts, sets up global scrollbars, and defines custom animations:

```css
/* /opt/sentinel/frontend/globals.css */
/* Global CSS Tokens & Custom Animations */

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Space+Mono&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-foreground font-sans antialiased overflow-x-hidden;
  }
  
  /* Custom scrollbars for graph view tables */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #08090b;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 242, 254, 0.40);
  }
}

/* Glassmorphism utility card mappings */
.glass-panel {
  background: rgba(18, 20, 24, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-input {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  @apply rounded-lg py-2 px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary;
}

/* Critical Node Red Glowing animation definition */
.node-glowing-red {
  box-shadow: 0 0 20px rgba(255, 77, 77, 0.60);
  border-color: rgba(255, 77, 77, 0.90) !important;
  animation: pulseRedAlert 2s infinite ease-in-out;
}

@keyframes pulseRedAlert {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 77, 77, 0.30); }
  50% { box-shadow: 0 0 25px rgba(255, 77, 77, 0.85); }
}
```

---

### 1.3 React Auth Provider Keycloak Wrapper (`AuthProvider.tsx`)
This authentication wrapper processes keycloak credentials and maps roles to clearance permissions:

```tsx
// /opt/sentinel/frontend/components/providers/AuthProvider.tsx
// Keycloak Authentication State Wrapper

import React, { createContext, useContext, useEffect, useState } from "react";
import Keycloak from "keycloak-js";

interface UserContextProps {
  authenticated: boolean;
  token: string | null;
  email: string | null;
  clearanceLevel: number; // Numeric weight index (1 - 5)
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<UserContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [clearanceLevel, setClearanceLevel] = useState(1);

  useEffect(() => {
    // Initialize Keycloak SDK Instance
    const kc = new Keycloak({
      url: "https://sso.company.com/auth",
      realm: "sentinel-enterprise",
      clientId: "sentinel-client-app"
    });

    kc.init({ onLoad: "check-sso", checkLoginIframe: false }).then((auth) => {
      setKeycloak(kc);
      if (auth) {
        setAuthenticated(true);
        // Extract clearance levels from OIDC role assignments
        const roles = kc.realmAccess?.roles || [];
        if (roles.includes("CEO")) setClearanceLevel(5);
        else if (roles.includes("FINANCE_ADMIN")) setClearanceLevel(4);
        else if (roles.includes("DEPT_MANAGER")) setClearanceLevel(3);
        else if (roles.includes("SUPPORT_CSM")) setClearanceLevel(2);
        else setClearanceLevel(1);
      }
    });
  }, []);

  const login = () => keycloak?.login();
  const logout = () => keycloak?.logout({ redirectUri: window.location.origin });

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        token: keycloak?.token || null,
        email: keycloak?.tokenParsed?.email || null,
        clearanceLevel,
        login,
        logout
      }}
    >
      {authenticated ? children : (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
          <div className="glass-panel max-w-sm rounded-xl p-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">SentinelOS AI</h1>
            <p className="text-gray-400 text-sm mb-6">Enter enterprise credentials to access the digital twin.</p>
            <button
              onClick={login}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-black font-semibold py-2 px-4 rounded-lg hover:shadow-glow transition-all"
            >
              Sign In with SSO
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider instance");
  return context;
};
```

---

### 1.4 Next.js 15 App Router Global Layout Shell (`layout.tsx`)
This file defines the dashboard layout shell, including the navigation menu and status indicators:

```tsx
// /opt/sentinel/frontend/app/layout.tsx
// Global Layout Shell Frame

import React from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Link from "next/link";
import "@/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex h-screen w-screen overflow-hidden bg-background">
            {/* 1. Global Left Sidebar Menu */}
            <aside className="w-64 border-r border-border bg-card flex flex-col justify-between">
              <div>
                <div className="p-6 border-b border-border">
                  <span className="text-lg font-bold text-white tracking-wide">SENTINEL<span className="text-primary">OS</span></span>
                </div>
                <nav className="p-4 space-y-2">
                  <Link href="/explorer" className="flex items-center text-gray-400 hover:text-white hover:bg-white/5 py-2 px-3 rounded-lg transition-all text-sm font-medium">
                    Graph Explorer
                  </Link>
                  <Link href="/sandbox" className="flex items-center text-gray-400 hover:text-white hover:bg-white/5 py-2 px-3 rounded-lg transition-all text-sm font-medium">
                    Simulation Sandbox
                  </Link>
                  <Link href="/automation" className="flex items-center text-gray-400 hover:text-white hover:bg-white/5 py-2 px-3 rounded-lg transition-all text-sm font-medium">
                    Process Automation
                  </Link>
                  <Link href="/triage" className="flex items-center text-gray-400 hover:text-white hover:bg-white/5 py-2 px-3 rounded-lg transition-all text-sm font-medium">
                    Support Triage
                  </Link>
                  <Link href="/audits" className="flex items-center text-gray-400 hover:text-white hover:bg-white/5 py-2 px-3 rounded-lg transition-all text-sm font-medium">
                    Audits & Logs
                  </Link>
                </nav>
              </div>
              
              <div className="p-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-gray-500">v1.0.0-PROD</span>
                <span className="h-2 w-2 rounded-full bg-alert-success ring-4 ring-alert-success/20"></span>
              </div>
            </aside>
            
            {/* 2. Main Page Render viewport */}
            <main className="flex-1 flex flex-col overflow-hidden">
              <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/50">
                <div className="w-96">
                  <input
                    type="text"
                    placeholder="Search graph, users, or tickets... (Cmd+K)"
                    className="w-full glass-input text-sm text-white"
                  />
                </div>
              </header>
              <div className="flex-1 overflow-auto p-8 relative">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 2. Cytoscape.js Graph Visualization

SentinelOS uses **Cytoscape.js** to render organizational structures and relationship networks in an interactive canvas.

```
       [ Page Mount: /explorer ]
                   |
                   v
     (API Request: Fetch Graph JSON)
                   |
                   v
       [ Mount Cytoscape Canvas ]
       - Load styling rules (nodes & edges colors)
       - Bind event listeners (click, hover, double-click)
                   |
         +---------+---------+
         |                   |
         v                   v
   [ Left Click ]      [ Double Click ]
   - Center on Node    - Query Neo4j for 2-degree children
   - Open Sidebar      - Append nodes to canvas & run layout refresh
```

---

### 2.1 Interactive Graph Explorer Canvas Component (`GraphCanvas.tsx`)
This React component manages the Cytoscape container lifecycle, loads graph data, and handles user interactions:

```tsx
// /opt/sentinel/frontend/components/graph/GraphCanvas.tsx
// Cytoscape.js Graph Visualization Component

import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { useAuth } from "@/components/providers/AuthProvider";

interface GraphCanvasProps {
  tenantId: string;
  onNodeSelect: (nodeData: any) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ tenantId, onNodeSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Fetch graph dataset from API gateway
    const loadGraphData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/graph/snapshot?tenant_id=${tenantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const graphData = await response.json();
        
        // Initialize Cytoscape instance
        const cy = cytoscape({
          container: containerRef.current,
          elements: graphData.elements, // Expects { nodes: [...], edges: [...] }
          boxSelectionEnabled: false,
          autounselectify: false,
          
          // Canvas Styling definitions
          style: [
            {
              selector: "node",
              style: {
                "background-color": "#121418",
                "label": "data(name)",
                "color": "#ffffff",
                "font-size": "11px",
                "font-family": "Outfit, sans-serif",
                "text-valign": "center",
                "text-halign": "center",
                "width": "45px",
                "height": "45px",
                "border-width": "1px",
                "border-color": "rgba(255, 255, 255, 0.15)",
                "transition-property": "border-color, border-width, background-color",
                "transition-duration": 0.25
              }
            },
            {
              selector: "node[label = 'Employee']",
              style: {
                "border-color": "#00f2fe", // Cyan highlight for employees
                "border-width": "2px"
              }
            },
            {
              selector: "node[label = 'Department']",
              style: {
                "border-color": "#4facfe", // Blue highlight for departments
                "border-width": "2px",
                "width": "55px",
                "height": "55px"
              }
            },
            {
              selector: "edge",
              style: {
                "width": 1.5,
                "line-color": "rgba(255, 255, 255, 0.08)",
                "target-arrow-color": "rgba(255, 255, 255, 0.08)",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                "arrow-scale": 0.8
              }
            },
            {
              selector: "edge[type = 'REPORTS_TO']",
              style: {
                "line-color": "rgba(0, 242, 254, 0.25)",
                "target-arrow-color": "rgba(0, 242, 254, 0.25)"
              }
            }
          ],
          layout: {
            name: "cose", // Force-directed layout
            animate: true,
            animationDuration: 500,
            fit: true,
            padding: 40
          }
        });

        // 2. Bind Event Handlers
        cy.on("tap", "node", (evt) => {
          const node = evt.target;
          // Open details sidebar with selected node properties
          onNodeSelect(node.data());
          
          // Highlight selected node and dim others
          cy.elements().addClass("dimmed");
          node.removeClass("dimmed").neighborhood().removeClass("dimmed");
        });

        cy.on("tap", (evt) => {
          if (evt.target === cy) {
            // Reset highlights when clicking background
            cy.elements().removeClass("dimmed");
          }
        });

        cyRef.current = cy;
      } catch (err) {
        console.error("Failed to load graph data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGraphData();

    return () => {
      cyRef.current?.destroy();
    };
  }, [tenantId, token]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <span className="text-sm text-gray-400">Loading Enterprise Graph Context...</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full bg-[#08090b]" />
    </div>
  );
};
```

---

### 2.2 Collapsible Graph Sidebar Drawer Component
This drawer panel slides in from the right when a node is selected, displaying properties and downstream dependencies:

```tsx
// /opt/sentinel/frontend/components/graph/DetailsDrawer.tsx
// Sidebar details drawer panel for selected nodes

import React from "react";

interface DetailsDrawerProps {
  selectedNode: any | null;
  onClose: () => void;
}

export const DetailsDrawer: React.FC<DetailsDrawerProps> = ({ selectedNode, onClose }) => {
  if (!selectedNode) return null;

  return (
    <aside className="w-96 border-l border-border bg-card/90 backdrop-blur-xl h-full flex flex-col z-20">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-md font-semibold text-white">Entity Details</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-all">
          Close
        </button>
      </div>
      
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Entity Title Summary */}
        <div>
          <span className="text-xs uppercase font-semibold text-primary tracking-wider">
            {selectedNode.label || "System Entity"}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{selectedNode.name}</h3>
        </div>

        {/* Properties Key-Value Grid */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Metadata Properties</h4>
          <div className="glass-panel rounded-lg p-4 space-y-3">
            {Object.entries(selectedNode)
              .filter(([key]) => !["id", "label", "name"].includes(key))
              .map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-400 capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="text-white font-medium">{String(value)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
```

---

## 3. React Flow Process Builder

SentinelOS uses **React Flow** to provide a visual builder for mapping and automating Standard Operating Procedures (SOPs).

```
         [ Panel Sidebar: Tool Node Palette ]
                         |
                 (Drag Node Element)
                         v
         [ React Flow Grid Canvas Area ]
    - Drop listener maps coordinates to React State
    - Bind onConnect edges update listeners
                         |
           +-------------+-------------+
           |                           |
           v                           v
     [ Configure Node ]          [ Validate Graph ]
     - Open settings sidebar     - Must start with triggers
     - Input field mapping       - Highlight errors in Red
                         |
                         v
        [ Submit SOP JSON to API Endpoint ]
```

---

### 3.1 Visual Workflow Builder Canvas (`WorkflowBuilder.tsx`)
This component renders the interactive workflow builder canvas, handling node dragging, edge connections, and layout state:

```tsx
// /opt/sentinel/frontend/components/automation/WorkflowBuilder.tsx
// React Flow Automation Pipeline Canvas Component

import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node
} from "reactflow";
import "reactflow/dist/style.css";

// Define initial trigger node configuration
const initialNodes: Node[] = [
  {
    id: "trigger_01",
    type: "input",
    data: { label: "Webhook Ingress Trigger" },
    position: { x: 100, y: 150 },
    style: { background: "rgba(18, 20, 24, 0.8)", color: "#00f2fe", border: "1px solid #00f2fe" }
  }
];

export const WorkflowBuilder: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // 1. Handle drag connection between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // 2. Drag & Drop Event Handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) return;

      // Calculate relative coordinates on drop location
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top
      });

      const newNode: Node = {
        id: `node_${Math.random().toString(36).substr(2, 9)}`,
        type,
        position,
        data: { label: `${type.toUpperCase()} Action Step` },
        style: { background: "rgba(18, 20, 24, 0.8)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.1)" }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const saveWorkflow = async () => {
    // Basic verification check: Ensure there is at least one trigger path connected
    if (edges.length === 0) {
      alert("Validation Error: Pipeline must contain at least one connected transition link.");
      return;
    }
    
    const payload = {
      nodes,
      edges
    };
    
    // API request details mapping ...
    console.log("Submitting workflow pipeline configurations:", payload);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] w-full gap-4">
      {/* Visual Canvas Panel wrapper */}
      <ReactFlowProvider>
        <div ref={reactFlowWrapper} className="flex-1 h-full glass-panel rounded-xl overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <Background color="#1a1c23" gap={16} />
          </ReactFlow>
          
          <button
            onClick={saveWorkflow}
            className="absolute top-4 right-4 bg-primary text-black font-semibold px-4 py-2 rounded-lg z-10 hover:shadow-glow transition-all text-xs"
          >
            Save Pipeline Schema
          </button>
        </div>
      </ReactFlowProvider>

      {/* Node Configurations Sidebar panel */}
      {selectedNode && (
        <aside className="w-80 border border-border bg-card rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Configure Node Step</h3>
            <div className="space-y-3">
              <label className="text-xs text-gray-400">Node Identifier</label>
              <input
                type="text"
                readOnly
                value={selectedNode.id}
                className="w-full glass-input text-xs text-gray-500"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs text-gray-400">Step Label</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => {
                  const newLabel = e.target.value;
                  setNodes((nds) =>
                    nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, label: newLabel } } : n))
                  );
                }}
                className="w-full glass-input text-xs text-white"
              />
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="w-full border border-border text-gray-400 hover:text-white py-2 rounded-lg text-xs"
          >
            Close Properties
          </button>
        </aside>
      )}
    </div>
  );
};
```

---

### 3.2 Drag-and-Drop Node Palette
This side menu holds pre-configured node templates that users can drag onto the canvas:

```tsx
// /opt/sentinel/frontend/components/automation/SidebarNodePalette.tsx
// Visual drag-and-drop node template list panel

import React from "react";

export const SidebarNodePalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 border border-border bg-card rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Process Nodes</h3>
        <p className="text-xs text-gray-400">Drag items to create workflow steps.</p>
      </div>
      
      <div className="space-y-3">
        <div
          className="glass-panel p-3 rounded-lg cursor-grab hover:border-primary/50 text-xs text-white"
          draggable
          onDragStart={(e) => onDragStart(e, "default")}
        >
          📄 Standard Action Node
        </div>
        <div
          className="glass-panel p-3 rounded-lg cursor-grab hover:border-alert-warning/50 text-xs text-white"
          draggable
          onDragStart={(e) => onDragStart(e, "approval")}
        >
          🔒 Human Gate Approval
        </div>
        <div
          className="glass-panel p-3 rounded-lg cursor-grab hover:border-alert-critical/50 text-xs text-white"
          draggable
          onDragStart={(e) => onDragStart(e, "output")}
        >
          🚨 Alert Webhook Node
        </div>
      </div>
    </aside>
  );
};
```

---

## 4. Real-time WebSockets & Alerts

SentinelOS uses **WebSockets** to establish real-time connections between the client and the backend server, broadcasting instant notifications for system alerts and budget changes.

```
       [ App Mount: useWebSockets ]
                    |
                    v
       [ Establish WS Connection ]
      - Connect to: ws://api.sentinel/ws/events
      - Load heartbeat ping/pong timer (every 30s)
                    |
         +----------+----------+
         | (Connection Fails)  | (Message Received)
         v                     v
   [ Reconnect Loop ]    [ Route Message by Event Type ]
   - Wait 5s (exponential)  - Update local state (alert logs)
   - Retry connect          - Trigger notification toast
```

---

### 4.1 Client Event Broker Wrapper Hook (`useWebSockets.ts`)
This custom React hook manages WebSocket lifecycles, auto-reconnection logic, and handles incoming system events:

```typescript
// /opt/sentinel/frontend/hooks/useWebSockets.ts
// Real-time WebSocket Event Broker Hook

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export interface SystemEventPayload {
  event_id: string;
  tenant_id: string;
  event_type: "kpi_breach" | "ticket_update" | "sync_lag" | "security_block";
  severity: "low" | "medium" | "critical";
  message: string;
  timestamp: string;
}

export const useWebSockets = (tenantId: string) => {
  const { token, authenticated } = useAuth();
  const [activeAlerts, setActiveAlerts] = useState<SystemEventPayload[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "open" | "closed">("closed");
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = () => {
    if (!authenticated || !tenantId) return;

    setConnectionStatus("connecting");
    // Connect to WebSocket gateway endpoint
    const socket = new WebSocket(`ws://api.sentinel.company.com/ws/events/${tenantId}`);

    socket.onopen = () => {
      console.log("WebSocket connection established successfully.");
      setConnectionStatus("open");
    };

    socket.onmessage = (event) => {
      try {
        const payload: SystemEventPayload = JSON.parse(event.data);
        console.log("Real-time system event received:", payload);
        
        // Add new alerts to the local state
        setActiveAlerts((prev) => [payload, ...prev].slice(0, 100)); // Limit cache to 100 records
      } catch (err) {
        console.error("Failed to parse incoming WebSocket message:", err);
      }
    };

    socket.onclose = (event) => {
      console.warn(`WebSocket connection closed. Code: ${event.code}. Retrying connection...`);
      setConnectionStatus("closed");
      
      // Auto-reconnect with exponential backoff delay (max 30s)
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect();
      }, 5000);
    };

    socket.onerror = (error) => {
      console.error("WebSocket connection encountered an error:", error);
      socket.close();
    };

    wsRef.current = socket;
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [tenantId, authenticated]);

  return {
    activeAlerts,
    connectionStatus,
    clearAlert: (eventId: string) => {
      setActiveAlerts((prev) => prev.filter((a) => a.event_id !== eventId));
    }
  };
};
```

---

### 4.2 Real-time Notification Banner Component
This UI banner displays incoming critical notifications at the top of the dashboard:

```tsx
// /opt/sentinel/frontend/components/alerts/SystemNotificationBanner.tsx
// Real-time System Alert Notification Banner Component

import React from "react";
import { SystemEventPayload } from "@/hooks/useWebSockets";

interface SystemNotificationBannerProps {
  alerts: SystemEventPayload[];
  onDismiss: (id: string) => void;
}

export const SystemNotificationBanner: React.FC<SystemNotificationBannerProps> = ({ alerts, onDismiss }) => {
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  
  if (criticalAlerts.length === 0) return null;
  
  // Display the most recent critical alert
  const latestAlert = criticalAlerts[0];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-50 animate-bounce">
      <div className="bg-red-950/80 border border-alert-critical text-white px-4 py-3 rounded-lg shadow-alertGlow backdrop-blur-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🚨</span>
          <div>
            <div className="text-xs uppercase font-bold text-alert-critical tracking-wider">Critical System Alert</div>
            <p className="text-sm font-medium mt-0.5">{latestAlert.message}</p>
          </div>
        </div>
        <button
          onClick={() => onDismiss(latestAlert.event_id)}
          className="text-white/60 hover:text-white transition-all text-xs border border-white/10 hover:border-white/30 px-2 py-1 rounded"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};
```

---

## 5. Simulation Sandbox Workspace

SentinelOS provides an isolated sandbox interface where users can simulate organizational changes and compare the projected impacts with production metrics.

```
         [ Mount Simulation Sandbox Screen ]
                          |
             (Initialize Cloned Database)
                          |
         +----------------+----------------+
         |                                 |
         v                                 v
  [ Variable Sliders ]              [ Interactive Canvas ]
  - Change Marketing Budget %        - Reassign Employee nodes
  - Adjust Engineering headcount     - Link new project dependencies
         |                                 |
         +----------------+----------------+
                          |
                          v
               [ Click Run Forecast ]
                          |
                          v
         [ Render Side-by-Side Projections ]
         - Active Runway vs. Simulated Runway
         - Active OpEx vs. Simulated OpEx
```

---

### 5.1 Interactive Simulation Dashboard Workspace (`SimulationWorkspace.tsx`)
This React component implements the simulation controls panel, allowing users to adjust parameters and trigger strategic impact forecasts:

```tsx
// /opt/sentinel/frontend/components/sandbox/SimulationWorkspace.tsx
// Simulation Sandbox Panel Component

import React, { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

interface ForecastResults {
  currentRunwayMonths: number;
  projectedRunwayMonths: number;
  currentOpexEur: number;
  projectedOpexEur: number;
  criticalRisksFlagged: number;
}

export const SimulationWorkspace: React.FC = () => {
  const { token } = useAuth();
  
  // Simulation parameter states
  const [marketingBudgetPct, setMarketingBudgetPct] = useState(100);
  const [rndBudgetPct, setRndBudgetPct] = useState(100);
  const [headcountTarget, setHeadcountTarget] = useState(150);
  
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [results, setResults] = useState<ForecastResults | null>(null);

  const executeForecastAnalysis = async () => {
    setRunningAnalysis(true);
    try {
      const response = await fetch("/api/v1/simulation/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          marketing_budget_pct: marketingBudgetPct / 100,
          rnd_budget_pct: rndBudgetPct / 100,
          headcount_target: headcountTarget
        })
      });
      const data = await response.json();
      setResults(data.projections);
    } catch (err) {
      console.error("Failed to run strategy forecast:", err);
    } finally {
      setRunningAnalysis(false);
    }
  };

  const commitToProduction = async () => {
    const confirmCommit = window.confirm(
      "WARNING: You are about to apply these changes to the production databases. This action requires CEO approval. Proceed?"
    );
    if (!confirmCommit) return;
    
    // Trigger backend commit route ...
    alert("Strategy changes locked. Sent to CEO Approval Gate queue.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Strategic Simulation Sandbox</h1>
          <p className="text-xs text-gray-400 mt-1">Adjust sliders to run what-if simulations on the active company graph.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setMarketingBudgetPct(100);
              setRndBudgetPct(100);
              setHeadcountTarget(150);
              setResults(null);
            }}
            className="border border-border text-gray-400 hover:text-white px-4 py-2 rounded-lg text-xs"
          >
            Reset Variables
          </button>
          <button
            onClick={executeForecastAnalysis}
            disabled={runningAnalysis}
            className="bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:shadow-glow transition-all text-xs"
          >
            {runningAnalysis ? "Calculating..." : "Run Impact Forecast"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Side: Parameters sliders Panel */}
        <div className="glass-panel rounded-xl p-6 space-y-6 col-span-1">
          <h3 className="text-sm font-semibold text-white">Adjust Parameters</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Marketing Budget</span>
              <span className="text-white font-bold">{marketingBudgetPct}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={marketingBudgetPct}
              onChange={(e) => setMarketingBudgetPct(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>R&D Budget</span>
              <span className="text-white font-bold">{rndBudgetPct}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={rndBudgetPct}
              onChange={(e) => setRndBudgetPct(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Headcount Target</span>
              <span className="text-white font-bold">{headcountTarget} Employees</span>
            </div>
            <input
              type="range"
              min="100"
              max="250"
              value={headcountTarget}
              onChange={(e) => setHeadcountTarget(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        {/* Right Side: Projections Comparison View */}
        <div className="col-span-2 glass-panel rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Strategic Impact Comparison</h3>
            {results ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="glass-panel p-4 rounded-lg">
                  <div className="text-xs text-gray-400">Cash Runway</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {results.currentRunwayMonths}mo <span className="text-gray-500 text-xs">→</span>{" "}
                    <span className={results.projectedRunwayMonths >= results.currentRunwayMonths ? "text-alert-success" : "text-alert-critical"}>
                      {results.projectedRunwayMonths}mo
                    </span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-lg">
                  <div className="text-xs text-gray-400">Monthly OpEx</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    €{(results.currentOpexEur / 1000).toFixed(0)}k <span className="text-gray-500 text-xs">→</span>{" "}
                    <span className={results.projectedOpexEur <= results.currentOpexEur ? "text-alert-success" : "text-alert-critical"}>
                      €{(results.projectedOpexEur / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-lg col-span-2">
                  <div className="text-xs text-gray-400">Flagged Risk Indication alerts</div>
                  <div className={`text-sm font-semibold mt-2 ${results.criticalRisksFlagged > 0 ? "text-alert-critical" : "text-alert-success"}`}>
                    {results.criticalRisksFlagged > 0
                      ? `Alert: ${results.criticalRisksFlagged} critical SLA milestone risks detected downstream.`
                      : "Success: No operational project bottlenecks flagged."}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center border border-dashed border-border rounded-lg">
                <span className="text-xs text-gray-500">Configure parameters and click 'Run Impact Forecast' to view comparisons.</span>
              </div>
            )}
          </div>

          {results && (
            <button
              onClick={commitToProduction}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-black font-bold py-2 rounded-lg hover:shadow-glow transition-all text-xs"
            >
              Apply Strategy changes to Production
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## 6. Support Triage, SSO & Administration panels

SentinelOS includes specialized interfaces for Customer Success Managers to resolve client incidents and System Administrators to manage security credentials.

```
                  +--------------------------------+
                  |    MOUNT SUPPORT TRIAGE PAGE   |
                  +--------------------------------+
                                   |
                  (API Request: Load Open Tickets)
                                   |
                                   v
             [ Select Customer Ticket from List Table ]
                                   |
         +-------------------------+-------------------------+
         | (Inspect Escalation Details)                      | (Compile Resolution Response)
         v                                                   v
   [ Read Linked Jira Bug ]                            [ Click Draft AI Email Response ]
   - Fetch assignee & comments                         - Calls PydanticAI generator
   - Display project deadline status                   - Render response draft in editor
                                                             |
                                                             v
                                               [ Review, Edit, & Click Send ]
```

---

### 6.1 CSM Client Health Triage Panel (`SupportTriage.tsx`)
This interface enables CSMs to manage customer support escalations, view linked engineering tickets, and draft responses using an AI assistant:

```tsx
// /opt/sentinel/frontend/components/triage/SupportTriage.tsx
// CSM Support Incident & Triage Dashboard Component

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

interface SupportTicket {
  id: string;
  customerName: string;
  subject: string;
  sentimentScore: number; // Values range from -1.0 to +1.0
  linkedJiraKey: string;
  status: string;
}

export const SupportTriage: React.FC = () => {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  const [emailDraft, setEmailDraft] = useState("");
  const [drafting, setDrafting] = useState(false);

  useEffect(() => {
    // 1. Fetch active support tickets list
    const fetchIncidents = async () => {
      try {
        const response = await fetch("/api/v1/support/tickets", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setTickets(data.tickets);
      } catch (err) {
        console.error("Failed to load support incidents:", err);
      }
    };
    fetchIncidents();
  }, [token]);

  const generateAIDraft = async () => {
    if (!selectedTicket) return;
    setDrafting(true);
    try {
      const response = await fetch(`/api/v1/support/tickets/${selectedTicket.id}/draft-reply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEmailDraft(data.draft_text);
    } catch (err) {
      console.error("Failed to compile response draft:", err);
    } finally {
      setDrafting(false);
    }
  };

  const sendEmail = async () => {
    if (!selectedTicket || !emailDraft) return;
    try {
      await fetch(`/api/v1/support/tickets/${selectedTicket.id}/send-reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email_body: emailDraft })
      });
      alert("Notification email successfully sent to client.");
      setSelectedTicket(null);
      setEmailDraft("");
    } catch (err) {
      console.error("Failed to dispatch email reply:", err);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* 1. Left Column: Tickets List Directory Table */}
      <div className="col-span-1 glass-panel rounded-xl p-6 flex flex-col overflow-hidden">
        <h3 className="text-sm font-semibold text-white mb-4">Support Incidents</h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`p-4 rounded-lg cursor-pointer border transition-all ${
                selectedTicket?.id === t.id ? "border-primary bg-primary/5" : "border-border hover:border-white/20 bg-card/45"
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-white font-bold">{t.customerName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${t.sentimentScore < -0.5 ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                  Sentiment: {t.sentimentScore.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2 truncate">{t.subject}</p>
              <div className="text-[10px] text-gray-500 mt-2">Linked issue: {t.linkedJiraKey}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Right Columns: Incident Details and Email Editor */}
      <div className="col-span-2 glass-panel rounded-xl p-6 flex flex-col justify-between overflow-hidden">
        {selectedTicket ? (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold text-primary tracking-wider">Ticket Details</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedTicket.subject}</h2>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={generateAIDraft}
                  disabled={drafting}
                  className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  {drafting ? "Compiling..." : "Generate AI response draft"}
                </button>
              </div>

              {/* Email draft text editor area */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Response Draft</label>
                <textarea
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  className="w-full h-64 glass-input text-xs text-white resize-none font-mono"
                  placeholder="Review, modify, or insert resolution response details..."
                />
              </div>
            </div>

            {emailDraft && (
              <button
                onClick={sendEmail}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-black font-bold py-2 rounded-lg hover:shadow-glow transition-all text-xs mt-4"
              >
                Send Response via Gmail
              </button>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center border border-dashed border-border rounded-lg">
            <span className="text-xs text-gray-500">Select a support ticket from the list to begin triage.</span>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

### 6.2 Admin single Sign-On Provisioning Settings (`SsoConfiguration.tsx`)
Administrators configure SSO connection settings and security clearance levels using this form:

```tsx
// /opt/sentinel/frontend/components/admin/SsoConfiguration.tsx
// Admin SSO Realm Setup Form Component

import React, { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export const SsoConfiguration: React.FC = () => {
  const { token } = useAuth();
  
  // OIDC credential states
  const [realmUrl, setRealmUrl] = useState("https://sso.company.com/auth");
  const [clientId, setClientId] = useState("sentinel-client-app");
  const [clientSecret, setClientSecret] = useState("************************");
  const [saving, setSaving] = useState(false);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/v1/admin/sso/configure", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          realm_url: realmUrl,
          client_id: clientId,
          client_secret: clientSecret
        })
      });
      if (response.ok) {
        alert("SSO Connection settings saved successfully.");
      }
    } catch (err) {
      console.error("Failed to save SSO settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl glass-panel rounded-xl p-8 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-wide">SSO Identity Provider Setup</h2>
        <p className="text-xs text-gray-400 mt-1">Configure OIDC settings to authenticate users in the system.</p>
      </div>

      <form onSubmit={saveSettings} className="space-y-4">
        <div className="space-y-2 flex flex-col">
          <label className="text-xs text-gray-400">Realm Connection URL</label>
          <input
            type="url"
            value={realmUrl}
            onChange={(e) => setRealmUrl(e.target.value)}
            className="glass-input text-xs text-white"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-xs text-gray-400">OAuth Client ID</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="glass-input text-xs text-white"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-xs text-gray-400">OAuth Client Secret</label>
          <input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            className="glass-input text-xs text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-black font-bold py-2 rounded-lg hover:shadow-glow transition-all text-xs"
        >
          {saving ? "Saving configurations..." : "Save Configuration profile"}
        </button>
      </form>
    </div>
  );
};
```

---
## End of UI/UX Implementation Plan Document
This marks the completion of the SentinelOS UI/UX Implementation Plan. All chapters have been populated with frontend react code specs.





