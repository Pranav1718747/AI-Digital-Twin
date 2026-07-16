"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Cpu, Search, RefreshCw, BarChart4, DollarSign, 
  Award, Briefcase, Plus, Sparkles, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, Share2, Compass
} from "lucide-react";
import { api } from "@/lib/api";

interface AutomationInitiative {
  id: string;
  name: string;
  initiative_lead: string;
  gpu_provision_gb: number; // GPU VRAM in GB
  accuracy_threshold_target: number; // target accuracy %
  tooling_budget: number; // EUR
  processing_rate_limit: number; // req/sec
}

interface ActionHistoryItem {
  id: string;
  timestamp: string;
  action: string; 
  initiativeName: string;
  details: string;
}

export default function AIAutomationSimulator() {
  // Baseline Initiatives State
  const [initiatives, setInitiatives] = useState<AutomationInitiative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom modifiers
  const [contextWindowTokens, setContextWindowTokens] = useState(4096); // 4k tokens baseline
  const [aiAutomationOffset, setAiAutomationOffset] = useState(0.0); // 0.0 to 1.0
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  
  // AI Insights State
  const [aiInsights, setAiInsights] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  // Custom Initiative Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInitiativeName, setNewInitiativeName] = useState("");
  const [newLead, setNewLead] = useState("");
  const [newGpu, setNewGpu] = useState(16);
  const [newAccuracy, setNewAccuracy] = useState(90);
  const [newRateLimit, setNewRateLimit] = useState(50);

  // Load baseline configurations
  useEffect(() => {
    setIsLoading(true);
    const baselineInitiatives: AutomationInitiative[] = [
      { id: "init-sales", name: "AI Lead Routing & Scoring Agent", initiative_lead: "Sarah Connor", gpu_provision_gb: 24, accuracy_threshold_target: 92, tooling_budget: 4500, processing_rate_limit: 80 },
      { id: "init-support", name: "Autonomous Customer Support Assistant", initiative_lead: "John Doe", gpu_provision_gb: 48, accuracy_threshold_target: 88, tooling_budget: 8000, processing_rate_limit: 120 },
      { id: "init-copilot", name: "Engineering Code Autocomplete", initiative_lead: "Charlie Davis", gpu_provision_gb: 16, accuracy_threshold_target: 85, tooling_budget: 3000, processing_rate_limit: 150 },
      { id: "init-content", name: "Marketing Blog & Copy Generator", initiative_lead: "Grace Hopper", gpu_provision_gb: 8, accuracy_threshold_target: 80, tooling_budget: 1500, processing_rate_limit: 20 },
      { id: "init-graph", name: "AI Graph SOP Alignment Sync", initiative_lead: "Ada Lovelace", gpu_provision_gb: 32, accuracy_threshold_target: 95, tooling_budget: 6000, processing_rate_limit: 60 }
    ];
    setInitiatives(baselineInitiatives);
    setIsLoading(false);
  }, []);

  // Filter initiatives
  const filteredInitiatives = useMemo(() => {
    return initiatives.filter(i => {
      const matchQuery = `${i.name} ${i.initiative_lead}`.toLowerCase();
      return matchQuery.includes(searchQuery.toLowerCase());
    });
  }, [initiatives, searchQuery]);

  // General Reset
  const handleResetSandbox = () => {
    setInitiatives(prev => prev.map(i => {
      if (i.id.startsWith("sandbox-init")) return null;
      // Restore standard values
      if (i.id === "init-sales") return { ...i, gpu_provision_gb: 24, accuracy_threshold_target: 92, tooling_budget: 4500, processing_rate_limit: 80 };
      if (i.id === "init-support") return { ...i, gpu_provision_gb: 48, accuracy_threshold_target: 88, tooling_budget: 8000, processing_rate_limit: 120 };
      if (i.id === "init-copilot") return { ...i, gpu_provision_gb: 16, accuracy_threshold_target: 85, tooling_budget: 3000, processing_rate_limit: 150 };
      if (i.id === "init-content") return { ...i, gpu_provision_gb: 8, accuracy_threshold_target: 80, tooling_budget: 1500, processing_rate_limit: 20 };
      if (i.id === "init-graph") return { ...i, gpu_provision_gb: 32, accuracy_threshold_target: 95, tooling_budget: 6000, processing_rate_limit: 60 };
      return i;
    }).filter(Boolean) as AutomationInitiative[]);
    setActionHistory([]);
    setContextWindowTokens(4096);
    setAiAutomationOffset(0.0);
    setAiInsights("");
  };

  // Adjust GPU Allocation
  const adjustGpu = (id: string, factor: number, label: string) => {
    setInitiatives(prev => prev.map(i => {
      if (i.id === id) {
        const originalVal = i.gpu_provision_gb;
        const newVal = Math.max(4, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "GPU Resources Allocated" : "GPU Resources Restricted",
            initiativeName: i.name,
            details: `${label}: Compute VRAM changed from ${originalVal}GB to ${newVal}GB (Shift: ${deltaVal >= 0 ? "+" : ""}${deltaVal}GB).`
          },
          ...hist
        ]);

        return { ...i, gpu_provision_gb: newVal };
      }
      return i;
    }));
  };

  // Adjust Accuracy target %
  const adjustAccuracy = (id: string, factor: number, label: string) => {
    setInitiatives(prev => prev.map(i => {
      if (i.id === id) {
        const originalVal = i.accuracy_threshold_target;
        const newVal = Math.max(50, Math.min(99, Math.round(originalVal * factor)));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Accuracy Target Raised" : "Accuracy Target Lowered",
            initiativeName: i.name,
            details: `${label}: Quality assurance accuracy threshold adjusted from ${originalVal}% to ${newVal}%.`
          },
          ...hist
        ]);

        return { ...i, accuracy_threshold_target: newVal };
      }
      return i;
    }));
  };

  // Adjust Tooling Budget
  const adjustTooling = (id: string, factor: number, label: string) => {
    setInitiatives(prev => prev.map(i => {
      if (i.id === id) {
        const originalVal = i.tooling_budget;
        const newVal = Math.max(500, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Model Licensing Upgraded" : "Model Licensing Reduced",
            initiativeName: i.name,
            details: `${label}: Proprietary LLM API subscription spend changed from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...i, tooling_budget: newVal };
      }
      return i;
    }));
  };

  // Adjust Processing rate limit
  const adjustRateLimit = (id: string, factor: number, label: string) => {
    setInitiatives(prev => prev.map(i => {
      if (i.id === id) {
        const originalVal = i.processing_rate_limit;
        const newVal = Math.max(5, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Rate Limit Raised" : "Rate Limit Lowered",
            initiativeName: i.name,
            details: `${label}: Concurrency rate processing limit target scaled from ${originalVal} req/s to ${newVal} req/s.`
          },
          ...hist
        ]);

        return { ...i, processing_rate_limit: newVal };
      }
      return i;
    }));
  };

  // Context window adjustment
  const handleContextChange = (val: number) => {
    const original = contextWindowTokens;
    setContextWindowTokens(val);
    if (Math.abs(val - original) >= 1000) {
      setActionHistory(hist => [
        {
          id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date().toLocaleTimeString(),
          action: "Context Limit Changed",
          initiativeName: "AI Infrastructure",
          details: `Global prompt context window configured at ${val} tokens limit (Previous: ${original} tokens).`
        } as any,
        ...hist
      ]);
    }
  };

  // Add custom initiative
  const handleAddInitiative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInitiativeName.trim() || !newLead.trim()) return;

    const newI: AutomationInitiative = {
      id: `sandbox-init-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newInitiativeName.trim(),
      initiative_lead: newLead.trim(),
      gpu_provision_gb: newGpu,
      accuracy_threshold_target: newAccuracy,
      tooling_budget: 2000,
      processing_rate_limit: newRateLimit
    };

    setInitiatives(prev => [...prev, newI]);
    setActionHistory(hist => [
      {
        id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "Initiative Registered",
        initiativeName: newInitiativeName.trim(),
        details: `Simulated a new model setup with GPU: ${newGpu}GB VRAM, Accuracy threshold: ${newAccuracy}%.`
      },
      ...hist
    ]);

    // Reset Form
    setNewInitiativeName("");
    setNewLead("");
    setNewGpu(16);
    setNewAccuracy(90);
    setNewRateLimit(50);
    setShowAddModal(false);
  };

  // Compile totals & calculations
  const stats = useMemo(() => {
    const originalInitiatives = [
      { gpu: 24, accuracy: 92, velocity: 80, tooling: 4500 },
      { gpu: 48, accuracy: 88, velocity: 120, tooling: 8000 },
      { gpu: 16, accuracy: 85, velocity: 150, tooling: 3000 },
      { gpu: 8, accuracy: 80, velocity: 20, tooling: 1500 },
      { gpu: 32, accuracy: 95, velocity: 60, tooling: 6000 }
    ];

    const baseGpuSum = originalInitiatives.reduce((sum, i) => sum + i.gpu, 0);
    const baseToolingSum = originalInitiatives.reduce((sum, i) => sum + i.tooling, 0);
    
    // Average baseline accuracy F1 index
    const baseAccuracy = originalInitiatives.reduce((sum, i) => sum + i.accuracy, 0) / originalInitiatives.length;

    // Simulated values
    const simulatedGpuSum = initiatives.reduce((sum, i) => sum + i.gpu_provision_gb, 0);
    const simulatedToolingSum = initiatives.reduce((sum, i) => sum + i.tooling_budget, 0);

    // Simulated F1 accuracy index calculation
    let simulatedAccuracy = initiatives.reduce((sum, i) => {
      // Accuracy scales with GPU budget VRAM, constrained by target threshold
      const gpuRatio = i.gpu_provision_gb / (i.id.startsWith("sandbox-") ? 16 : (originalInitiatives.find(oi => oi.velocity === i.processing_rate_limit)?.gpu || 16));
      const modelQuality = Math.min(1.1, gpuRatio * 0.95 + (i.tooling_budget / 8000) * 0.1);
      return sum + (i.accuracy_threshold_target * Math.max(0.6, modelQuality));
    }, 0) / (initiatives.length || 1);

    // AI optimization prompt caching boost
    const automationAccuracyBoost = aiAutomationOffset * 4;
    simulatedAccuracy = Math.min(99.5, simulatedAccuracy + automationAccuracyBoost);

    const accuracyDelta = simulatedAccuracy - baseAccuracy;

    // Total monthly automated tasks capacity
    const baseTasksCount = originalInitiatives.reduce((sum, i) => sum + (i.velocity * 3000), 0);
    const simulatedTasksCount = initiatives.reduce((sum, i) => {
      const scale = i.gpu_provision_gb * 180 + i.processing_rate_limit * 1200;
      return sum + scale;
    }, 0);

    // Health Score %
    let healthScore = 88;
    healthScore += Math.round(accuracyDelta * 1.5);
    if (simulatedAccuracy < 78) healthScore -= 20; // low quality penalty
    healthScore = Math.max(10, Math.min(100, healthScore));

    return {
      baseGpuSum,
      simulatedGpuSum,
      baseToolingSum,
      simulatedToolingSum,
      baseAccuracy: Math.round(baseAccuracy),
      simulatedAccuracy: Math.round(simulatedAccuracy),
      baseTasksCount,
      simulatedTasksCount,
      delta: Number(accuracyDelta.toFixed(1)),
      healthScore
    };
  }, [initiatives, contextWindowTokens, aiAutomationOffset]);

  // Compute 12-month timeline for accuracy F1 trend curve
  const timelineData = useMemo(() => {
    const timeline = [];
    const base = stats.baseAccuracy;
    const sim = stats.simulatedAccuracy;

    for (let m = 1; m <= 12; m++) {
      // Baseline seasonal training noise
      const baseNoise = Math.sin(m / 1.5) * 1.2;
      const baseVal = base + baseNoise;

      // Simulated accuracy curve
      const adjustment = m <= 4 ? (sim - base) * (m / 4) : (sim - base);
      const simNoise = Math.cos(m / 2.2) * 0.9;
      const simVal = base + adjustment + simNoise;

      timeline.push({
        month: m,
        baseline: Math.round(baseVal),
        simulated: Math.round(simVal)
      });
    }
    return timeline;
  }, [stats]);

  // Render Bezier accuracy F1 velocity chart
  const renderAccuracyChart = () => {
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

  // Call OpenRouter API for AI consequence insights
  const generateAIBotInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsError("");
    try {
      const payload = {
        initial_metrics: {
          total_employees: 18,
          total_revenue_arr: 5000000,
          total_opex_monthly: stats.baseToolingSum,
          total_profit_monthly: stats.baseAccuracy,
          company_health_score: 88,
          employee_satisfaction: 80,
          customer_satisfaction: 82,
          risk_score: 10,
          productivity: 88,
          delivery_speed: 88
        },
        simulated_metrics: {
          total_employees: 18,
          total_revenue_arr: 5000000 + (stats.delta * 50000),
          total_opex_monthly: stats.simulatedToolingSum,
          total_profit_monthly: stats.simulatedAccuracy,
          company_health_score: stats.healthScore,
          employee_satisfaction: Math.max(10, Math.min(100, Math.round(80 + (stats.delta * 3)))),
          customer_satisfaction: Math.max(10, Math.min(100, Math.round(82 + (stats.delta * 2.5)))),
          risk_score: Math.max(5, Math.min(95, 10 - Math.round(stats.delta))),
          productivity: 88,
          delivery_speed: 88
        }
      };

      const res = await api.post("/simulation/insights", payload);
      setAiInsights(res.data.insights || "");
    } catch (err: any) {
      console.error("Failed to generate AI Platform insights.", err);
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
            <Cpu className="text-indigo-400" size={24} /> AI Automation Simulator Sandbox
          </h1>
          <p className="text-gray-400 text-sm">
            Tune GPU hardware provisions, target accuracy thresholds, model licensing budgets, and request concurrency limits. Model overall LLM accuracy indices.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Add Sandbox AI Agent
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
        
        {/* Left Side: Initiative allocations (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text" placeholder="Search AI automation agents by model name or lead..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="glass-panel py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="animate-spin text-indigo-400" size={32} />
              <span className="text-sm text-gray-400">Loading AI architectures...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInitiatives.map(i => {
                return (
                  <div key={i.id} className="glass-panel p-5 border border-white/5 hover:border-indigo-500/30 transition-all">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Cpu size={14} className="text-indigo-400" /> {i.name}
                        </h3>
                        <span className="text-xs text-gray-400 block mt-0.5">
                          Architect Owner: <span className="text-gray-300 font-medium">{i.initiative_lead}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Concurrency Limit</span>
                        <span className="text-sm font-bold text-white">{i.processing_rate_limit} req/sec</span>
                      </div>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 border-t border-white/5 pt-4">
                      
                      {/* GPU Provision */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">GPU compute</span>
                        <span className="text-xs font-bold text-white block">{i.gpu_provision_gb} GB VRAM</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustGpu(i.id, 0.50, "Deallocate GPU core")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            Scale Down
                          </button>
                          <button
                            onClick={() => adjustGpu(i.id, 2.00, "Allocate GPU core")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            Scale Up
                          </button>
                        </div>
                      </div>

                      {/* Accuracy Threshold */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">F1 Threshold</span>
                        <span className="text-xs font-bold text-white block">{i.accuracy_threshold_target}% target</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustAccuracy(i.id, 0.90, "Lower accuracy threshold")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustAccuracy(i.id, 1.10, "Raise accuracy threshold")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Tooling spend */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Model Spend</span>
                        <span className="text-xs font-bold text-white block">€{i.tooling_budget.toLocaleString()}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustTooling(i.id, 0.80, "License downgrades")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -20%
                          </button>
                          <button
                            onClick={() => adjustTooling(i.id, 1.20, "License upgrades")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +20%
                          </button>
                        </div>
                      </div>

                      {/* Rate Limit */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Rate limits</span>
                        <span className="text-xs font-bold text-white block">{i.processing_rate_limit} req/s</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustRateLimit(i.id, 0.80, "Throttle limits")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -20%
                          </button>
                          <button
                            onClick={() => adjustRateLimit(i.id, 1.20, "Raise limits")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +20%
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
              Automation Performance Summary
            </h3>

            {/* Main monthly closed ARR metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Total Tasks Automated</span>
                <span className="text-lg font-bold text-white mt-1 block">{stats.simulatedTasksCount.toLocaleString()}/mo</span>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Simulated Model Accuracy</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">{stats.simulatedAccuracy}% F1</span>
              </div>
            </div>

            {/* Accuracy Delta Counter */}
            <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Accuracy index F1 Shift</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-2xl font-bold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {stats.delta >= 0 ? "+" : ""}{stats.delta.toLocaleString()}% F1
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    stats.delta >= 0 ? "text-green-400 border-green-500/20 bg-green-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"
                  }`}>
                    {stats.delta >= 0 ? "OPTIMIZED" : "DEGRADED"}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-white/5 ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                <Zap size={22} />
              </div>
            </div>

            {/* context window slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Context Window Limit Target</span>
                <span className="text-white font-semibold">{contextWindowTokens} tokens</span>
              </div>
              <input 
                type="range" min="1024" max="16384" step="1024" 
                value={contextWindowTokens} onChange={e => handleContextChange(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-gray-500">
                Increasing context window length increases quality and attention details but inflates token API costs.
              </p>
            </div>

            {/* Edge-to-Edge SVG lead Curve */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-2xs font-semibold text-gray-400 flex items-center gap-1">
                <Cpu size={14} className="text-gray-500" /> 12-Month Accuracy F1-Score Forecast
              </span>
              <div className="w-full h-64 bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-center">
                {renderAccuracyChart()}
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#319795] rounded-full inline-block"></span> Baseline accuracy</span>
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
              <span className="flex items-center gap-1.5"><Sparkles className="text-indigo-400" size={18} /> Strategic Automation: Before vs. After</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-2xs">
              {/* Baseline */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-teal-400 block border-b border-white/5 pb-1 uppercase tracking-wider">Before (Baseline)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Compute GPU:</span>
                    <span className="font-semibold text-white">{stats.baseGpuSum} GB VRAM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Accuracy:</span>
                    <span className="font-semibold text-white">{stats.baseAccuracy}% F1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly automated:</span>
                    <span className="font-semibold text-white">{stats.baseTasksCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model budgets:</span>
                    <span className="font-semibold text-white">€{stats.baseToolingSum.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Simulated */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-indigo-400 block border-b border-white/5 pb-1 uppercase tracking-wider">After (Simulated)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Compute GPU:</span>
                    <span className="font-semibold text-white">{stats.simulatedGpuSum} GB VRAM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Accuracy:</span>
                    <span className={`font-semibold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {stats.simulatedAccuracy}% F1
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly automated:</span>
                    <span className="font-semibold text-white">{stats.simulatedTasksCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model budgets:</span>
                    <span className="font-semibold text-white">€{stats.simulatedToolingSum.toLocaleString()}</span>
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
                  onClick={generateAIBotInsights}
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
                  Click the button above to generate a custom OpenRouter AI analysis of this specific model architecture scenario.
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
                      <span className="font-semibold text-indigo-400">{hist.action} – {hist.initiativeName}</span>
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

      {/* INITIATIVE ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddInitiative}
            className="w-full max-w-md glass-panel p-6 space-y-4 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <Plus className="text-indigo-400" size={20} /> Add Sandbox AI Agent
            </h3>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">AI Initiative Platform Name</label>
              <input 
                type="text" required placeholder="e.g. AI HR Bot, Code Review copilot"
                value={newInitiativeName} onChange={e => setNewInitiativeName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Architecture Lead Manager</label>
              <input 
                type="text" required placeholder="e.g. John Doe"
                value={newLead} onChange={e => setNewLead(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs text-gray-400 mb-1">GPU allocation (GB VRAM)</label>
                <input 
                  type="number" min="4" max="1000" value={newGpu} onChange={e => setNewGpu(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Accuracy target F1 (%)</label>
                <input 
                  type="number" min="10" max="99" value={newAccuracy} onChange={e => setNewAccuracy(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Concurrency limit target (req/s)</label>
              <input 
                type="number" min="1" max="10000" value={newRateLimit} onChange={e => setNewRateLimit(Number(e.target.value))}
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
                Register Agent
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
