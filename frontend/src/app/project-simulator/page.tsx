"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  FolderKanban, Search, RefreshCw, BarChart4, DollarSign, 
  Award, Briefcase, Plus, Sparkles, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, Layers, LayoutGrid
} from "lucide-react";
import { api } from "@/lib/api";

interface SimulatedProject {
  id: string;
  name: string;
  project_lead: string;
  complexity_level: number; // 1-10
  assigned_fte_count: number; 
  sprint_velocity_target: number; // story points
  tooling_budget: number; // EUR
}

interface ActionHistoryItem {
  id: string;
  timestamp: string;
  action: string; 
  projectName: string;
  details: string;
}

export default function ProjectSimulator() {
  // Baseline Projects State
  const [projects, setProjects] = useState<SimulatedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom modifiers
  const [sprintCycleWeeks, setSprintCycleWeeks] = useState(2); // 2 weeks sprint baseline
  const [aiAutomationOffset, setAiAutomationOffset] = useState(0.0); // 0.0 to 1.0
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  
  // AI Insights State
  const [aiInsights, setAiInsights] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  // Custom Project Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newLead, setNewLead] = useState("");
  const [newComplexity, setNewComplexity] = useState(5);
  const [newFte, setNewFte] = useState(3);
  const [newVelocity, setNewVelocity] = useState(30);

  // Load baseline projects configuration
  useEffect(() => {
    setIsLoading(true);
    const baselineProjects: SimulatedProject[] = [
      { id: "proj-infra", name: "Sentinel Core Infrastructure", project_lead: "Sarah Connor", complexity_level: 8, assigned_fte_count: 5, sprint_velocity_target: 45, tooling_budget: 8000 },
      { id: "proj-sop", name: "SOP Workflow Engine", project_lead: "John Doe", complexity_level: 6, assigned_fte_count: 4, sprint_velocity_target: 35, tooling_budget: 4000 },
      { id: "proj-graph", name: "Knowledge Graph Portal", project_lead: "Charlie Davis", complexity_level: 5, assigned_fte_count: 3, sprint_velocity_target: 28, tooling_budget: 3000 },
      { id: "proj-search", name: "Agent Semantic Search API", project_lead: "Grace Hopper", complexity_level: 7, assigned_fte_count: 3, sprint_velocity_target: 30, tooling_budget: 2500 },
      { id: "proj-sso", name: "Enterprise SSO Keycloak Integration", project_lead: "Ada Lovelace", complexity_level: 4, assigned_fte_count: 2, sprint_velocity_target: 20, tooling_budget: 1500 }
    ];
    setProjects(baselineProjects);
    setIsLoading(false);
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchQuery = `${p.name} ${p.project_lead}`.toLowerCase();
      return matchQuery.includes(searchQuery.toLowerCase());
    });
  }, [projects, searchQuery]);

  // General Reset
  const handleResetSandbox = () => {
    setProjects(prev => prev.map(p => {
      if (p.id.startsWith("sandbox-proj")) return null;
      // Restore standard values
      if (p.id === "proj-infra") return { ...p, complexity_level: 8, assigned_fte_count: 5, sprint_velocity_target: 45, tooling_budget: 8000 };
      if (p.id === "proj-sop") return { ...p, complexity_level: 6, assigned_fte_count: 4, sprint_velocity_target: 35, tooling_budget: 4000 };
      if (p.id === "proj-graph") return { ...p, complexity_level: 5, assigned_fte_count: 3, sprint_velocity_target: 28, tooling_budget: 3000 };
      if (p.id === "proj-search") return { ...p, complexity_level: 7, assigned_fte_count: 3, sprint_velocity_target: 30, tooling_budget: 2500 };
      if (p.id === "proj-sso") return { ...p, complexity_level: 4, assigned_fte_count: 2, sprint_velocity_target: 20, tooling_budget: 1500 };
      return p;
    }).filter(Boolean) as SimulatedProject[]);
    setActionHistory([]);
    setSprintCycleWeeks(2);
    setAiAutomationOffset(0.0);
    setAiInsights("");
  };

  // Adjust Headcount
  const adjustFTE = (id: string, factor: number, label: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const originalVal = p.assigned_fte_count;
        const newVal = Math.max(1, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Staff Allocated" : "Staff Reduced",
            projectName: p.name,
            details: `${label}: Resource headcount changed from ${originalVal} FTEs to ${newVal} FTEs (Shift: ${deltaVal >= 0 ? "+" : ""}${deltaVal}).`
          },
          ...hist
        ]);

        return { ...p, assigned_fte_count: newVal };
      }
      return p;
    }));
  };

  // Adjust Complexity
  const adjustComplexity = (id: string, factor: number, label: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const originalVal = p.complexity_level;
        const newVal = Math.max(1, Math.min(10, Math.round(originalVal * factor)));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Complexity Risen" : "Complexity Reduced",
            projectName: p.name,
            details: `${label}: Scope complexity level adjusted from ${originalVal}/10 to ${newVal}/10.`
          },
          ...hist
        ]);

        return { ...p, complexity_level: newVal };
      }
      return p;
    }));
  };

  // Adjust Tooling Budget
  const adjustTooling = (id: string, factor: number, label: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const originalVal = p.tooling_budget;
        const newVal = Math.max(500, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Tooling Expanded" : "Tooling Restructured",
            projectName: p.name,
            details: `${label}: Software/Hardware developer tooling budget changed from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...p, tooling_budget: newVal };
      }
      return p;
    }));
  };

  // Adjust Sprint Velocity Target
  const adjustVelocity = (id: string, factor: number, label: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const originalVal = p.sprint_velocity_target;
        const newVal = Math.max(5, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Target Raised" : "Target Lowered",
            projectName: p.name,
            details: `${label}: Sprint target velocity point capacity changed from ${originalVal} pts to ${newVal} pts.`
          },
          ...hist
        ]);

        return { ...p, sprint_velocity_target: newVal };
      }
      return p;
    }));
  };

  // Sprint Cycle Slider adjustment
  const handleSprintCycleChange = (val: number) => {
    const original = sprintCycleWeeks;
    setSprintCycleWeeks(val);
    if (Math.abs(val - original) >= 1) {
      setActionHistory(hist => [
        {
          id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date().toLocaleTimeString(),
          action: "Sprint cadence mutated",
          channelName: "Scrum Master",
          details: `In-flight sprint iteration loop cadence configured at ${val} weeks.`
        } as any,
        ...hist
      ]);
    }
  };

  // Add custom project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newLead.trim()) return;

    const newP: SimulatedProject = {
      id: `sandbox-proj-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newProjectName.trim(),
      project_lead: newLead.trim(),
      complexity_level: newComplexity,
      assigned_fte_count: newFte,
      sprint_velocity_target: newVelocity,
      tooling_budget: 3000
    };

    setProjects(prev => [...prev, newP]);
    setActionHistory(hist => [
      {
        id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "Project Registered",
        projectName: newProjectName.trim(),
        details: `Simulated a new project setup with assigned resources: ${newFte} FTEs, Complexity: ${newComplexity}/10.`
      },
      ...hist
    ]);

    // Reset Form
    setNewProjectName("");
    setNewLead("");
    setNewComplexity(5);
    setNewFte(3);
    setNewVelocity(30);
    setShowAddModal(false);
  };

  // Compile totals & calculations
  const stats = useMemo(() => {
    const originalProjects = [
      { fte: 5, complexity: 8, velocity: 45, tooling: 8000 },
      { fte: 4, complexity: 6, velocity: 35, tooling: 4000 },
      { fte: 3, complexity: 5, velocity: 28, tooling: 3000 },
      { fte: 3, complexity: 7, velocity: 30, tooling: 2500 },
      { fte: 2, complexity: 4, velocity: 20, tooling: 1500 }
    ];

    const baseFteSum = originalProjects.reduce((sum, p) => sum + p.fte, 0);
    const baseVelocitySum = originalProjects.reduce((sum, p) => sum + p.velocity, 0);
    
    // Average baseline bug density (bugs per story point target)
    const baseBugDensity = originalProjects.reduce((sum, p) => {
      const bugIndex = (p.complexity * 0.8) / (p.fte * 1.2);
      return sum + bugIndex;
    }, 0) / originalProjects.length;

    // Simulated values
    const simulatedFteSum = projects.reduce((sum, p) => sum + p.assigned_fte_count, 0);
    
    // Simulated Sprint velocity points completed
    let simulatedVelocitySum = projects.reduce((sum, p) => {
      // Sprint velocity points completed scales with staff allocation ratio, limited by complexity
      const fteRatio = p.assigned_fte_count / (p.id.startsWith("sandbox-") ? 3 : (originalProjects.find(op => op.velocity === p.sprint_velocity_target)?.fte || 3));
      const complexityFactor = 1.0 - (p.complexity_level * 0.04);
      return sum + (p.sprint_velocity_target * fteRatio * complexityFactor);
    }, 0);

    // AI Coding copilot boost
    const automationVelocityBoost = aiAutomationOffset * 50;
    simulatedVelocitySum = simulatedVelocitySum + automationVelocityBoost;

    // Simulated average bug density calculation
    const simulatedBugDensity = projects.reduce((sum, p) => {
      // Under-staffing or poor tooling budget increases bug count
      const staffShortage = Math.max(0.5, p.complexity_level / (p.assigned_fte_count * 1.5));
      const toolingShortage = Math.max(0.5, 4000 / p.tooling_budget);
      return sum + (staffShortage * toolingShortage * 0.15);
    }, 0) / (projects.length || 1);

    const velocityDelta = simulatedVelocitySum - baseVelocitySum;

    // Health Score %
    let healthScore = 85;
    healthScore += Math.round(velocityDelta * 0.5);
    if (simulatedBugDensity > 0.4) healthScore -= 20; // high bug penalty
    healthScore = Math.max(10, Math.min(100, healthScore));

    return {
      baseFteSum,
      simulatedFteSum,
      baseVelocitySum: Math.round(baseVelocitySum),
      simulatedVelocitySum: Math.round(simulatedVelocitySum),
      baseBugDensity: Number(baseBugDensity.toFixed(2)),
      simulatedBugDensity: Number(simulatedBugDensity.toFixed(2)),
      delta: Math.round(velocityDelta),
      healthScore
    };
  }, [projects, aiAutomationOffset]);

  // Compute 12-month timeline for sprint velocity trend curve
  const timelineData = useMemo(() => {
    const timeline = [];
    const base = stats.baseVelocitySum;
    const sim = stats.simulatedVelocitySum;

    for (let m = 1; m <= 12; m++) {
      // Baseline seasonal velocity noise
      const baseNoise = Math.sin(m / 1.5) * 6;
      const baseVal = base + baseNoise;

      // Simulated velocity curve
      const adjustment = m <= 4 ? (sim - base) * (m / 4) : (sim - base);
      const simNoise = Math.cos(m / 2.2) * 5;
      const simVal = base + adjustment + simNoise;

      timeline.push({
        month: m,
        baseline: Math.round(baseVal),
        simulated: Math.round(simVal)
      });
    }
    return timeline;
  }, [stats]);

  // Render Bezier sprint velocity chart
  const renderVelocityChart = () => {
    const width = 500;
    const height = 240;

    const allVals = [
      ...timelineData.map(d => d.baseline),
      ...timelineData.map(d => d.simulated)
    ];
    const maxVal = Math.max(...allVals) + 20;
    const minVal = Math.min(...allVals) - 20;
    const range = maxVal - minVal || 1;

    // Map exact coordinates
    const basePoints = timelineData.map((d, i) => {
      const x = (i / 11) * width;
      const y = height - ((d.baseline - minVal) / range) * (height - 50) - 25;
      return { x, y };
    });

    const simPoints = timelineData.map((d, i) => {
      const x = (i / 11) * width;
      const y = height - ((d.simulated - minVal) / range) * (height - 50) - 25;
      return { x, y };
    });

    // Bezier path generator
    const getBezierPath = (pts: { x: number; y: number }[]) => {
      if (pts.length === 0) return "";
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const curr = pts[i];
        const next = pts[i + 1];
        const cp1x = curr.x + (next.x - curr.x) / 3;
        const cp1y = curr.y;
        const cp2x = curr.x + 2 * (next.x - curr.x) / 3;
        const cp2y = next.y;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
      }
      return d;
    };

    const basePath = getBezierPath(basePoints);
    const simPath = getBezierPath(simPoints);

    const baseArea = `${basePath} L ${width} ${height} L 0 ${height} Z`;
    const simArea = `${simPath} L ${width} ${height} L 0 ${height} Z`;

    const deltaColor = stats.delta >= 0 ? "#48BB78" : "#E53E3E";

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="baseLineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#319795" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#319795" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="simLineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={deltaColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={deltaColor} stopOpacity="0.0" />
          </linearGradient>
          
          <filter id="glow-base" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#319795" floodOpacity="0.4" />
          </filter>
          <filter id="glow-sim" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={deltaColor} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Vertical grids */}
        {timelineData.map((d, i) => {
          const x = (i / 11) * width;
          return (
            <line
              key={`grid-${i}`}
              x1={x}
              y1={10}
              x2={x}
              y2={height - 10}
              stroke="rgba(255,255,255,0.03)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
          );
        })}

        {/* Horizontal gridlines */}
        <line x1="0" y1={height - 25} x2={width} y2={height - 25} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="0" y1="25" x2={width} y2="25" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* Areas */}
        <path d={baseArea} fill="url(#baseLineGrad)" />
        <path d={simArea} fill="url(#simLineGrad)" />

        {/* Curves */}
        <path d={basePath} fill="none" stroke="#319795" strokeWidth="2.5" filter="url(#glow-base)" opacity="0.6" />
        <path d={simPath} fill="none" stroke={deltaColor} strokeWidth="3" filter="url(#glow-sim)" />

        {/* Pointer dots */}
        {simPoints.map((p, i) => {
          const isLast = i === simPoints.length - 1;
          const isFirst = i === 0;
          if (!isLast && !isFirst && i % 2 !== 0) return null;
          
          return (
            <g key={`dot-${i}`}>
              {isLast && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="8"
                  fill={deltaColor}
                  className="animate-ping"
                  opacity="0.4"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isLast ? "5" : "3.5"}
                fill={deltaColor}
                stroke="#1A202C"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </svg>
    );
  };

  // Call OpenRouter API for Project consequence insights
  const generateAIProjectInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsError("");
    try {
      const payload = {
        initial_metrics: {
          total_employees: stats.baseFteSum,
          total_revenue_arr: 5000000,
          total_opex_monthly: 320000,
          total_profit_monthly: stats.baseVelocitySum,
          company_health_score: 85,
          employee_satisfaction: 80,
          customer_satisfaction: 82,
          risk_score: 15,
          productivity: 85,
          delivery_speed: 85
        },
        simulated_metrics: {
          total_employees: stats.simulatedFteSum,
          total_revenue_arr: 5000000 + (stats.delta * 20000),
          total_opex_monthly: 320000,
          total_profit_monthly: stats.simulatedVelocitySum,
          company_health_score: stats.healthScore,
          employee_satisfaction: Math.max(10, Math.min(100, Math.round(80 + stats.delta))),
          customer_satisfaction: Math.max(10, Math.min(100, Math.round(82 + (stats.delta * 0.8)))),
          risk_score: Math.max(5, Math.min(95, 15 - Math.round(stats.delta / 2))),
          productivity: 85,
          delivery_speed: 85
        }
      };

      const res = await api.post("/simulation/insights", payload);
      setAiInsights(res.data.insights || "");
    } catch (err: any) {
      console.error("Failed to generate AI Project insights.", err);
      setInsightsError("Could not retrieve AI analysis. Verify OpenRouter settings.");
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="text-indigo-400" size={24} /> Project Simulator Sandbox
          </h1>
          <p className="text-gray-400 text-sm">
            Allocate FTE headcounts, set complexity levels, and tweak sprint velocity targets. Model product delivery schedules in real-time.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Add Sandbox Project
          </button>
          <button 
            onClick={handleResetSandbox}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Reset Sandbox
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Projects spends (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text" placeholder="Search active simulated projects by roadmap name or manager..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="glass-panel py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="animate-spin text-indigo-400" size={32} />
              <span className="text-sm text-gray-400">Loading roadmap modules...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map(p => {
                return (
                  <div key={p.id} className="glass-panel p-5 border border-white/5 hover:border-indigo-500/30 transition-all">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Layers size={14} className="text-indigo-400" /> {p.name}
                        </h3>
                        <span className="text-xs text-gray-400 block mt-0.5">
                          Project Owner: <span className="text-gray-300 font-medium">{p.project_lead}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Assigned Resources</span>
                        <span className="text-sm font-bold text-white">{p.assigned_fte_count} FTEs</span>
                      </div>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 border-t border-white/5 pt-4">
                      
                      {/* Quota FTE */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Developers</span>
                        <span className="text-xs font-bold text-white block">{p.assigned_fte_count} Devs</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustFTE(p.id, 0.75, "Remove developer")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -1 Dev
                          </button>
                          <button
                            onClick={() => adjustFTE(p.id, 1.30, "Allocate developer")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +1 Dev
                          </button>
                        </div>
                      </div>

                      {/* Complexity */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Complexity</span>
                        <span className="text-xs font-bold text-white block">{p.complexity_level}/10</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustComplexity(p.id, 0.80, "Descoped complexity")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            Descopes
                          </button>
                          <button
                            onClick={() => adjustComplexity(p.id, 1.25, "Increased complexity")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            Scopes
                          </button>
                        </div>
                      </div>

                      {/* Tooling spend */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Tooling Budget</span>
                        <span className="text-xs font-bold text-white block">€{p.tooling_budget.toLocaleString()}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustTooling(p.id, 0.80, "Optimized licenses")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -20%
                          </button>
                          <button
                            onClick={() => adjustTooling(p.id, 1.20, "Tooling upgrades")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +20%
                          </button>
                        </div>
                      </div>

                      {/* Sprint Velocity Target */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Sprint Velocity Target</span>
                        <span className="text-xs font-bold text-white block">{p.sprint_velocity_target} pts</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustVelocity(p.id, 0.90, "Reduced sprint goal")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustVelocity(p.id, 1.10, "Increased sprint target")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Charts & Scores (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Summary counters */}
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">
              Delivery Performance Summary
            </h3>

            {/* Main monthly closed ARR metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Total Allocated Developers</span>
                <span className="text-lg font-bold text-white mt-1 block">{stats.simulatedFteSum} FTEs</span>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Avg Bug Density index</span>
                <span className={`text-lg font-bold mt-1 block ${stats.simulatedBugDensity > 0.35 ? "text-red-400" : "text-emerald-400"}`}>
                  {stats.simulatedBugDensity} / pt
                </span>
              </div>
            </div>

            {/* Leads Delta Counter */}
            <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Sprint Velocity Points Shift</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-2xl font-bold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {stats.delta >= 0 ? "+" : ""}{stats.delta.toLocaleString()} points
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    stats.delta >= 0 ? "text-green-400 border-green-500/20 bg-green-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"
                  }`}>
                    {stats.delta >= 0 ? "AHEAD" : "SLIPPING"}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-white/5 ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                <Zap size={22} />
              </div>
            </div>

            {/* quota target slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Sprint Iteration Cycle Duration</span>
                <span className="text-white font-semibold">{sprintCycleWeeks} weeks</span>
              </div>
              <input 
                type="range" min="1" max="4" step="1" 
                value={sprintCycleWeeks} onChange={e => handleSprintCycleChange(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-gray-500">
                Adjusting sprint duration loops alters story points commitments and feedback cycles.
              </p>
            </div>

            {/* Edge-to-Edge SVG lead Curve */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-2xs font-semibold text-gray-400 flex items-center gap-1">
                <FolderKanban size={14} className="text-gray-500" /> 12-Month Project Sprint Velocity Forecast
              </span>
              <div className="w-full h-64 bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-center">
                {renderVelocityChart()}
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#319795] rounded-full inline-block"></span> Baseline velocity</span>
                <span className="flex items-center gap-1">
                  <span className={`w-2.5 h-1 ${stats.delta >= 0 ? "bg-[#48BB78]" : "bg-[#E53E3E]"} rounded-full inline-block`}></span> 
                  Simulated Trend
                </span>
              </div>
            </div>

          </div>

          {/* Strategic Cost-Benefit Scorecard */}
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
              <span className="flex items-center gap-1.5"><Sparkles className="text-indigo-400" size={18} /> Strategic Delivery: Before vs. After</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-2xs">
              {/* Baseline */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-teal-400 block border-b border-white/5 pb-1 uppercase tracking-wider">Before (Baseline)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Total Developers:</span>
                    <span className="font-semibold text-white">{stats.baseFteSum} Devs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sprint Velocity target:</span>
                    <span className="font-semibold text-white">{stats.baseVelocitySum} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bug Density index:</span>
                    <span className="font-semibold text-white">{stats.baseBugDensity} / pt</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sprint Cycle:</span>
                    <span className="font-semibold text-white">2 weeks</span>
                  </div>
                </div>
              </div>

              {/* Simulated */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-indigo-400 block border-b border-white/5 pb-1 uppercase tracking-wider">After (Simulated)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Total Developers:</span>
                    <span className="font-semibold text-white">{stats.simulatedFteSum} Devs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sprint Velocity target:</span>
                    <span className={`font-semibold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {stats.simulatedVelocitySum} pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bug Density index:</span>
                    <span className={`font-semibold ${stats.simulatedBugDensity > stats.baseBugDensity ? "text-red-400" : "text-green-400"}`}>
                      {stats.simulatedBugDensity} / pt
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sprint Cycle:</span>
                    <span className="font-semibold text-white">{sprintCycleWeeks} weeks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights narrative */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xs text-gray-400 font-semibold flex items-center gap-1">
                  <Sparkles size={12} className="text-indigo-400" /> Executive AI Scenario Analysis
                </span>
                <button
                  onClick={generateAIProjectInsights}
                  disabled={isGeneratingInsights}
                  className="px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 disabled:bg-white/10 text-white text-[10px] font-semibold rounded shadow-md shadow-indigo-500/10 flex items-center gap-1 cursor-pointer transition-all"
                >
                  {isGeneratingInsights ? (
                    <>
                      <RefreshCw size={10} className="animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={10} /> Run AI Impact Analysis
                    </>
                  )}
                </button>
              </div>

              {isGeneratingInsights ? (
                <div className="p-4 bg-white/5 border border-white/5 rounded-lg animate-pulse space-y-2">
                  <div className="h-2.5 bg-white/10 rounded w-full"></div>
                  <div className="h-2.5 bg-white/10 rounded w-5/6"></div>
                  <div className="h-2.5 bg-white/10 rounded w-4/5"></div>
                </div>
              ) : aiInsights ? (
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-2xs text-gray-300 leading-relaxed whitespace-pre-line">
                  {aiInsights}
                </div>
              ) : (
                <div className="p-4 bg-white/5 border border-white/5 rounded-lg text-2xs text-gray-500 italic text-center">
                  Click the button above to generate a custom OpenRouter AI analysis of this specific project roadmap scenario.
                </div>
              )}

              {insightsError && (
                <span className="text-[10px] text-red-400 block mt-1">{insightsError}</span>
              )}
            </div>

          </div>

          {/* Sandbox Live History Log */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-indigo-400" /> Simulation Session Logs
              </h3>
              {actionHistory.length > 0 && (
                <button 
                  onClick={() => setActionHistory([])}
                  className="text-[10px] text-red-400 hover:text-red-300 font-semibold"
                >
                  Clear logs
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {actionHistory.length === 0 ? (
                <span className="text-gray-500 italic block text-center py-6 text-xs">
                  Sandbox session logs are currently empty.
                </span>
              ) : (
                actionHistory.map(hist => (
                  <div key={hist.id} className="p-3 bg-white/5 border border-white/5 rounded-lg text-2xs space-y-1">
                    <div className="flex justify-between items-center text-gray-500">
                      <span className="font-semibold text-indigo-400">{hist.action} – {hist.projectName}</span>
                      <span>{hist.timestamp}</span>
                    </div>
                    <p className="text-gray-300">{hist.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* PROJECT ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddProject}
            className="w-full max-w-md glass-panel p-6 space-y-4 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <Plus className="text-indigo-400" size={20} /> Add Sandbox Project
            </h3>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Project Module / Component Name</label>
              <input 
                type="text" required placeholder="e.g. Sentinel Auth Bypass Sandbox, Chat Logs"
                value={newProjectName} onChange={e => setNewProjectName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Project Tech Lead Owner</label>
              <input 
                type="text" required placeholder="e.g. John Doe"
                value={newLead} onChange={e => setNewLead(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Resource allocation (Devs)</label>
                <input 
                  type="number" min="1" max="100" value={newFte} onChange={e => setNewFte(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Sprint Velocity quota (points)</label>
                <input 
                  type="number" min="5" max="500" value={newVelocity} onChange={e => setNewVelocity(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Complexity target (1-10)</label>
              <input 
                type="number" min="1" max="10" value={newComplexity} onChange={e => setNewComplexity(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold rounded"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded"
              >
                Register Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
