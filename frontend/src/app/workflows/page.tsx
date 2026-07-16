"use client";

import dynamic from "next/dynamic";
import { Plus, Play, Save, Cpu, FileText, CheckSquare, LogOut, Info, Settings, X } from "lucide-react";
import { useState, useCallback } from "react";
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from '@xyflow/react';

// React Flow requires window, dynamically import
const WorkflowBuilder = dynamic(() => import("@/components/WorkflowBuilder"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] glass-panel flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Start Onboarding' }, type: 'input' },
  { id: '2', position: { x: 250, y: 150 }, data: { label: 'Provision IT Assets' } },
  { id: '3', position: { x: 100, y: 250 }, data: { label: 'Assign Jira Project' } },
  { id: '4', position: { x: 400, y: 250 }, data: { label: 'Setup Github Repo' } },
  { id: '5', position: { x: 250, y: 350 }, data: { label: 'Grant RAG Access' }, type: 'output' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true },
];

interface CustomAction {
  id: string;
  name: string;
  desc: string;
  nodeType: string; // 'input' | 'default' | 'output'
}

export default function WorkflowsPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom actions list state
  const [customActions, setCustomActions] = useState<CustomAction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActionName, setNewActionName] = useState("");
  const [newActionDesc, setNewActionDesc] = useState("");
  const [newActionNodeType, setNewActionNodeType] = useState("default");

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNewWorkflow = () => {
    setNodes([
      { id: '1', position: { x: 250, y: 50 }, data: { label: 'Start' }, type: 'input' },
    ]);
    setEdges([]);
    showToast("✨ Started a new workflow canvas!");
  };

  const handleSaveSOP = () => {
    showToast("💾 Standard Operating Procedure saved successfully!");
  };

  const handleSimulateRun = () => {
    if (isSimulating) return;
    
    // Find the input nodes (start nodes)
    const startNodes = nodes.filter(n => n.type === 'input');
    if (startNodes.length === 0) {
      showToast("⚠️ No start node found in workflow.");
      return;
    }

    setIsSimulating(true);
    showToast("▶️ Simulating workflow execution...");

    // Reset styles
    setNodes(nds => nds.map(n => ({ ...n, style: {} })));
    setEdges(eds => eds.map(e => ({ ...e, animated: false, style: {} })));

    // BFS Traversal to compute timeline
    const queue: string[] = startNodes.map(n => n.id);
    const timeline: { nodesToHighlight: string[], edgesToAnimate: string[] }[] = [];
    const visited = new Set<string>(queue);

    let currentLevel = [...queue];
    while (currentLevel.length > 0) {
      // 1. Highlight current level nodes
      timeline.push({
        nodesToHighlight: [...currentLevel],
        edgesToAnimate: []
      });

      const nextLevel: string[] = [];
      const levelEdges: string[] = [];

      for (const nodeId of currentLevel) {
        const outgoingEdges = edges.filter(e => e.source === nodeId);
        for (const edge of outgoingEdges) {
          levelEdges.push(edge.id);
          if (!visited.has(edge.target)) {
            visited.add(edge.target);
            nextLevel.push(edge.target);
          }
        }
      }

      // 2. Animate edges flowing to next level
      if (levelEdges.length > 0) {
        timeline.push({
          nodesToHighlight: [],
          edgesToAnimate: [...levelEdges]
        });
      }

      currentLevel = nextLevel;
    }

    // Run the timeline step-by-step
    let step = 0;
    const runNextStep = () => {
      if (step >= timeline.length) {
        setIsSimulating(false);
        showToast("✅ Simulation completed!");
        // Keep final glow for a moment then reset
        setTimeout(() => {
          setNodes(nds => nds.map(n => ({ ...n, style: { transition: 'all 0.5s ease' } })));
          setEdges(eds => eds.map(e => ({ ...e, animated: false, style: { transition: 'all 0.5s ease' } })));
        }, 1500);
        return;
      }

      const { nodesToHighlight, edgesToAnimate } = timeline[step];

      if (nodesToHighlight.length > 0) {
        setNodes(nds => 
          nds.map(n => {
            const isHighlighted = nodesToHighlight.includes(n.id);
            return isHighlighted ? {
              ...n,
              style: {
                boxShadow: '0 0 25px rgba(99, 102, 241, 0.8), 0 0 50px rgba(236,72,153,0.5)',
                borderColor: '#ec4899',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.2) 100%)',
                transition: 'all 0.4s ease'
              }
            } : {
              ...n,
              style: {
                ...n.style,
                opacity: 0.6, // Dim non-active nodes slightly for contrast
                transition: 'all 0.4s ease'
              }
            };
          })
        );
      }

      if (edgesToAnimate.length > 0) {
        setEdges(eds => 
          eds.map(e => {
            const isAnimating = edgesToAnimate.includes(e.id);
            return isAnimating ? {
              ...e,
              animated: true,
              style: {
                stroke: '#ec4899',
                strokeWidth: 3.5,
                transition: 'all 0.4s ease'
              }
            } : e;
          })
        );
      }

      step++;
      setTimeout(runNextStep, 950); // Slightly slower for better readability
    };

    runNextStep();
  };

  const addCustomNode = (label: string, type: string) => {
    // Generate a unique ID
    const newId = (nodes.length > 0 ? Math.max(...nodes.map(n => parseInt(n.id) || 0)) + 1 : 1).toString();
    
    // Find the bottom-most node to position the new node below it
    let maxY = 0;
    nodes.forEach(n => {
      if (n.position.y > maxY) {
        maxY = n.position.y;
      }
    });

    // Default position if no nodes exist, otherwise 100px below the lowest node
    const position = {
      x: 250 + (Math.random() - 0.5) * 60, // slightly offset horizontally
      y: nodes.length === 0 ? 50 : maxY + 100,
    };
    
    const newNode = {
      id: newId,
      position,
      data: { label },
      type,
    };
    
    setNodes((nds) => [...nds, newNode]);
    showToast(`Added: "${label}" to canvas`);
  };

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionName.trim()) {
      showToast("⚠️ Action title cannot be empty!");
      return;
    }

    const newAction: CustomAction = {
      id: Date.now().toString(),
      name: newActionName,
      desc: newActionDesc || "User-defined custom step",
      nodeType: newActionNodeType,
    };

    setCustomActions(prev => [...prev, newAction]);
    setShowAddForm(false);
    setNewActionName("");
    setNewActionDesc("");
    setNewActionNodeType("default");
    showToast(`🎨 Custom action template "${newAction.name}" created!`);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 relative">
      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-black/80 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(236,72,153,0.3)] animate-in fade-in slide-in-from-top-4">
          {toastMessage}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">SOP Workflows</h1>
          <p className="text-gray-400 text-sm">Design and deploy agentic Standard Operating Procedures.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSimulateRun}
            disabled={isSimulating}
            className={`flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors text-sm font-medium rounded-lg border border-indigo-500/30 ${isSimulating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Play size={16} />
            {isSimulating ? 'Running...' : 'Simulate Run'}
          </button>
          <button 
            onClick={handleSaveSOP}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 transition-colors text-sm font-medium rounded-lg border border-pink-500/30"
          >
            <Save size={16} />
            Save SOP
          </button>
          <button 
            onClick={handleNewWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors text-sm font-medium rounded-lg shadow-lg shadow-white/10"
          >
            <Plus size={16} />
            New Workflow
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left-hand Node Palette */}
        <div className="w-80 glass-panel p-4 flex flex-col gap-4 border border-white/10 overflow-y-auto">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">SOP Actions Palette</h3>
            <p className="text-xs text-gray-400">Click any action to place a new node on the workflow canvas.</p>
          </div>

          <div className="flex flex-col gap-2">
            {/* Default Nodes */}
            <button 
              onClick={() => addCustomNode("AI Process Node", "default")}
              className="flex items-center gap-3 w-full p-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-300 text-xs font-semibold transition-all text-left group"
            >
              <Cpu size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <div>
                <div>AI Reasoning Step</div>
                <div className="text-[10px] text-gray-400 font-normal">Runs LLM semantic parsing</div>
              </div>
            </button>

            <button 
              onClick={() => addCustomNode("DB Action", "default")}
              className="flex items-center gap-3 w-full p-3 rounded-lg border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 text-pink-300 text-xs font-semibold transition-all text-left group"
            >
              <FileText size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
              <div>
                <div>Data Update Step</div>
                <div className="text-[10px] text-gray-400 font-normal">Reads/Writes SQL or Graph DB</div>
              </div>
            </button>

            <button 
              onClick={() => addCustomNode("Human Validation", "input")}
              className="flex items-center gap-3 w-full p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 text-xs font-semibold transition-all text-left group"
            >
              <CheckSquare size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
              <div>
                <div>Human Approval Gate</div>
                <div className="text-[10px] text-gray-400 font-normal">Requires human sign-off</div>
              </div>
            </button>

            <button 
              onClick={() => addCustomNode("Exit Flow", "output")}
              className="flex items-center gap-3 w-full p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300 text-xs font-semibold transition-all text-left group"
            >
              <LogOut size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <div>
                <div>End / Exit Action</div>
                <div className="text-[10px] text-gray-400 font-normal">Finalizes standard operating procedure</div>
              </div>
            </button>

            {/* Custom User-Added Actions */}
            {customActions.map((action) => (
              <button
                key={action.id}
                onClick={() => addCustomNode(action.name, action.nodeType)}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 text-violet-300 text-xs font-semibold transition-all text-left group animate-in fade-in zoom-in-95 duration-200"
              >
                <Settings size={18} className="text-violet-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{action.name}</div>
                  <div className="text-[10px] text-gray-400 font-normal truncate">{action.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Action Template Creator */}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all"
              >
                <Plus size={14} />
                Create Action Template
              </button>
            ) : (
              <form onSubmit={handleCreateAction} className="bg-black/40 p-3 rounded-lg border border-white/10 flex flex-col gap-3 animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">New Template</span>
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-medium">Action Name</label>
                  <input
                    type="text"
                    value={newActionName}
                    onChange={(e) => setNewActionName(e.target.value)}
                    placeholder="e.g. Slack Notify"
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500/60"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-medium">Description</label>
                  <input
                    type="text"
                    value={newActionDesc}
                    onChange={(e) => setNewActionDesc(e.target.value)}
                    placeholder="e.g. Send webhook payload"
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500/60"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-medium">Node Role</label>
                  <select
                    value={newActionNodeType}
                    onChange={(e) => setNewActionNodeType(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500/60"
                  >
                    <option value="input">Input (Source Only)</option>
                    <option value="default">Process (Source & Target)</option>
                    <option value="output">Output (Target Only)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-xs font-medium transition-all"
                >
                  Create Template
                </button>
              </form>
            )}
          </div>

          <div className="mt-auto p-3 bg-white/5 border border-white/5 rounded-lg flex gap-2 items-start text-[10px] text-gray-400">
            <Info size={14} className="shrink-0 text-gray-400 mt-0.5" />
            <div>
              <strong>Custom Action Guides:</strong> Once created, your custom templates will act just like pre-packaged nodes. Click them to place them anywhere!
            </div>
          </div>
        </div>

        {/* Right-hand Workspace Canvas */}
        <div className="flex-1 rounded-xl overflow-hidden relative shadow-[0_0_30px_rgba(236,72,153,0.1)] border border-white/10">
          <WorkflowBuilder 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          />
        </div>
      </div>
    </div>
  );
}
