"use client";

import { useEffect, useMemo, useRef } from "react";
import cytoscape from "cytoscape";
import { SimulatedEmployee } from "@/lib/simulationEngine";

interface SimulatedGraphExplorerProps {
  employees: SimulatedEmployee[];
}

export default function SimulatedGraphExplorer({ employees }: SimulatedGraphExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Compile cytoscape elements dynamically based on simulated state changes
  const elements = useMemo(() => {
    const elms: cytoscape.ElementDefinition[] = [];
    const addedNodeIds = new Set<string>();

    const addNode = (node: cytoscape.ElementDefinition) => {
      if (node.data.id) {
        elms.push(node);
        addedNodeIds.add(node.data.id);
      }
    };

    // Add static department nodes (for fallback/known links)
    const staticDepts = [
      { id: 'eng_dept', label: 'Engineering', type: 'Department' },
      { id: 'prod_dept', label: 'Product Management', type: 'Department' },
      { id: 'sales_dept', label: 'Sales & Success', type: 'Department' },
      { id: 'hr_dept', label: 'Human Resources', type: 'Department' }
    ];
    staticDepts.forEach(d => addNode({ data: d }));

    // Map active/terminated employees
    employees.forEach(emp => {
      const isNew = emp.id.startsWith("sandbox-hire");
      const isTerminated = emp.status === "Terminated";
      let nodeLabel = `${emp.first_name} ${emp.last_name}`;
      
      if (isNew) nodeLabel += " [NEW]";
      if (isTerminated) nodeLabel += " [TERM]";

      addNode({
        data: {
          id: emp.id,
          label: nodeLabel,
          type: 'Employee',
          status: emp.status,
          isNew: isNew ? "true" : "false"
        }
      });
    });

    // Add edges with strict safety guards
    employees.forEach(emp => {
      const isTerminated = emp.status === "Terminated";
      if (isTerminated) return;

      // 1. Manager reporting edge
      if (emp.manager_id) {
        if (addedNodeIds.has(emp.id) && addedNodeIds.has(emp.manager_id)) {
          elms.push({
            data: {
              id: `rel-mgr-${emp.id}-${emp.manager_id}`,
              source: emp.id,
              target: emp.manager_id,
              label: 'REPORTS_TO'
            }
          });
        }
      }

      // 2. Department membership edge
      if (emp.department_id) {
        // If department_id is a UUID and doesn't exist in nodes, create it dynamically first
        if (!addedNodeIds.has(emp.department_id)) {
          // Derive a generic label if possible or use 'Department'
          let deptLabel = "Department";
          if (emp.role_title.toLowerCase().includes("engineer") || emp.role_title.toLowerCase().includes("developer")) {
            deptLabel = "Engineering";
          } else if (emp.role_title.toLowerCase().includes("support") || emp.role_title.toLowerCase().includes("success")) {
            deptLabel = "Sales & Success";
          } else if (emp.role_title.toLowerCase().includes("product") || emp.role_title.toLowerCase().includes("manager")) {
            deptLabel = "Product Management";
          } else if (emp.role_title.toLowerCase().includes("hr") || emp.role_title.toLowerCase().includes("recruiter")) {
            deptLabel = "Human Resources";
          }

          addNode({
            data: {
              id: emp.department_id,
              label: deptLabel,
              type: 'Department'
            }
          });
        }

        if (addedNodeIds.has(emp.id) && addedNodeIds.has(emp.department_id)) {
          elms.push({
            data: {
              id: `rel-dept-${emp.id}-${emp.department_id}`,
              source: emp.id,
              target: emp.department_id,
              label: 'BELONGS_TO'
            }
          });
        }
      }
    });

    return elms;
  }, [employees]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
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
            'text-margin-y': 6,
            'font-size': '10px',
            'font-family': 'Inter, sans-serif',
            'width': 28,
            'height': 28,
            'border-width': 1.5,
            'border-color': 'rgba(255,255,255,0.2)'
          }
        },
        {
          selector: 'node[type="Department"]',
          style: {
            'background-color': '#ec4899',
            'shape': 'hexagon',
            'width': 38,
            'height': 38
          }
        },
        {
          selector: 'node[status="Terminated"]',
          style: {
            'background-color': '#ef4444',
            'border-color': '#b91c1c',
            'opacity': 0.4,
            'line-style': 'dashed'
          }
        },
        {
          selector: 'node[isNew="true"]',
          style: {
            'background-color': '#10b981',
            'border-color': '#059669',
            'border-width': 3
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': 'rgba(255,255,255,0.1)',
            'target-arrow-color': 'rgba(255,255,255,0.1)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '8px',
            'color': 'rgba(255,255,255,0.35)',
            'text-rotation': 'autorotate'
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: false,
        idealEdgeLength: 80,
        nodeOverlap: 20,
        fit: true,
        padding: 20
      }
    });

    return () => {
      if (cy) {
        cy.removeAllListeners();
        cy.destroy();
      }
    };
  }, [elements]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-white/5 border border-white/5 rounded-lg">
      <div className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-md px-3 py-1 rounded border border-white/5 text-xs font-semibold text-gray-300">
        Simulated Organizational Topology
      </div>
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-3 text-[10px] text-gray-400">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#6366f1]"></div>Employee</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>New Hire</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-50"></div>Terminated</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-[#ec4899]"></div>Department</div>
      </div>
      <div ref={containerRef} className="w-full h-[320px]" />
    </div>
  );
}
