"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  LineChart, Search, RefreshCw, BarChart4, DollarSign, 
  Award, Briefcase, Plus, Sparkles, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, Globe, Percent
} from "lucide-react";
import { api } from "@/lib/api";

interface SalesChannel {
  id: string;
  region: string;
  lead_manager: string;
  monthly_quota_target: number; 
  lead_conversion_rate: number; // in %
  marketing_allocation: number; // EUR
  discount_allowance: number; // in %
}

interface ActionHistoryItem {
  id: string;
  timestamp: string;
  action: string; 
  channelName: string;
  details: string;
}

export default function SalesSimulator() {
  // Baseline Sales Regions State
  const [channels, setChannels] = useState<SalesChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom modifiers
  const [salesCommissionRate, setSalesCommissionRate] = useState(10); // 10% commission baseline
  const [aiAutomationOffset, setAiAutomationOffset] = useState(0.0); // 0.0 to 1.0
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  
  // AI Insights State
  const [aiInsights, setAiInsights] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  // Custom Region Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRegionName, setNewRegionName] = useState("");
  const [newLeadManager, setNewLeadManager] = useState("");
  const [newQuota, setNewQuota] = useState(80000);
  const [newConversion, setNewConversion] = useState(2.5);
  const [newMarketing, setNewMarketing] = useState(15000);

  // Load baseline sales configuration
  useEffect(() => {
    setIsLoading(true);
    const baselineChannels: SalesChannel[] = [
      { id: "chan-na", region: "North America (NA Enterprise)", lead_manager: "Sarah Connor", monthly_quota_target: 120000, lead_conversion_rate: 3.2, marketing_allocation: 35000, discount_allowance: 15 },
      { id: "chan-emea", region: "Europe (EMEA Mid-Market)", lead_manager: "John Doe", monthly_quota_target: 80000, lead_conversion_rate: 2.8, marketing_allocation: 25000, discount_allowance: 10 },
      { id: "chan-apac", region: "Asia-Pacific (APAC SMB)", lead_manager: "Charlie Davis", monthly_quota_target: 50000, lead_conversion_rate: 2.1, marketing_allocation: 15000, discount_allowance: 8 },
      { id: "chan-latam", region: "Latin America (LATAM SMB)", lead_manager: "Grace Hopper", monthly_quota_target: 40000, lead_conversion_rate: 1.9, marketing_allocation: 10000, discount_allowance: 12 },
      { id: "chan-plg", region: "Product-Led Growth (Digital)", lead_manager: "Ada Lovelace", monthly_quota_target: 95000, lead_conversion_rate: 4.5, marketing_allocation: 20000, discount_allowance: 5 }
    ];
    setChannels(baselineChannels);
    setIsLoading(false);
  }, []);

  // Filter channels
  const filteredChannels = useMemo(() => {
    return channels.filter(c => {
      const matchQuery = `${c.region} ${c.lead_manager}`.toLowerCase();
      return matchQuery.includes(searchQuery.toLowerCase());
    });
  }, [channels, searchQuery]);

  // General Reset
  const handleResetSandbox = () => {
    setChannels(prev => prev.map(c => {
      if (c.id.startsWith("sandbox-chan")) return null;
      // Restore standard values
      if (c.id === "chan-na") return { ...c, monthly_quota_target: 120000, lead_conversion_rate: 3.2, marketing_allocation: 35000, discount_allowance: 15 };
      if (c.id === "chan-emea") return { ...c, monthly_quota_target: 80000, lead_conversion_rate: 2.8, marketing_allocation: 25000, discount_allowance: 10 };
      if (c.id === "chan-apac") return { ...c, monthly_quota_target: 50000, lead_conversion_rate: 2.1, marketing_allocation: 15000, discount_allowance: 8 };
      if (c.id === "chan-latam") return { ...c, monthly_quota_target: 40000, lead_conversion_rate: 1.9, marketing_allocation: 10000, discount_allowance: 12 };
      if (c.id === "chan-plg") return { ...c, monthly_quota_target: 95000, lead_conversion_rate: 4.5, marketing_allocation: 20000, discount_allowance: 5 };
      return c;
    }).filter(Boolean) as SalesChannel[]);
    setActionHistory([]);
    setSalesCommissionRate(10);
    setAiAutomationOffset(0.0);
    setAiInsights("");
  };

  // Adjust Quota
  const adjustQuota = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.monthly_quota_target;
        const newVal = Math.max(10000, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Quota Increased" : "Quota Lowered",
            channelName: c.region,
            details: `${label}: Region monthly quota target shifted from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...c, monthly_quota_target: newVal };
      }
      return c;
    }));
  };

  // Adjust Conversion Rate
  const adjustConversion = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.lead_conversion_rate;
        const newVal = Math.max(0.2, Number((originalVal * factor).toFixed(2)));
        const deltaVal = Number((newVal - originalVal).toFixed(2));
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Conversion Optimized" : "Conversion Dropped",
            channelName: c.region,
            details: `${label}: Lead conversion rate target adjusted from ${originalVal}% to ${newVal}% (Shift: ${deltaVal}%).`
          },
          ...hist
        ]);

        return { ...c, lead_conversion_rate: newVal };
      }
      return c;
    }));
  };

  // Adjust Marketing Pipeline Spend
  const adjustMarketing = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.marketing_allocation;
        const newVal = Math.max(1000, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Pipeline Spend Boosted" : "Pipeline Spend Cut",
            channelName: c.region,
            details: `${label}: Marketing budget allocation changed from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...c, marketing_allocation: newVal };
      }
      return c;
    }));
  };

  // Adjust Discount Allowance
  const adjustDiscount = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.discount_allowance;
        const newVal = Math.max(0, Math.min(50, Math.round(originalVal * factor)));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Discounts Expanded" : "Discounts Restricted",
            channelName: c.region,
            details: `${label}: Permitted discount threshold adjusted from ${originalVal}% to ${newVal}%.`
          },
          ...hist
        ]);

        return { ...c, discount_allowance: newVal };
      }
      return c;
    }));
  };

  // Commission Slider adjustment
  const handleCommissionChange = (val: number) => {
    const original = salesCommissionRate;
    setSalesCommissionRate(val);
    if (Math.abs(val - original) >= 1) {
      setActionHistory(hist => [
        {
          id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date().toLocaleTimeString(),
          action: "Commission Rate Changed",
          deptName: "Sales Ops",
          details: `Global sales commission incentive rate configured at ${val}% (Previous: ${original}%).`
        } as any,
        ...hist
      ]);
    }
  };

  // Add custom region
  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionName.trim() || !newLeadManager.trim()) return;

    const newC: SalesChannel = {
      id: `sandbox-chan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      region: newRegionName.trim(),
      lead_manager: newLeadManager.trim(),
      monthly_quota_target: newQuota,
      lead_conversion_rate: newConversion,
      marketing_allocation: newMarketing,
      discount_allowance: 10
    };

    setChannels(prev => [...prev, newC]);
    setActionHistory(hist => [
      {
        id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "Region Registered",
        channelName: newRegionName.trim(),
        details: `Simulated a new region setup with monthly quota target: €${newQuota.toLocaleString()}, Conversion: ${newConversion}%.`
      },
      ...hist
    ]);

    // Reset Form
    setNewRegionName("");
    setNewLeadManager("");
    setNewQuota(80000);
    setNewConversion(2.5);
    setNewMarketing(15000);
    setShowAddModal(false);
  };

  // Compile totals & calculations
  const stats = useMemo(() => {
    const originalChannels = [
      { quota: 120000, conv: 3.2, mktg: 35000, disc: 15 },
      { quota: 80000, conv: 2.8, mktg: 25000, disc: 10 },
      { quota: 50000, conv: 2.1, mktg: 15000, disc: 8 },
      { quota: 40000, conv: 1.9, mktg: 10000, disc: 12 },
      { quota: 95000, conv: 4.5, mktg: 20000, disc: 5 }
    ];

    // Baseline monthly closed ARR calculation
    const baseMonthlyRevenue = originalChannels.reduce((sum, c) => {
      // ARR = pipeline (marketing spend * conversion index) * quota multiplier
      const pipelineVal = (c.mktg * (c.conv / 2.0));
      const closed = pipelineVal * (1 - c.disc / 100);
      return sum + closed;
    }, 0);

    // Simulated Monthly closed ARR calculation
    const simulatedMonthlyRevenue = channels.reduce((sum, c) => {
      // Pipeline = marketing allocation * conversion rate multiplier
      const pipelineVal = (c.marketing_allocation * (c.lead_conversion_rate / 2.0));
      
      // Quota impact: commission rate increases sales representative focus/incentive
      const commissionIncentive = 1.0 + (salesCommissionRate - 10) * 0.02;
      const closed = pipelineVal * (1 - c.discount_allowance / 100) * commissionIncentive;
      return sum + closed;
    }, 0);

    // AI Lead scoring Automation boost
    const automationARRBoost = aiAutomationOffset * 22000;
    const finalSimulatedRevenue = simulatedMonthlyRevenue + automationARRBoost;

    // Monthly pipeline generated
    const basePipelineSum = originalChannels.reduce((sum, c) => sum + (c.mktg * 5), 0);
    const simulatedPipelineSum = channels.reduce((sum, c) => sum + (c.marketing_allocation * 5), 0);

    const revenueDelta = finalSimulatedRevenue - baseMonthlyRevenue;

    // Health Score %
    let healthScore = 82;
    healthScore += Math.round(revenueDelta / 8000);
    if (salesCommissionRate < 5) healthScore -= 15; // low rep morale penalty
    healthScore = Math.max(10, Math.min(100, healthScore));

    return {
      baseMonthlyARR: Math.round(baseMonthlyRevenue),
      simulatedMonthlyARR: Math.round(finalSimulatedRevenue),
      basePipelineSum: Math.round(basePipelineSum),
      simulatedPipelineSum: Math.round(simulatedPipelineSum),
      delta: Math.round(revenueDelta),
      healthScore
    };
  }, [channels, salesCommissionRate, aiAutomationOffset]);

  // Compute 12-month timeline for closed ARR growth trend curve
  const timelineData = useMemo(() => {
    const timeline = [];
    const base = stats.baseMonthlyARR;
    const sim = stats.simulatedMonthlyARR;

    for (let m = 1; m <= 12; m++) {
      // Baseline seasonal sales noise
      const baseNoise = Math.sin(m / 1.5) * 4000;
      const baseVal = base + baseNoise;

      // Simulated sales curve
      const adjustment = m <= 4 ? (sim - base) * (m / 4) : (sim - base);
      const simNoise = Math.cos(m / 2.2) * 3500;
      const simVal = base + adjustment + simNoise;

      timeline.push({
        month: m,
        baseline: Math.round(baseVal),
        simulated: Math.round(simVal)
      });
    }
    return timeline;
  }, [stats]);

  // Render Bezier closed ARR chart
  const renderARRChart = () => {
    const width = 500;
    const height = 240;

    const allVals = [
      ...timelineData.map(d => d.baseline),
      ...timelineData.map(d => d.simulated)
    ];
    const maxVal = Math.max(...allVals) + 12000;
    const minVal = Math.min(...allVals) - 12000;
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

  // Call OpenRouter API for Sales consequence insights
  const generateAISalesInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsError("");
    try {
      const payload = {
        initial_metrics: {
          total_employees: 18,
          total_revenue_arr: stats.baseMonthlyARR * 12,
          total_opex_monthly: 320000,
          total_profit_monthly: stats.baseMonthlyARR - 320000,
          company_health_score: 82,
          employee_satisfaction: 80,
          customer_satisfaction: 80,
          risk_score: 10,
          productivity: 82,
          delivery_speed: 82
        },
        simulated_metrics: {
          total_employees: 18,
          total_revenue_arr: stats.simulatedMonthlyARR * 12,
          total_opex_monthly: 320000 + (stats.simulatedMonthlyARR * (salesCommissionRate / 100)),
          total_profit_monthly: stats.simulatedMonthlyARR - (320000 + (stats.simulatedMonthlyARR * (salesCommissionRate / 100))),
          company_health_score: stats.healthScore,
          employee_satisfaction: Math.max(10, Math.min(100, Math.round(80 + (stats.delta / 10000)))),
          customer_satisfaction: Math.max(10, Math.min(100, Math.round(80 + (stats.delta / 12000)))),
          risk_score: Math.max(5, Math.min(95, 10 - Math.round(stats.delta / 15000))),
          productivity: 82,
          delivery_speed: 82
        }
      };

      const res = await api.post("/simulation/insights", payload);
      setAiInsights(res.data.insights || "");
    } catch (err: any) {
      console.error("Failed to generate AI Sales insights.", err);
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
            <LineChart className="text-indigo-400" size={24} /> Sales Simulator Sandbox
          </h1>
          <p className="text-gray-400 text-sm">
            Tune target regional quotas, discount limits, and lead conversion metrics. Model closed ARR growth velocities.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Add Sandbox Sales Region
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
        
        {/* Left Side: Channel allocations (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text" placeholder="Search sales regions by territory name or leader..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="glass-panel py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="animate-spin text-indigo-400" size={32} />
              <span className="text-sm text-gray-400">Loading pipeline channels...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredChannels.map(c => {
                const totalChannelPipeline = c.marketing_allocation * 5;
                return (
                  <div key={c.id} className="glass-panel p-5 border border-white/5 hover:border-indigo-500/30 transition-all">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Globe size={14} className="text-indigo-400" /> {c.region}
                        </h3>
                        <span className="text-xs text-gray-400 block mt-0.5">
                          Territory Lead: <span className="text-gray-300 font-medium">{c.lead_manager}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Monthly Pipeline Pool</span>
                        <span className="text-sm font-bold text-white">€{totalChannelPipeline.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 border-t border-white/5 pt-4">
                      
                      {/* Quota Target */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Quota Target</span>
                        <span className="text-xs font-bold text-white block">€{c.monthly_quota_target.toLocaleString()}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustQuota(c.id, 0.90, "Quota cut")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustQuota(c.id, 1.10, "Quota raise")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Lead Conversion */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Conversion Rate</span>
                        <span className="text-xs font-bold text-white block">{c.lead_conversion_rate}%</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustConversion(c.id, 0.90, "Lower conversion")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustConversion(c.id, 1.10, "Optimize conversion")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Marketing Allocation */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Pipeline Spend</span>
                        <span className="text-xs font-bold text-white block">€{c.marketing_allocation.toLocaleString()}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustMarketing(c.id, 0.90, "Reduce budget")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustMarketing(c.id, 1.10, "Boost budget")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Discount Allowance */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Discount Limit</span>
                        <span className="text-xs font-bold text-white block flex items-center gap-0.5"><Percent size={10} /> {c.discount_allowance}%</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustDiscount(c.id, 0.80, "Tighten discount")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -20%
                          </button>
                          <button
                            onClick={() => adjustDiscount(c.id, 1.20, "Relax discount")}
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
              Sales Forecast Summary
            </h3>

            {/* Main closed ARR metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Pipeline Generated</span>
                <span className="text-lg font-bold text-white mt-1 block">€{stats.simulatedPipelineSum.toLocaleString()}/mo</span>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Simulated Monthly ARR</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">€{stats.simulatedMonthlyARR.toLocaleString()}/mo</span>
              </div>
            </div>

            {/* ARR Delta Counter */}
            <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Closed ARR Velocity Shift</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-2xl font-bold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {stats.delta >= 0 ? "+" : ""}€{stats.delta.toLocaleString()}/mo
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    stats.delta >= 0 ? "text-green-400 border-green-500/20 bg-green-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"
                  }`}>
                    {stats.delta >= 0 ? "GROWTH" : "CHURN"}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-white/5 ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                <Zap size={22} />
              </div>
            </div>

            {/* commission slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Incentive Commission Rate</span>
                <span className="text-white font-semibold">{salesCommissionRate}%</span>
              </div>
              <input 
                type="range" min="5" max="30" step="1" 
                value={salesCommissionRate} onChange={e => handleCommissionChange(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-gray-500">
                Increasing commission rates improves sales representative focus and conversion targets.
              </p>
            </div>

            {/* Edge-to-Edge SVG sales Curve */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-2xs font-semibold text-gray-400 flex items-center gap-1">
                <LineChart size={14} className="text-gray-500" /> 12-Month Closed ARR Sales Trend
              </span>
              <div className="w-full h-64 bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-center">
                {renderARRChart()}
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#319795] rounded-full inline-block"></span> Baseline ARR</span>
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
              <span className="flex items-center gap-1.5"><Sparkles className="text-indigo-400" size={18} /> Strategic Sales: Before vs. After</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-2xs">
              {/* Baseline */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-teal-400 block border-b border-white/5 pb-1 uppercase tracking-wider">Before (Baseline)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Forecast Annual ARR:</span>
                    <span className="font-semibold text-white">€{(stats.baseMonthlyARR * 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly ARR pool:</span>
                    <span className="font-semibold text-white">€{stats.baseMonthlyARR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pipeline Volume:</span>
                    <span className="font-semibold text-white">€{stats.basePipelineSum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incentive commission:</span>
                    <span className="font-semibold text-white">10%</span>
                  </div>
                </div>
              </div>

              {/* Simulated */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-indigo-400 block border-b border-white/5 pb-1 uppercase tracking-wider">After (Simulated)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Forecast Annual ARR:</span>
                    <span className="font-semibold text-white">€{(stats.simulatedMonthlyARR * 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly ARR pool:</span>
                    <span className={`font-semibold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                      €{stats.simulatedMonthlyARR.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pipeline Volume:</span>
                    <span className="font-semibold text-white">€{stats.simulatedPipelineSum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incentive commission:</span>
                    <span className="font-semibold text-white">{salesCommissionRate}%</span>
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
                  onClick={generateAISalesInsights}
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
                  Click the button above to generate a custom OpenRouter AI analysis of this specific sales channel scenario.
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
                      <span className="font-semibold text-indigo-400">{hist.action} – {hist.channelName}</span>
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

      {/* REGION ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddChannel}
            className="w-full max-w-md glass-panel p-6 space-y-4 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <Plus className="text-indigo-400" size={20} /> Add Sandbox Sales Region
            </h3>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Sales Region territory Name</label>
              <input 
                type="text" required placeholder="e.g. Europe Enterprise, APAC Enterprise"
                value={newRegionName} onChange={e => setNewRegionName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Territory Representative Head</label>
              <input 
                type="text" required placeholder="e.g. John Smith"
                value={newLeadManager} onChange={e => setNewLeadManager(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Monthly Quota (€/mo)</label>
                <input 
                  type="number" min="1000" max="1000000" value={newQuota} onChange={e => setNewQuota(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Conversion target (%)</label>
                <input 
                  type="number" min="0.1" max="100" step="0.1" value={newConversion} onChange={e => setNewConversion(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Marketing Pipeline Spend (€/mo)</label>
              <input 
                type="number" min="100" max="500000" value={newMarketing} onChange={e => setNewMarketing(Number(e.target.value))}
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
                Register Region
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
