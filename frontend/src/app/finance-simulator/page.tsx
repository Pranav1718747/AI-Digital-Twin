"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  TrendingUp, Search, RefreshCw, BarChart4, DollarSign, 
  Award, Briefcase, Plus, Sparkles, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, Database, Settings
} from "lucide-react";
import { api } from "@/lib/api";

interface SimulatedDepartment {
  id: string;
  name: string;
  manager: string;
  opex_budget: number; // overall personnel/operations
  software_spend: number;
  hardware_spend: number;
  training_spend: number;
}

interface ActionHistoryItem {
  id: string;
  timestamp: string;
  action: string; 
  deptName: string;
  details: string;
}

export default function FinanceSimulator() {
  // Baseline Departments State
  const [departments, setDepartments] = useState<SimulatedDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom modifiers
  const [cloudHostingSpend, setCloudHostingSpend] = useState(45000); // monthly baseline cloud cost
  const [aiAutomationOffset, setAiAutomationOffset] = useState(0.0); // 0.0 to 1.0
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  
  // AI Insights State
  const [aiInsights, setAiInsights] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  // Custom Department Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newManager, setNewManager] = useState("");
  const [newBudget, setNewBudget] = useState(80000);
  const [newSoftware, setNewSoftware] = useState(15000);
  const [newTraining, setNewTraining] = useState(5000);

  // Load baseline financial structure
  useEffect(() => {
    setIsLoading(true);
    // Mimic real department seeding
    const baselineDepts: SimulatedDepartment[] = [
      { id: "dept-eng", name: "Engineering & R&D", manager: "Sarah Connor", opex_budget: 150000, software_spend: 35000, hardware_spend: 18000, training_spend: 8000 },
      { id: "dept-prod", name: "Product Development", manager: "John Doe", opex_budget: 65000, software_spend: 15000, hardware_spend: 5000, training_spend: 4000 },
      { id: "dept-sales", name: "Sales & Client Success", manager: "Charlie Davis", opex_budget: 110000, software_spend: 25000, hardware_spend: 7000, training_spend: 6000 },
      { id: "dept-hr", name: "People Operations (HR)", manager: "Grace Hopper", opex_budget: 45000, software_spend: 8000, hardware_spend: 3000, training_spend: 5000 },
      { id: "dept-mktg", name: "Growth & Marketing", manager: "Ada Lovelace", opex_budget: 95000, software_spend: 20000, hardware_spend: 4000, training_spend: 3000 }
    ];
    setDepartments(baselineDepts);
    setIsLoading(false);
  }, []);

  // Filter departments by name or manager
  const filteredDepts = useMemo(() => {
    return departments.filter(d => {
      const matchQuery = `${d.name} ${d.manager}`.toLowerCase();
      return matchQuery.includes(searchQuery.toLowerCase());
    });
  }, [departments, searchQuery]);

  // General Reset
  const handleResetSandbox = () => {
    setDepartments(prev => prev.map(d => {
      if (d.id.startsWith("sandbox-dept")) return null;
      // Restore standard values
      if (d.id === "dept-eng") return { ...d, opex_budget: 150000, software_spend: 35000, training_spend: 8000 };
      if (d.id === "dept-prod") return { ...d, opex_budget: 65000, software_spend: 15000, training_spend: 4000 };
      if (d.id === "dept-sales") return { ...d, opex_budget: 110000, software_spend: 25000, training_spend: 6000 };
      if (d.id === "dept-hr") return { ...d, opex_budget: 45000, software_spend: 8000, training_spend: 5000 };
      if (d.id === "dept-mktg") return { ...d, opex_budget: 95000, software_spend: 20000, training_spend: 3000 };
      return d;
    }).filter(Boolean) as SimulatedDepartment[]);
    setActionHistory([]);
    setCloudHostingSpend(45000);
    setAiAutomationOffset(0.0);
    setAiInsights("");
  };

  // Budget modification handlers
  const adjustBudget = (id: string, factor: number, label: string) => {
    setDepartments(prev => prev.map(d => {
      if (d.id === id) {
        const originalVal = d.opex_budget;
        const newVal = Math.max(10000, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Budget Increased" : "Budget Cut",
            deptName: d.name,
            details: `${label}: Overall budget adjusted from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...d, opex_budget: newVal };
      }
      return d;
    }));
  };

  // Software spending modifications
  const adjustSoftware = (id: string, factor: number, label: string) => {
    setDepartments(prev => prev.map(d => {
      if (d.id === id) {
        const originalVal = d.software_spend;
        const newVal = Math.max(1000, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "SaaS Spend Raised" : "SaaS Spend Cut",
            deptName: d.name,
            details: `${label}: Software subscription tools spend changed from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...d, software_spend: newVal };
      }
      return d;
    }));
  };

  // Training spend modifications
  const adjustTraining = (id: string, factor: number, label: string) => {
    setDepartments(prev => prev.map(d => {
      if (d.id === id) {
        const originalVal = d.training_spend;
        const newVal = Math.max(500, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Training Increased" : "Training Reduced",
            deptName: d.name,
            details: `${label}: Professional development resources spend changed from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...d, training_spend: newVal };
      }
      return d;
    }));
  };

  // Infrastructure slider adjustment
  const handleCloudHostingChange = (val: number) => {
    const original = cloudHostingSpend;
    setCloudHostingSpend(val);
    if (Math.abs(val - original) > 2000) {
      setActionHistory(hist => [
        {
          id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date().toLocaleTimeString(),
          action: val < original ? "Infrastructure Optimized" : "Hosting Scaled Up",
          deptName: "Operations",
          details: `Monthly cloud hosting infrastructure budget set to €${val.toLocaleString()} (Previous: €${original.toLocaleString()}).`
        },
        ...hist
      ]);
    }
  };

  // Add custom department
  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newManager.trim()) return;

    const newD: SimulatedDepartment = {
      id: `sandbox-dept-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newDeptName.trim(),
      manager: newManager.trim(),
      opex_budget: newBudget,
      software_spend: newSoftware,
      hardware_spend: Math.round(newSoftware * 0.3),
      training_spend: newTraining
    };

    setDepartments(prev => [...prev, newD]);
    setActionHistory(hist => [
      {
        id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "Department Added",
        deptName: newDeptName.trim(),
        details: `Simulated a new department setup with initial OpEx: €${newBudget.toLocaleString()}, Software: €${newSoftware.toLocaleString()}.`
      },
      ...hist
    ]);

    // Reset Form
    setNewDeptName("");
    setNewManager("");
    setNewBudget(80000);
    setNewSoftware(15000);
    setNewTraining(5000);
    setShowAddModal(false);
  };

  // Compile totals & calculations
  const stats = useMemo(() => {
    const originalDepts = [
      { opex: 150000, soft: 35000, train: 8000 },
      { opex: 65000, soft: 15000, train: 4000 },
      { opex: 110000, soft: 25000, train: 6000 },
      { opex: 45000, soft: 8000, train: 5000 },
      { opex: 95000, soft: 20000, train: 3000 }
    ];

    const baseOpexSum = originalDepts.reduce((sum, d) => sum + d.opex + d.soft + d.train, 0) + 45000; // base cloud
    const baseARR = 5000000;
    const baseMonthlyARR = baseARR / 12;

    // Simulated OpEx Sum
    const activeOpexSum = departments.reduce((sum, d) => sum + d.opex_budget + d.software_spend + d.training_spend, 0) + cloudHostingSpend;

    // Calculate simulated ARR impact based on budget cuts/raises
    // Growth/Pipeline details: Marketing (dept-mktg) and Sales (dept-sales) budgets directly change sales pipeline ARR
    const salesBase = 110000;
    const salesCurrent = departments.find(d => d.id === "dept-sales")?.opex_budget || salesBase;
    const mktgBase = 95000;
    const mktgCurrent = departments.find(d => d.id === "dept-mktg")?.opex_budget || mktgBase;

    const salesRatio = salesCurrent / salesBase;
    const mktgRatio = mktgCurrent / mktgBase;

    // Customer satisfaction/quality details: R&D (dept-eng) budget cuts decrease delivery speed, which triggers client churn
    const engBase = 150000;
    const engCurrent = departments.find(d => d.id === "dept-eng")?.opex_budget || engBase;
    const engRatio = engCurrent / engBase;

    // AI Automation mitigates productivity drops from budget cuts
    const automationRevenueBoost = aiAutomationOffset * 75000;

    // Forecasted Annual ARR
    let simulatedARR = baseARR;
    
    // Revenue multiplier updates
    const pipelineMultiplier = (salesRatio * 0.6) + (mktgRatio * 0.4);
    const churnMultiplier = engRatio < 1.0 ? 1.0 - (1.0 - engRatio) * 0.35 : 1.0 + (engRatio - 1.0) * 0.15;
    
    simulatedARR = Math.round(baseARR * pipelineMultiplier * churnMultiplier + automationRevenueBoost);
    const simulatedMonthlyARR = simulatedARR / 12;

    // Profit totals
    const baseMonthlyProfit = baseMonthlyARR - baseOpexSum;
    const simulatedMonthlyProfit = simulatedMonthlyARR - activeOpexSum;
    const monthlyProfitDelta = simulatedMonthlyProfit - baseMonthlyProfit;

    // Health Score %
    let healthScore = 85;
    healthScore += Math.round(monthlyProfitDelta / 15000);
    if (activeOpexSum > baseMonthlyARR) healthScore -= 20; // deficit warning
    healthScore = Math.max(10, Math.min(100, healthScore));

    return {
      baseOpexMonthly: Math.round(baseOpexSum),
      simulatedOpexMonthly: Math.round(activeOpexSum),
      baseMonthlyARR: Math.round(baseMonthlyARR),
      simulatedMonthlyARR: Math.round(simulatedMonthlyARR),
      baseARR,
      simulatedARR,
      baseMonthlyProfit: Math.round(baseMonthlyProfit),
      simulatedMonthlyProfit: Math.round(simulatedMonthlyProfit),
      delta: Math.round(monthlyProfitDelta),
      healthScore
    };
  }, [departments, cloudHostingSpend, aiAutomationOffset]);

  // Compute 12-month timeline for plotting profit lines
  const timelineData = useMemo(() => {
    const timeline = [];
    const base = stats.baseMonthlyProfit;
    const sim = stats.simulatedMonthlyProfit;

    for (let m = 1; m <= 12; m++) {
      // Baseline net profit trend line (adds mild sinusoidal season noise)
      const baseNoise = Math.sin(m / 2) * 5000;
      const baseVal = base + baseNoise;

      // Simulated net profit trend line
      const adjustment = m <= 4 ? (sim - base) * (m / 4) : (sim - base);
      const simNoise = Math.cos(m / 3) * 4000;
      const simVal = base + adjustment + simNoise;

      timeline.push({
        month: m,
        baseline: Math.round(baseVal),
        simulated: Math.round(simVal)
      });
    }
    return timeline;
  }, [stats]);

  // Render SVG Profit chart edge-to-edge Bezier layout
  const renderProfitChart = () => {
    const width = 500;
    const height = 240;

    const allVals = [
      ...timelineData.map(d => d.baseline),
      ...timelineData.map(d => d.simulated)
    ];
    const maxVal = Math.max(...allVals) + 15000;
    const minVal = Math.min(...allVals) - 15000;
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

  // Call OpenRouter API for Financial Consequence insights
  const generateAIFinanceInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsError("");
    try {
      const payload = {
        initial_metrics: {
          total_employees: 18,
          total_revenue_arr: stats.baseARR,
          total_opex_monthly: stats.baseOpexMonthly,
          total_profit_monthly: stats.baseMonthlyProfit,
          company_health_score: 85,
          employee_satisfaction: 80,
          customer_satisfaction: 82,
          risk_score: 12,
          productivity: 85,
          delivery_speed: 85
        },
        simulated_metrics: {
          total_employees: 18,
          total_revenue_arr: stats.simulatedARR,
          total_opex_monthly: stats.simulatedOpexMonthly,
          total_profit_monthly: stats.simulatedMonthlyProfit,
          company_health_score: stats.healthScore,
          employee_satisfaction: Math.max(10, Math.min(100, Math.round(80 + (stats.delta / 12000)))),
          customer_satisfaction: Math.max(10, Math.min(100, Math.round(82 + (stats.delta / 15000)))),
          risk_score: Math.max(5, Math.min(95, 12 - Math.round(stats.delta / 20000))),
          productivity: 85,
          delivery_speed: 85
        }
      };

      const res = await api.post("/simulation/insights", payload);
      setAiInsights(res.data.insights || "");
    } catch (err: any) {
      console.error("Failed to generate AI Finance insights.", err);
      setInsightsError("Could not retrieve AI analysis. Verify OpenRouter keys.");
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
            <TrendingUp className="text-emerald-400" size={24} /> Finance Simulator Sandbox
          </h1>
          <p className="text-gray-400 text-sm">
            Tweak department budgets, Software/SaaS spends, and cloud resources. Model cascading profit forecasting in real-time.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Add Sandbox Cost Center
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
        
        {/* Left Side: Department Budget Allocators (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text" placeholder="Search budget cost centers by department name or manager..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md pl-10 pr-4 py-2.5 outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="glass-panel py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="animate-spin text-emerald-400" size={32} />
              <span className="text-sm text-gray-400">Loading cost centers...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDepts.map(d => {
                const totalDeptSpend = d.opex_budget + d.software_spend + d.training_spend;
                return (
                  <div key={d.id} className="glass-panel p-5 border border-white/5 hover:border-emerald-500/30 transition-all">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Database size={14} className="text-emerald-400" /> {d.name}
                        </h3>
                        <span className="text-xs text-gray-400 block mt-0.5">
                          Manager: <span className="text-gray-300 font-medium">{d.manager}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-500 uppercase">Monthly Allocation</span>
                        <span className="text-sm font-bold text-white">€{totalDeptSpend.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Modification Sliders / Increments */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 border-t border-white/5 pt-4">
                      
                      {/* OpEx / Staff Budget */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-500 uppercase font-semibold">Staff & Operations</span>
                          <span className="text-white font-semibold">€{d.opex_budget.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => adjustBudget(d.id, 0.90, "Staff Cut")}
                            className="flex-1 py-1 border border-red-500/20 hover:bg-red-500/10 text-red-400 text-[10px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustBudget(d.id, 1.10, "Staff Raise")}
                            className="flex-1 py-1 border border-green-500/20 hover:bg-green-500/10 text-green-400 text-[10px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Software Spend */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-500 uppercase font-semibold">SaaS & Tooling</span>
                          <span className="text-white font-semibold">€{d.software_spend.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => adjustSoftware(d.id, 0.90, "SaaS Optimization")}
                            className="flex-1 py-1 border border-red-500/20 hover:bg-red-500/10 text-red-400 text-[10px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustSoftware(d.id, 1.10, "SaaS Expansion")}
                            className="flex-1 py-1 border border-green-500/20 hover:bg-green-500/10 text-green-400 text-[10px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Training Spend */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-500 uppercase font-semibold">Training & Dev</span>
                          <span className="text-white font-semibold">€{d.training_spend.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => adjustTraining(d.id, 0.90, "Training Cut")}
                            className="flex-1 py-1 border border-red-500/20 hover:bg-red-500/10 text-red-400 text-[10px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustTraining(d.id, 1.10, "Training Boost")}
                            className="flex-1 py-1 border border-green-500/20 hover:bg-green-500/10 text-green-400 text-[10px] font-bold rounded cursor-pointer"
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

        {/* Right Side: Forecast Scores & Charts (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Summary score */}
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">
              Financial Forecast Summary
            </h3>

            {/* Profits Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Simulated Monthly OpEx</span>
                <span className="text-lg font-bold text-white mt-1 block">€{stats.simulatedOpexMonthly.toLocaleString()}/mo</span>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Simulated Monthly Profit</span>
                <span className={`text-lg font-bold mt-1 block ${stats.simulatedMonthlyProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  €{stats.simulatedMonthlyProfit.toLocaleString()}/mo
                </span>
              </div>
            </div>

            {/* Profit Margin Delta Counter */}
            <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Net Monthly Profit Delta</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-2xl font-bold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {stats.delta >= 0 ? "+" : ""}€{stats.delta.toLocaleString()}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    stats.delta >= 0 ? "text-green-400 border-green-500/20 bg-green-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"
                  }`}>
                    {stats.delta >= 0 ? "SURPLUS" : "DEFICIT"}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-white/5 ${stats.delta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {stats.delta >= 0 ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
              </div>
            </div>

            {/* General Infrastructure Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Monthly Cloud hosting Infrastructure Cost</span>
                <span className="text-white font-semibold">€{cloudHostingSpend.toLocaleString()}</span>
              </div>
              <input
                type="range" min="15000" max="100000" step="5000"
                value={cloudHostingSpend} onChange={e => handleCloudHostingChange(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-gray-500">
                Adjust hosting nodes. Under-provisioning reduces cost but raises engineering risks.
              </p>
            </div>

            {/* Edge-to-Edge SVG Profit Line Chart */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-2xs font-semibold text-gray-400 flex items-center gap-1">
                <BarChart4 size={14} /> 12-Month Net Profit/Loss Forecast
              </span>
              <div className="w-full h-64 bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-center">
                {renderProfitChart()}
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#319795] rounded-full inline-block"></span> Baseline Profit</span>
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
              <span className="flex items-center gap-1.5"><Sparkles className="text-emerald-400" size={18} /> Strategic Financial: Before vs. After</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-2xs">
              {/* Baseline */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-teal-400 block border-b border-white/5 pb-1 uppercase tracking-wider">Before (Baseline)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Forecast Annual ARR:</span>
                    <span className="font-semibold text-white">€{stats.baseARR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Spend:</span>
                    <span className="font-semibold text-white">€{stats.baseOpexMonthly.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly profit:</span>
                    <span className="font-semibold text-white">€{stats.baseMonthlyProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Health:</span>
                    <span className="font-semibold text-white">85/100</span>
                  </div>
                </div>
              </div>

              {/* Simulated */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-emerald-400 block border-b border-white/5 pb-1 uppercase tracking-wider">After (Simulated)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Forecast Annual ARR:</span>
                    <span className="font-semibold text-white">€{stats.simulatedARR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Spend:</span>
                    <span className="font-semibold text-white">€{stats.simulatedOpexMonthly.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly profit:</span>
                    <span className={`font-semibold ${stats.simulatedMonthlyProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      €{stats.simulatedMonthlyProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Health:</span>
                    <span className="font-semibold text-white">{stats.healthScore}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights narrative */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xs text-gray-400 font-semibold flex items-center gap-1">
                  <Sparkles size={12} className="text-emerald-400" /> Executive AI Scenario Analysis
                </span>
                <button
                  onClick={generateAIFinanceInsights}
                  disabled={isGeneratingInsights}
                  className="px-2.5 py-1 bg-emerald-600/80 hover:bg-emerald-600 disabled:bg-white/10 text-white text-[10px] font-semibold rounded shadow-md shadow-emerald-500/10 flex items-center gap-1 cursor-pointer transition-all"
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
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-2xs text-gray-300 leading-relaxed whitespace-pre-line">
                  {aiInsights}
                </div>
              ) : (
                <div className="p-4 bg-white/5 border border-white/5 rounded-lg text-2xs text-gray-500 italic text-center">
                  Click the button above to generate a custom OpenRouter AI analysis of this specific financial scenario.
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
                <Activity size={18} className="text-emerald-400" /> Simulation Session Logs
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
                      <span className="font-semibold text-emerald-400">{hist.action} – {hist.deptName}</span>
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

      {/* COST CENTER ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddDepartment}
            className="w-full max-w-md glass-panel p-6 space-y-4 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <Plus className="text-emerald-400" size={20} /> Add Sandbox Cost Center
            </h3>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Department / Cost Center Name</label>
              <input 
                type="text" required placeholder="e.g. Sales Enablement, Office Supplies"
                value={newDeptName} onChange={e => setNewDeptName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Cost Center Lead / Manager</label>
              <input 
                type="text" required placeholder="e.g. John Doe"
                value={newManager} onChange={e => setNewManager(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Staff / Ops Budget (€/mo)</label>
                <input 
                  type="number" min="1000" max="1000000" value={newBudget} onChange={e => setNewBudget(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-2xs text-gray-400 mb-1">SaaS spend (€/mo)</label>
                <input 
                  type="number" min="100" max="250000" value={newSoftware} onChange={e => setNewSoftware(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Training Budget (€/mo)</label>
              <input 
                type="number" min="100" max="50000" value={newTraining} onChange={e => setNewTraining(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-emerald-500"
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
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
              >
                Add Cost Center
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
