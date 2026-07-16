"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Heart, Search, RefreshCw, BarChart4, DollarSign, 
  Award, Briefcase, Plus, Sparkles, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, Users, ShieldAlert
} from "lucide-react";
import { api } from "@/lib/api";

interface HealthSector {
  id: string;
  name: string;
  manager: string;
  resource_budget: number; // EUR
  morale_index: number; // 0-100%
  tooling_allocation: number; // EUR
  process_complexity: number; // 1-10
}

interface ActionHistoryItem {
  id: string;
  timestamp: string;
  action: string; 
  sectorName: string;
  details: string;
}

export default function CompanyHealthSimulator() {
  // Baseline Health Sectors State
  const [sectors, setSectors] = useState<HealthSector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom modifiers
  const [targetHealthScore, setTargetHealthScore] = useState(85); // 85% health target baseline
  const [aiAutomationOffset, setAiAutomationOffset] = useState(0.0); // 0.0 to 1.0
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  
  // AI Insights State
  const [aiInsights, setAiInsights] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  // Custom Sector Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSectorName, setNewSectorName] = useState("");
  const [newManager, setNewManager] = useState("");
  const [newBudget, setNewBudget] = useState(45000);
  const [newMorale, setNewMorale] = useState(80);
  const [newComplexity, setNewComplexity] = useState(5);

  // Load baseline configurations
  useEffect(() => {
    setIsLoading(true);
    const baselineSectors: HealthSector[] = [
      { id: "sec-eng", name: "Engineering & QA Department", manager: "Sarah Connor", resource_budget: 120000, morale_index: 78, tooling_allocation: 12000, process_complexity: 7 },
      { id: "sec-sales", name: "Sales Operations & Commission", manager: "John Doe", resource_budget: 95000, morale_index: 82, tooling_allocation: 6000, process_complexity: 6 },
      { id: "sec-cs", name: "Customer Support & SLA Helpdesk", manager: "Charlie Davis", resource_budget: 40000, morale_index: 85, tooling_allocation: 4500, process_complexity: 4 },
      { id: "sec-mktg", name: "Marketing & Lead Gen Platforms", manager: "Grace Hopper", resource_budget: 65000, morale_index: 80, tooling_allocation: 8000, process_complexity: 5 },
      { id: "sec-hr", name: "HR, Recruitment & Culture", manager: "Ada Lovelace", resource_budget: 35000, morale_index: 88, tooling_allocation: 3000, process_complexity: 3 }
    ];
    setSectors(baselineSectors);
    setIsLoading(false);
  }, []);

  // Filter sectors
  const filteredSectors = useMemo(() => {
    return sectors.filter(s => {
      const matchQuery = `${s.name} ${s.manager}`.toLowerCase();
      return matchQuery.includes(searchQuery.toLowerCase());
    });
  }, [sectors, searchQuery]);

  // General Reset
  const handleResetSandbox = () => {
    setSectors(prev => prev.map(s => {
      if (s.id.startsWith("sandbox-sec")) return null;
      // Restore standard values
      if (s.id === "sec-eng") return { ...s, resource_budget: 120000, morale_index: 78, tooling_allocation: 12000, process_complexity: 7 };
      if (s.id === "sec-sales") return { ...s, resource_budget: 95000, morale_index: 82, tooling_allocation: 6000, process_complexity: 6 };
      if (s.id === "sec-cs") return { ...s, resource_budget: 40000, morale_index: 85, tooling_allocation: 4500, process_complexity: 4 };
      if (s.id === "sec-mktg") return { ...s, resource_budget: 65000, morale_index: 80, tooling_allocation: 8000, process_complexity: 5 };
      if (s.id === "sec-hr") return { ...s, resource_budget: 35000, morale_index: 88, tooling_allocation: 3000, process_complexity: 3 };
      return s;
    }).filter(Boolean) as HealthSector[]);
    setActionHistory([]);
    setTargetHealthScore(85);
    setAiAutomationOffset(0.0);
    setAiInsights("");
  };

  // Adjust Resource Budget
  const adjustBudget = (id: string, factor: number, label: string) => {
    setSectors(prev => prev.map(s => {
      if (s.id === id) {
        const originalVal = s.resource_budget;
        const newVal = Math.max(5000, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Budget Boosted" : "Budget Restricted",
            sectorName: s.name,
            details: `${label}: Department overall resource budget shifted from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...s, resource_budget: newVal };
      }
      return s;
    }));
  };

  // Adjust Morale Index
  const adjustMorale = (id: string, factor: number, label: string) => {
    setSectors(prev => prev.map(s => {
      if (s.id === id) {
        const originalVal = s.morale_index;
        const newVal = Math.max(10, Math.min(100, Math.round(originalVal * factor)));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Morale Shift Boosted" : "Morale Shift Dropped",
            sectorName: s.name,
            details: `${label}: Staff morale target index configured from ${originalVal}% to ${newVal}%.`
          },
          ...hist
        ]);

        return { ...s, morale_index: newVal };
      }
      return s;
    }));
  };

  // Adjust Tooling Allocation
  const adjustTooling = (id: string, factor: number, label: string) => {
    setSectors(prev => prev.map(s => {
      if (s.id === id) {
        const originalVal = s.tooling_allocation;
        const newVal = Math.max(500, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Tooling Upgrade" : "Tooling Reduction",
            sectorName: s.name,
            details: `${label}: Software/Hardware tooling budget adjusted from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...s, tooling_allocation: newVal };
      }
      return s;
    }));
  };

  // Adjust Process Complexity
  const adjustComplexity = (id: string, factor: number, label: string) => {
    setSectors(prev => prev.map(s => {
      if (s.id === id) {
        const originalVal = s.process_complexity;
        const newVal = Math.max(1, Math.min(10, Math.round(originalVal * factor)));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Complexity Risen" : "Complexity Reduced",
            sectorName: s.name,
            details: `${label}: Roadmap process complexity adjusted from ${originalVal}/10 to ${newVal}/10.`
          },
          ...hist
        ]);

        return { ...s, process_complexity: newVal };
      }
      return s;
    }));
  };

  // Target Health target adjustment
  const handleHealthGoalChange = (val: number) => {
    const original = targetHealthScore;
    setTargetHealthScore(val);
    if (Math.abs(val - original) >= 1) {
      setActionHistory(hist => [
        {
          id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date().toLocaleTimeString(),
          action: "Health Threshold Updated",
          sectorName: "Executive Ops",
          details: `Global company target Net Health Index configured at ${val}%.`
        } as any,
        ...hist
      ]);
    }
  };

  // Add custom department/sector
  const handleAddSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectorName.trim() || !newManager.trim()) return;

    const newS: HealthSector = {
      id: `sandbox-sec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newSectorName.trim(),
      manager: newManager.trim(),
      resource_budget: newBudget,
      morale_index: newMorale,
      tooling_allocation: Math.round(newBudget * 0.1),
      process_complexity: newComplexity
    };

    setSectors(prev => [...prev, newS]);
    setActionHistory(hist => [
      {
        id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "Sector Added",
        sectorName: newSectorName.trim(),
        details: `Simulated a new department setup with budget: €${newBudget.toLocaleString()}, Morale target: ${newMorale}%.`
      },
      ...hist
    ]);

    // Reset Form
    setNewSectorName("");
    setNewManager("");
    setNewBudget(45000);
    setNewMorale(80);
    setNewComplexity(5);
    setShowAddModal(false);
  };

  // Compile totals & calculations
  const stats = useMemo(() => {
    const originalSectors = [
      { budget: 120000, morale: 78, complexity: 7, tooling: 12000 },
      { budget: 95000, morale: 82, complexity: 6, tooling: 6000 },
      { budget: 40000, morale: 85, complexity: 4, tooling: 4500 },
      { budget: 65000, morale: 80, complexity: 5, tooling: 8000 },
      { budget: 35000, morale: 88, complexity: 3, tooling: 3000 }
    ];

    const baseBudgetSum = originalSectors.reduce((sum, s) => sum + s.budget, 0);
    
    // Average baseline morale
    const baseMorale = originalSectors.reduce((sum, s) => sum + s.morale, 0) / originalSectors.length;

    // Average baseline burnout risk
    const baseBurnout = originalSectors.reduce((sum, s) => {
      const risk = (s.complexity * 8) - (s.morale * 0.2) - (s.tooling / 1000);
      return sum + Math.max(10, Math.min(95, risk));
    }, 0) / originalSectors.length;

    // Baseline net Health
    const baseHealth = 82;

    // Simulated values
    const simulatedBudgetSum = sectors.reduce((sum, s) => sum + s.resource_budget, 0);
    const simulatedMorale = sectors.reduce((sum, s) => sum + s.morale_index, 0) / (sectors.length || 1);

    // Simulated average burnout calculation
    const simulatedBurnout = sectors.reduce((sum, s) => {
      // Burnout scales with complexity and drops with high morale & tooling
      const risk = (s.process_complexity * 8.5) - (s.morale_index * 0.25) - (s.tooling_allocation / 800) - (aiAutomationOffset * 8);
      return sum + Math.max(5, Math.min(95, risk));
    }, 0) / (sectors.length || 1);

    // Simulated Net Health calculation
    let finalHealth = 82;
    const moraleRatio = simulatedMorale / baseMorale;
    finalHealth += Math.round((moraleRatio - 1.0) * 40);

    const budgetRatio = simulatedBudgetSum / baseBudgetSum;
    if (budgetRatio < 0.8) finalHealth -= 15; // budget shortage penalty

    finalHealth = Math.max(10, Math.min(100, finalHealth));
    const healthDelta = finalHealth - baseHealth;

    return {
      baseBudgetSum,
      simulatedBudgetSum,
      baseMorale: Math.round(baseMorale),
      simulatedMorale: Math.round(simulatedMorale),
      baseBurnout: Math.round(baseBurnout),
      simulatedBurnout: Math.round(simulatedBurnout),
      baseHealth,
      simulatedHealth: finalHealth,
      delta: healthDelta,
      healthScore: finalHealth
    };
  }, [sectors, targetHealthScore, aiAutomationOffset]);

  // Compute 12-month timeline for net Health Score trend curve
  const timelineData = useMemo(() => {
    const timeline = [];
    const base = stats.baseHealth;
    const sim = stats.simulatedHealth;

    for (let m = 1; m <= 12; m++) {
      // Baseline seasonal health noise
      const baseNoise = Math.sin(m / 1.5) * 1.5;
      const baseVal = base + baseNoise;

      // Simulated health curve
      const adjustment = m <= 4 ? (sim - base) * (m / 4) : (sim - base);
      const simNoise = Math.cos(m / 2.2) * 1.1;
      const simVal = base + adjustment + simNoise;

      timeline.push({
        month: m,
        baseline: Math.round(baseVal),
        simulated: Math.round(simVal)
      });
    }
    return timeline;
  }, [stats]);

  // Render Bezier net Health Score chart
  const renderHealthChart = () => {
    const width = 500;
    const height = 240;

    const allVals = [
      ...timelineData.map(d => d.baseline),
      ...timelineData.map(d => d.simulated)
    ];
    const maxVal = Math.max(...allVals) + 6;
    const minVal = Math.min(...allVals) - 6;
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

  // Call OpenRouter API for Health consequence insights
  const generateAIHealthInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsError("");
    try {
      const payload = {
        initial_metrics: {
          total_employees: 18,
          total_revenue_arr: 5000000,
          total_opex_monthly: stats.baseBudgetSum,
          total_profit_monthly: stats.baseMorale,
          company_health_score: stats.baseHealth,
          employee_satisfaction: stats.baseMorale,
          customer_satisfaction: 82,
          risk_score: stats.baseBurnout,
          productivity: 82,
          delivery_speed: 82
        },
        simulated_metrics: {
          total_employees: 18,
          total_revenue_arr: 5000000,
          total_opex_monthly: stats.simulatedBudgetSum,
          total_profit_monthly: stats.simulatedMorale,
          company_health_score: stats.simulatedHealth,
          employee_satisfaction: stats.simulatedMorale,
          customer_satisfaction: 82,
          risk_score: stats.simulatedBurnout,
          productivity: 82,
          delivery_speed: 82
        }
      };

      const res = await api.post("/simulation/insights", payload);
      setAiInsights(res.data.insights || "");
    } catch (err: any) {
      console.error("Failed to generate AI Health insights.", err);
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
            <Heart className="text-indigo-400" size={24} /> Company Health Simulator Sandbox
          </h1>
          <p className="text-gray-400 text-sm">
            Tune department resource allocations, staff morale targets, tooling splits, and process complexity ratios. Model global Company Health indexes.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Add Sandbox Health Sector
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
        
        {/* Left Side: Department sectors (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text" placeholder="Search departments or leads..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="glass-panel py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="animate-spin text-indigo-400" size={32} />
              <span className="text-sm text-gray-400">Loading company health sectors...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSectors.map(s => {
                const sectorBurnout = Math.round((s.process_complexity * 8.5) - (s.morale_index * 0.25) - (s.tooling_allocation / 800));
                const isHighRisk = sectorBurnout > 65;
                return (
                  <div key={s.id} className="glass-panel p-5 border border-white/5 hover:border-indigo-500/30 transition-all">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Users size={14} className="text-indigo-400" /> {s.name}
                        </h3>
                        <span className="text-xs text-gray-400 block mt-0.5">
                          Department Head: <span className="text-gray-300 font-medium">{s.manager}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Est. Burnout Risk</span>
                        <span className={`text-sm font-bold block ${isHighRisk ? "text-red-400 animate-pulse" : "text-white"}`}>
                          {sectorBurnout}% Risk {isHighRisk && "⚠️"}
                        </span>
                      </div>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 border-t border-white/5 pt-4">
                      
                      {/* Resource Budget */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Budget Spend</span>
                        <span className="text-xs font-bold text-white block">€{s.resource_budget.toLocaleString()}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustBudget(s.id, 0.90, "Budget cut")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustBudget(s.id, 1.10, "Budget raise")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Morale Index */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Morale Score</span>
                        <span className="text-xs font-bold text-white block">{s.morale_index}% morale</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustMorale(s.id, 0.90, "Demoralization")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustMorale(s.id, 1.10, "Boost morale")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Tooling spend */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Tooling Split</span>
                        <span className="text-xs font-bold text-white block">€{s.tooling_allocation.toLocaleString()}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustTooling(s.id, 0.80, "Tooling reduction")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -20%
                          </button>
                          <button
                            onClick={() => adjustTooling(s.id, 1.20, "Tooling expansion")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +20%
                          </button>
                        </div>
                      </div>

                      {/* Complexity target */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Complexity</span>
                        <span className="text-xs font-bold text-white block">{s.process_complexity}/10</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustComplexity(s.id, 0.80, "Reduced complexity")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            Simplifies
                          </button>
                          <button
                            onClick={() => adjustComplexity(s.id, 1.25, "Increased complexity")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            Complicates
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
              Company Health Summary
            </h3>

            {/* Main monthly closed ARR metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Average Morale Score</span>
                <span className="text-lg font-bold text-white mt-1 block">{stats.simulatedMorale}% morale</span>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Burnout Risk Index</span>
                <span className={`text-lg font-bold mt-1 block ${stats.simulatedBurnout > 60 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                  {stats.simulatedBurnout}% risk
                </span>
              </div>
            </div>

            {/* Health Delta Counter */}
            <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Net Health Index Shift</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-2xl font-bold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {stats.delta >= 0 ? "+" : ""}{stats.delta.toLocaleString()}% index
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    stats.delta >= 0 ? "text-green-400 border-green-500/20 bg-green-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"
                  }`}>
                    {stats.delta >= 0 ? "IMPROVED" : "DEGRADED"}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-white/5 ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                <Zap size={22} />
              </div>
            </div>

            {/* health target slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Target net Health Threshold Goal</span>
                <span className="text-white font-semibold">{targetHealthScore}%</span>
              </div>
              <input 
                type="range" min="70" max="98" step="1" 
                value={targetHealthScore} onChange={e => handleHealthGoalChange(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-gray-500">
                Increasing targets changes requirements for department budgets, morale limits, and simplifies complexity levels.
              </p>
            </div>

            {/* Edge-to-Edge SVG lead Curve */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-2xs font-semibold text-gray-400 flex items-center gap-1">
                <Heart size={14} className="text-gray-500" /> 12-Month Net Health Score Forecast
              </span>
              <div className="w-full h-64 bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-center">
                {renderHealthChart()}
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#319795] rounded-full inline-block"></span> Baseline health</span>
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
              <span className="flex items-center gap-1.5"><Sparkles className="text-indigo-400" size={18} /> Strategic Health: Before vs. After</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-2xs">
              {/* Baseline */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-teal-400 block border-b border-white/5 pb-1 uppercase tracking-wider">Before (Baseline)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Average Morale:</span>
                    <span className="font-semibold text-white">{stats.baseMorale}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Burnout:</span>
                    <span className="font-semibold text-white">{stats.baseBurnout}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overall Health Score:</span>
                    <span className="font-semibold text-white">{stats.baseHealth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resource budgets:</span>
                    <span className="font-semibold text-white">€{stats.baseBudgetSum.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Simulated */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-indigo-400 block border-b border-white/5 pb-1 uppercase tracking-wider">After (Simulated)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Average Morale:</span>
                    <span className="font-semibold text-white">{stats.simulatedMorale}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Burnout:</span>
                    <span className={`font-semibold ${stats.simulatedBurnout > stats.baseBurnout ? "text-red-400" : "text-green-400"}`}>
                      {stats.simulatedBurnout}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overall Health Score:</span>
                    <span className={`font-semibold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {stats.simulatedHealth}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resource budgets:</span>
                    <span className="font-semibold text-white">€{stats.simulatedBudgetSum.toLocaleString()}</span>
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
                  onClick={generateAIHealthInsights}
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
                  Click the button above to generate a custom OpenRouter AI analysis of this specific department health scenario.
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
                      <span className="font-semibold text-indigo-400">{hist.action} – {hist.sectorName}</span>
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

      {/* SECTOR ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddSector}
            className="w-full max-w-md glass-panel p-6 space-y-4 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <Plus className="text-indigo-400" size={20} /> Add Sandbox Health Sector
            </h3>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Department / Health Sector Name</label>
              <input 
                type="text" required placeholder="e.g. Legal & Compliance, Procurement"
                value={newSectorName} onChange={e => setNewSectorName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Sector Lead Representative</label>
              <input 
                type="text" required placeholder="e.g. John Doe"
                value={newManager} onChange={e => setNewManager(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Resource budget allocation (€/mo)</label>
                <input 
                  type="number" min="1000" max="1000000" value={newBudget} onChange={e => setNewBudget(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Baseline morale index (%)</label>
                <input 
                  type="number" min="10" max="100" value={newMorale} onChange={e => setNewMorale(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Process complexity (1-10)</label>
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
                Add Sector
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
