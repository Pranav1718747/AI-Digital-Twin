"use client";

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface WorkflowBuilderProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection | Edge) => void;
}

export default function WorkflowBuilder({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: WorkflowBuilderProps) {

  return (
    <div className="w-full h-full glass-panel overflow-hidden border border-white/10 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode="dark"
        fitView
      >
        <Controls className="bg-surface border-border backdrop-blur-md fill-white" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'input') return '#ec4899';
            if (n.type === 'output') return '#10b981';
            return '#6366f1';
          }}
          maskColor="rgba(0,0,0,0.5)"
          className="bg-black/40 border border-white/10"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="rgba(255,255,255,0.1)" />
      </ReactFlow>
    </div>
  );
}
