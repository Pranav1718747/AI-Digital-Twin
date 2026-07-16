"use client";

import { useEffect, useMemo, useRef } from "react";
import cytoscape from "cytoscape";

interface GraphExplorerProps {
  initialNodes?: cytoscape.ElementDefinition[];
  initialEdges?: cytoscape.ElementDefinition[];
}

const fallbackElements: cytoscape.ElementDefinition[] = [
  { data: { id: 'ceo', label: 'CEO', type: 'Employee' } },
  { data: { id: 'cto', label: 'CTO', type: 'Employee' } },
  { data: { id: 'eng-dept', label: 'Engineering', type: 'Department' } },
  { data: { id: 'project-a', label: 'Project Alpha', type: 'Project' } },
  { data: { id: 'dev-1', label: 'Senior Dev', type: 'Employee' } },
  { data: { source: 'cto', target: 'ceo', label: 'REPORTS_TO' } },
  { data: { source: 'cto', target: 'eng-dept', label: 'MANAGES' } },
  { data: { source: 'dev-1', target: 'cto', label: 'REPORTS_TO' } },
  { data: { source: 'dev-1', target: 'project-a', label: 'ASSIGNED_TO' } },
];

export default function GraphExplorer({ initialNodes = [], initialEdges = [] }: GraphExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elements = useMemo(
    () => initialNodes.length > 0 ? [...initialNodes, ...initialEdges] : fallbackElements,
    [initialEdges, initialNodes]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const _cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#6366f1',
            'label': 'data(label)',
            'color': '#ffffff',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 8,
            'font-size': '12px',
            'font-family': 'Inter, sans-serif',
            'width': 40,
            'height': 40,
            'border-width': 2,
            'border-color': 'rgba(255,255,255,0.2)'
          }
        },
        {
          selector: 'node[type="Department"]',
          style: { 'background-color': '#ec4899', 'shape': 'hexagon' }
        },
        {
          selector: 'node[type="Project"]',
          style: { 'background-color': '#10b981', 'shape': 'rectangle' }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': 'rgba(255,255,255,0.15)',
            'target-arrow-color': 'rgba(255,255,255,0.15)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '10px',
            'color': 'rgba(255,255,255,0.5)',
            'text-rotation': 'autorotate',
            'text-margin-y': -10
          }
        },
        {
          selector: ':selected',
          style: {
            'border-color': '#ffffff',
            'border-width': 4,
            'line-color': '#ffffff',
            'target-arrow-color': '#ffffff'
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: false, // Prevents async layout ticks from crashing after destroy()
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
      }
    });

    return () => {
      if (_cy) {
        _cy.removeAllListeners();
        _cy.destroy();
      }
    };
  }, [elements]);

  return (
    <div className="w-full h-full relative glass-panel overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-sm font-medium shadow-lg">
        Knowledge Graph Explorer
      </div>
      <div className="absolute bottom-4 left-4 z-10 flex gap-4 text-xs">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#6366f1]"></div>Employee</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ec4899]"></div>Department</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#10b981]"></div>Project</div>
      </div>
      <div ref={containerRef} className="w-full h-[600px]" />
    </div>
  );
}
