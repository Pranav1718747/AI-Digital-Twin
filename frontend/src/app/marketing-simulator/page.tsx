"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Megaphone, Search, RefreshCw, BarChart4, DollarSign, 
  Award, Briefcase, Plus, Sparkles, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, Share2, Compass
} from "lucide-react";
import { api } from "@/lib/api";

interface MarketingChannel {
  id: string;
  name: string;
  channel_lead: string;
  monthly_spend: number; // EUR
  cost_per_lead: number; // EUR CPL
  brand_awareness_factor: number; // Multiplier
  ctr_rate: number; // % Click-Through-Rate
}

interface ActionHistoryItem {
  id: string;
  timestamp: string;
  action: string; 
  channelName: string;
  details: string;
}

export default function MarketingSimulator() {
  // Baseline Marketing Channels State
  const [channels, setChannels] = useState<MarketingChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom modifiers
  const [targetLeadQuota, setTargetLeadQuota] = useState(1200); // 1200 leads target baseline
  const [aiAutomationOffset, setAiAutomationOffset] = useState(0.0); // 0.0 to 1.0
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  
  // AI Insights State
  const [aiInsights, setAiInsights] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  // Custom Channel Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newLead, setNewLead] = useState("");
  const [newSpend, setNewSpend] = useState(15000);
  const [newCpl, setNewCpl] = useState(25);
  const [newCtr, setNewCtr] = useState(1.8);

  // Load baseline marketing configuration
  useEffect(() => {
    setIsLoading(true);
    const baselineChannels: MarketingChannel[] = [
      { id: "chan-sea", name: "Search Engine Ads (Google PPC)", channel_lead: "Sarah Connor", monthly_spend: 30000, cost_per_lead: 24, brand_awareness_factor: 1.1, ctr_rate: 2.4 },
      { id: "chan-social", name: "Paid Social Media (LinkedIn/Meta)", channel_lead: "John Doe", monthly_spend: 25000, cost_per_lead: 38, brand_awareness_factor: 1.3, ctr_rate: 1.8 },
      { id: "chan-organic", name: "SEO & Content Marketing", channel_lead: "Charlie Davis", monthly_spend: 12000, cost_per_lead: 15, brand_awareness_factor: 1.4, ctr_rate: 3.1 },
      { id: "chan-referral", name: "Referrals & Affiliate Partners", channel_lead: "Grace Hopper", monthly_spend: 8000, cost_per_lead: 12, brand_awareness_factor: 1.0, ctr_rate: 4.0 },
      { id: "chan-offline", name: "Offline Events & Webinars", channel_lead: "Ada Lovelace", monthly_spend: 15000, cost_per_lead: 45, brand_awareness_factor: 1.5, ctr_rate: 1.2 }
    ];
    setChannels(baselineChannels);
    setIsLoading(false);
  }, []);

  // Filter channels
  const filteredChannels = useMemo(() => {
    return channels.filter(c => {
      const matchQuery = `${c.name} ${c.channel_lead}`.toLowerCase();
      return matchQuery.includes(searchQuery.toLowerCase());
    });
  }, [channels, searchQuery]);

  // General Reset
  const handleResetSandbox = () => {
    setChannels(prev => prev.map(c => {
      if (c.id.startsWith("sandbox-chan")) return null;
      // Restore standard values
      if (c.id === "chan-sea") return { ...c, monthly_spend: 30000, cost_per_lead: 24, ctr_rate: 2.4, brand_awareness_factor: 1.1 };
      if (c.id === "chan-social") return { ...c, monthly_spend: 25000, cost_per_lead: 38, ctr_rate: 1.8, brand_awareness_factor: 1.3 };
      if (c.id === "chan-organic") return { ...c, monthly_spend: 12000, cost_per_lead: 15, ctr_rate: 3.1, brand_awareness_factor: 1.4 };
      if (c.id === "chan-referral") return { ...c, monthly_spend: 8000, cost_per_lead: 12, ctr_rate: 4.0, brand_awareness_factor: 1.0 };
      if (c.id === "chan-offline") return { ...c, monthly_spend: 15000, cost_per_lead: 45, ctr_rate: 1.2, brand_awareness_factor: 1.5 };
      return c;
    }).filter(Boolean) as MarketingChannel[]);
    setActionHistory([]);
    setTargetLeadQuota(1200);
    setAiAutomationOffset(0.0);
    setAiInsights("");
  };

  // Adjust Spend
  const adjustSpend = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.monthly_spend;
        const newVal = Math.max(1000, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Budget Boosted" : "Budget Scaled Back",
            channelName: c.name,
            details: `${label}: Monthly budget allocation shifted from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...c, monthly_spend: newVal };
      }
      return c;
    }));
  };

  // Adjust CPL
  const adjustCPL = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.cost_per_lead;
        const newVal = Math.max(1, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor < 1 ? "CPL Optimized" : "CPL Inflated",
            channelName: c.name,
            details: `${label}: Target cost per lead adjusted from €${originalVal} to €${newVal} (Shift: €${deltaVal}).`
          },
          ...hist
        ]);

        return { ...c, cost_per_lead: newVal };
      }
      return c;
    }));
  };

  // Adjust CTR
  const adjustCTR = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.ctr_rate;
        const newVal = Math.max(0.1, Number((originalVal * factor).toFixed(2)));
        const deltaVal = Number((newVal - originalVal).toFixed(2));
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "CTR Improved" : "CTR Decreased",
            channelName: c.name,
            details: `${label}: Click-through engagement adjusted from ${originalVal}% to ${newVal}% (Shift: ${deltaVal}%).`
          },
          ...hist
        ]);

        return { ...c, ctr_rate: newVal };
      }
      return c;
    }));
  };

  // Adjust Awareness
  const adjustAwareness = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.brand_awareness_factor;
        const newVal = Math.max(0.5, Number((originalVal * factor).toFixed(2)));
        const deltaVal = Number((newVal - originalVal).toFixed(2));
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Reach Multiplied" : "Reach Diminished",
            channelName: c.name,
            details: `${label}: Brand reach index shifted from ${originalVal}x to ${newVal}x.`
          },
          ...hist
        ]);

        return { ...c, brand_awareness_factor: newVal };
      }
      return c;
    }));
  };

  // Target Lead Quota adjustment
  const handleQuotaChange = (val: number) => {
    const original = targetLeadQuota;
    setTargetLeadQuota(val);
    if (Math.abs(val - original) >= 50) {
      setActionHistory(hist => [
        {
          id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date().toLocaleTimeString(),
          action: "Quota Adjusted",
          channelName: "Marketing Ops",
          details: `Global marketing monthly lead generation target quota configured at ${val} MQLs.`
        } as any,
        ...hist
      ]);
    }
  };

  // Add custom channel
  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim() || !newLead.trim()) return;

    const newC: MarketingChannel = {
      id: `sandbox-chan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newChannelName.trim(),
      channel_lead: newLead.trim(),
      monthly_spend: newSpend,
      cost_per_lead: newCpl,
      brand_awareness_factor: 1.0,
      ctr_rate: newCtr
    };

    setChannels(prev => [...prev, newC]);
    setActionHistory(hist => [
      {
        id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "Channel Added",
        channelName: newChannelName.trim(),
        details: `Simulated a new channel setup with monthly spend: €${newSpend.toLocaleString()}, Target CPL: €${newCpl}.`
      },
      ...hist
    ]);

    // Reset Form
    setNewChannelName("");
    setNewLead("");
    setNewSpend(15000);
    setNewCpl(25);
    setNewCtr(1.8);
    setShowAddModal(false);
  };

  // Compile totals & calculations
  const stats = useMemo(() => {
    const originalChannels = [
      { spend: 30000, cpl: 24, awareness: 1.1 },
      { spend: 25000, cpl: 38, awareness: 1.3 },
      { spend: 12000, cpl: 15, awareness: 1.4 },
      { spend: 8000, cpl: 12, awareness: 1.0 },
      { spend: 15000, cpl: 45, awareness: 1.5 }
    ];

    // Baseline leads calculation
    const baseMonthlyLeads = originalChannels.reduce((sum, c) => {
      const leads = (c.spend / c.cpl) * c.awareness;
      return sum + leads;
    }, 0);

    // Simulated monthly leads calculation
    const simulatedMonthlyLeads = channels.reduce((sum, c) => {
      // Leads = spend / CPL * awareness factor
      let leadsVal = (c.monthly_spend / c.cost_per_lead) * c.brand_awareness_factor;
      
      // CTR performance adjustment
      const ctrMultiplier = 1.0 + (c.ctr_rate - 2.0) * 0.1;
      leadsVal = leadsVal * Math.max(0.5, ctrMultiplier);

      return sum + leadsVal;
    }, 0);

    // AI Copy optimization automation boost
    const automationLeadsBoost = aiAutomationOffset * 250;
    const finalSimulatedLeads = simulatedMonthlyLeads + automationLeadsBoost;

    // Spending totals
    const baseSpendSum = originalChannels.reduce((sum, c) => sum + c.spend, 0);
    const simulatedSpendSum = channels.reduce((sum, c) => sum + c.monthly_spend, 0);

    // Average CPLs
    const baseAvgCPL = baseMonthlyLeads > 0 ? baseSpendSum / baseMonthlyLeads : 0;
    const simulatedAvgCPL = finalSimulatedLeads > 0 ? simulatedSpendSum / finalSimulatedLeads : 0;

    const leadsDelta = finalSimulatedLeads - baseMonthlyLeads;

    // Health Score %
    let healthScore = 80;
    healthScore += Math.round(leadsDelta / 25);
    if (finalSimulatedLeads < targetLeadQuota) healthScore -= 15; // quota missing penalty
    healthScore = Math.max(10, Math.min(100, healthScore));

    return {
      baseMonthlyLeads: Math.round(baseMonthlyLeads),
      simulatedMonthlyLeads: Math.round(finalSimulatedLeads),
      baseSpendSum,
      simulatedSpendSum,
      baseAvgCPL: Number(baseAvgCPL.toFixed(2)),
      simulatedAvgCPL: Number(simulatedAvgCPL.toFixed(2)),
      delta: Math.round(leadsDelta),
      healthScore
    };
  }, [channels, targetLeadQuota, aiAutomationOffset]);

  // Compute 12-month timeline for lead velocity trend curve
  const timelineData = useMemo(() => {
    const timeline = [];
    const base = stats.baseMonthlyLeads;
    const sim = stats.simulatedMonthlyLeads;

    for (let m = 1; m <= 12; m++) {
      // Baseline seasonal leads noise
      const baseNoise = Math.sin(m / 1.5) * 80;
      const baseVal = base + baseNoise;

      // Simulated leads curve
      const adjustment = m <= 4 ? (sim - base) * (m / 4) : (sim - base);
      const simNoise = Math.cos(m / 2.2) * 60;
      const simVal = base + adjustment + simNoise;

      timeline.push({
        month: m,
        baseline: Math.round(baseVal),
        simulated: Math.round(simVal)
      });
    }
    return timeline;
  }, [stats]);

  // Render Bezier lead velocity chart
  const renderLeadChart = () => {
    const width = 500;
    const height = 240;

    const allVals = [
      ...timelineData.map(d => d.baseline),
      ...timelineData.map(d => d.simulated)
    ];
    const maxVal = Math.max(...allVals) + 200;
    const minVal = Math.min(...allVals) - 200;
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

  // Call OpenRouter API for Marketing consequence insights
  const generateAIMarketingInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsError("");
    try {
      const payload = {
        initial_metrics: {
          total_employees: 18,
          total_revenue_arr: 5000000,
          total_opex_monthly: stats.baseSpendSum,
          total_profit_monthly: stats.baseMonthlyLeads,
          company_health_score: 80,
          employee_satisfaction: 80,
          customer_satisfaction: 80,
          risk_score: 10,
          productivity: 80,
          delivery_speed: 80
        },
        simulated_metrics: {
          total_employees: 18,
          total_revenue_arr: 5000000 + (stats.delta * 2000),
          total_opex_monthly: stats.simulatedSpendSum,
          total_profit_monthly: stats.simulatedMonthlyLeads,
          company_health_score: stats.healthScore,
          employee_satisfaction: Math.max(10, Math.min(100, Math.round(80 + (stats.delta / 50)))),
          customer_satisfaction: Math.max(10, Math.min(100, Math.round(80 + (stats.delta / 70)))),
          risk_score: Math.max(5, Math.min(95, 10 - Math.round(stats.delta / 100))),
          productivity: 80,
          delivery_speed: 80
        }
      };

      const res = await api.post("/simulation/insights", payload);
      setAiInsights(res.data.insights || "");
    } catch (err: any) {
      console.error("Failed to generate AI Marketing insights.", err);
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
            <Megaphone className="text-indigo-400" size={24} /> Marketing Simulator Sandbox
          </h1>
          <p className="text-gray-400 text-sm">
            Tune target channel advertising spends, engagement rates, and Cost Per Lead caps. Model incoming lead pipeline velocities.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Add Sandbox Marketing Channel
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
        
        {/* Left Side: Channel spends (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text" placeholder="Search marketing advertising channels by platform name or lead..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="glass-panel py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="animate-spin text-indigo-400" size={32} />
              <span className="text-sm text-gray-400">Loading ad platforms...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredChannels.map(c => {
                const estMonthlyLeads = Math.round((c.monthly_spend / c.cost_per_lead) * c.brand_awareness_factor);
                return (
                  <div key={c.id} className="glass-panel p-5 border border-white/5 hover:border-indigo-500/30 transition-all">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Share2 size={14} className="text-indigo-400" /> {c.name}
                        </h3>
                        <span className="text-xs text-gray-400 block mt-0.5">
                          Campaign Lead: <span className="text-gray-300 font-medium">{c.channel_lead}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Est. Monthly Leads</span>
                        <span className="text-sm font-bold text-white">{estMonthlyLeads.toLocaleString()} MQLs</span>
                      </div>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 border-t border-white/5 pt-4">
                      
                      {/* Monthly Spend */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Advertising Spend</span>
                        <span className="text-xs font-bold text-white block">€{c.monthly_spend.toLocaleString()}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustSpend(c.id, 0.90, "Budget cut")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustSpend(c.id, 1.10, "Budget raise")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Cost Per Lead */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Cost Per Lead (CPL)</span>
                        <span className="text-xs font-bold text-white block">€{c.cost_per_lead}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustCPL(c.id, 0.90, "Optimize bid CPL")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustCPL(c.id, 1.10, "Inflated bid CPL")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Click-Through Rate */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Engagement (CTR)</span>
                        <span className="text-xs font-bold text-white block">{c.ctr_rate}%</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustCTR(c.id, 0.90, "Engagement drop")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustCTR(c.id, 1.10, "Engagement boost")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      {/* Brand awareness */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Reach Multiplier</span>
                        <span className="text-xs font-bold text-white block">{c.brand_awareness_factor}x</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustAwareness(c.id, 0.90, "Reduce reach")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustAwareness(c.id, 1.10, "Optimize reach")}
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
              Marketing Performance Summary
            </h3>

            {/* Main monthly closed ARR metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Simulated Monthly Spend</span>
                <span className="text-lg font-bold text-white mt-1 block">€{stats.simulatedSpendSum.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Simulated Leads</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">{stats.simulatedMonthlyLeads.toLocaleString()} MQLs</span>
              </div>
            </div>

            {/* Leads Delta Counter */}
            <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Monthly Lead Velocity Shift</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-2xl font-bold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {stats.delta >= 0 ? "+" : ""}{stats.delta.toLocaleString()} leads/mo
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    stats.delta >= 0 ? "text-green-400 border-green-500/20 bg-green-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"
                  }`}>
                    {stats.delta >= 0 ? "ACCELERATION" : "DECELERATION"}
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
                <span className="text-gray-400">Monthly Lead Generation Target Quota</span>
                <span className="text-white font-semibold">{targetLeadQuota} MQLs</span>
              </div>
              <input 
                type="range" min="500" max="3000" step="50" 
                value={targetLeadQuota} onChange={e => handleQuotaChange(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-gray-500">
                Increasing targets changes cost-efficiency and leads-velocity requirements.
              </p>
            </div>

            {/* Edge-to-Edge SVG lead Curve */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-2xs font-semibold text-gray-400 flex items-center gap-1">
                <Megaphone size={14} className="text-gray-500" /> 12-Month Lead Generation Forecast
              </span>
              <div className="w-full h-64 bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-center">
                {renderLeadChart()}
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#319795] rounded-full inline-block"></span> Baseline leads</span>
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
              <span className="flex items-center gap-1.5"><Sparkles className="text-indigo-400" size={18} /> Strategic Marketing: Before vs. After</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-2xs">
              {/* Baseline */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-teal-400 block border-b border-white/5 pb-1 uppercase tracking-wider">Before (Baseline)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Monthly leads pool:</span>
                    <span className="font-semibold text-white">{stats.baseMonthlyLeads.toLocaleString()} MQLs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly ad spend:</span>
                    <span className="font-semibold text-white">€{stats.baseSpendSum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average CPL:</span>
                    <span className="font-semibold text-white">€{stats.baseAvgCPL}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MQL Target:</span>
                    <span className="font-semibold text-white">1200 MQLs</span>
                  </div>
                </div>
              </div>

              {/* Simulated */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-indigo-400 block border-b border-white/5 pb-1 uppercase tracking-wider">After (Simulated)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Monthly leads pool:</span>
                    <span className={`font-semibold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {stats.simulatedMonthlyLeads.toLocaleString()} MQLs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly ad spend:</span>
                    <span className="font-semibold text-white">€{stats.simulatedSpendSum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average CPL:</span>
                    <span className="font-semibold text-white">€{stats.simulatedAvgCPL}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MQL Target:</span>
                    <span className="font-semibold text-white">{targetLeadQuota} MQLs</span>
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
                  onClick={generateAIMarketingInsights}
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
                  Click the button above to generate a custom OpenRouter AI analysis of this specific marketing channel scenario.
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

      {/* CHANNEL ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddChannel}
            className="w-full max-w-md glass-panel p-6 space-y-4 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <Plus className="text-indigo-400" size={20} /> Add Sandbox Marketing Channel
            </h3>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Ad Platform / Channel Name</label>
              <input 
                type="text" required placeholder="e.g. YouTube PPC, Out of Home Billboards"
                value={newChannelName} onChange={e => setNewChannelName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Platform Manager / Lead</label>
              <input 
                type="text" required placeholder="e.g. John Doe"
                value={newLead} onChange={e => setNewLead(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Monthly Spend (€/mo)</label>
                <input 
                  type="number" min="1000" max="1000000" value={newSpend} onChange={e => setNewSpend(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Cost Per Lead CPL (€/lead)</label>
                <input 
                  type="number" min="1" max="5000" value={newCpl} onChange={e => setNewCpl(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Click-Through target CTR (%)</label>
              <input 
                type="number" min="0.1" max="100" step="0.1" value={newCtr} onChange={e => setNewCtr(Number(e.target.value))}
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
                Add Channel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
