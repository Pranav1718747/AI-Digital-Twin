"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Headphones, Search, RefreshCw, BarChart4, DollarSign, 
  Award, Briefcase, Plus, Sparkles, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, MessageSquare, Percent
} from "lucide-react";
import { api } from "@/lib/api";

interface SupportChannel {
  id: string;
  name: string;
  channel_lead: string;
  assigned_agents: number; 
  monthly_ticket_volume: number; 
  sla_response_target: number; // minutes
  tooling_budget: number; // EUR/mo
}

interface ActionHistoryItem {
  id: string;
  timestamp: string;
  action: string; 
  channelName: string;
  details: string;
}

export default function CustomerSupportSimulator() {
  // Baseline Support Channels State
  const [channels, setChannels] = useState<SupportChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom modifiers
  const [targetCSATScore, setTargetCSATScore] = useState(85); // 85% CSAT target baseline
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
  const [newAgents, setNewAgents] = useState(3);
  const [newVolume, setNewVolume] = useState(1200);
  const [newSla, setNewSla] = useState(45);

  // Load baseline support configurations
  useEffect(() => {
    setIsLoading(true);
    const baselineChannels: SupportChannel[] = [
      { id: "chan-chat", name: "Tier 1 Chat & Chatbots", channel_lead: "Sarah Connor", assigned_agents: 6, monthly_ticket_volume: 4500, sla_response_target: 5, tooling_budget: 3500 },
      { id: "chan-email", name: "Tier 2 Helpdesk Email Support", channel_lead: "John Doe", assigned_agents: 4, monthly_ticket_volume: 2200, sla_response_target: 60, tooling_budget: 2000 },
      { id: "chan-phone", name: "Tier 3 VIP Phone Calls", channel_lead: "Charlie Davis", assigned_agents: 3, monthly_ticket_volume: 600, sla_response_target: 10, tooling_budget: 1500 },
      { id: "chan-self", name: "Self-Service Portal & KB", channel_lead: "Grace Hopper", assigned_agents: 1, monthly_ticket_volume: 8000, sla_response_target: 1, tooling_budget: 4500 },
      { id: "chan-forum", name: "Discord & Social Channels", channel_lead: "Ada Lovelace", assigned_agents: 2, monthly_ticket_volume: 1800, sla_response_target: 120, tooling_budget: 1000 }
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
      if (c.id === "chan-chat") return { ...c, assigned_agents: 6, monthly_ticket_volume: 4500, sla_response_target: 5, tooling_budget: 3500 };
      if (c.id === "chan-email") return { ...c, assigned_agents: 4, monthly_ticket_volume: 2200, sla_response_target: 60, tooling_budget: 2000 };
      if (c.id === "chan-phone") return { ...c, assigned_agents: 3, monthly_ticket_volume: 600, sla_response_target: 10, tooling_budget: 1500 };
      if (c.id === "chan-self") return { ...c, assigned_agents: 1, monthly_ticket_volume: 8000, sla_response_target: 1, tooling_budget: 4500 };
      if (c.id === "chan-forum") return { ...c, assigned_agents: 2, monthly_ticket_volume: 1800, sla_response_target: 120, tooling_budget: 1000 };
      return c;
    }).filter(Boolean) as SupportChannel[]);
    setActionHistory([]);
    setTargetCSATScore(85);
    setAiAutomationOffset(0.0);
    setAiInsights("");
  };

  // Adjust Headcount
  const adjustAgents = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.assigned_agents;
        const newVal = Math.max(1, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Agents Dispatched" : "Agents Recalled",
            channelName: c.name,
            details: `${label}: Assigned support coverage changed from ${originalVal} reps to ${newVal} reps (Shift: ${deltaVal >= 0 ? "+" : ""}${deltaVal}).`
          },
          ...hist
        ]);

        return { ...c, assigned_agents: newVal };
      }
      return c;
    }));
  };

  // Adjust SLA minutes
  const adjustSLA = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.sla_response_target;
        const newVal = Math.max(1, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor < 1 ? "SLA Tightened" : "SLA Relaxed",
            channelName: c.name,
            details: `${label}: Target SLA response window changed from ${originalVal} min to ${newVal} min.`
          },
          ...hist
        ]);

        return { ...c, sla_response_target: newVal };
      }
      return c;
    }));
  };

  // Adjust Tooling Budget
  const adjustTooling = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.tooling_budget;
        const newVal = Math.max(200, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Tooling Upgraded" : "Tooling Restructured",
            channelName: c.name,
            details: `${label}: Chat/Helpdesk software tooling budget configured from €${originalVal.toLocaleString()} to €${newVal.toLocaleString()} (Shift: €${deltaVal.toLocaleString()}).`
          },
          ...hist
        ]);

        return { ...c, tooling_budget: newVal };
      }
      return c;
    }));
  };

  // Adjust Monthly Ticket Volume
  const adjustVolume = (id: string, factor: number, label: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const originalVal = c.monthly_ticket_volume;
        const newVal = Math.max(100, Math.round(originalVal * factor));
        const deltaVal = newVal - originalVal;
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: factor > 1 ? "Volume Spike" : "Volume Drop",
            channelName: c.name,
            details: `${label}: Incoming ticket volume shifted from ${originalVal.toLocaleString()} to ${newVal.toLocaleString()} tickets.`
          },
          ...hist
        ]);

        return { ...c, monthly_ticket_volume: newVal };
      }
      return c;
    }));
  };

  // CSAT target adjustment
  const handleCSATTargetChange = (val: number) => {
    const original = targetCSATScore;
    setTargetCSATScore(val);
    if (Math.abs(val - original) >= 1) {
      setActionHistory(hist => [
        {
          id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date().toLocaleTimeString(),
          action: "CSAT Goal Updated",
          channelName: "Quality Assurance",
          details: `Global company target Customer Satisfaction (CSAT) score updated to ${val}%.`
        } as any,
        ...hist
      ]);
    }
  };

  // Add custom channel
  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim() || !newLead.trim()) return;

    const newC: SupportChannel = {
      id: `sandbox-chan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newChannelName.trim(),
      channel_lead: newLead.trim(),
      assigned_agents: newAgents,
      monthly_ticket_volume: newVolume,
      sla_response_target: newSla,
      tooling_budget: 1500
    };

    setChannels(prev => [...prev, newC]);
    setActionHistory(hist => [
      {
        id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "Channel Added",
        channelName: newChannelName.trim(),
        details: `Simulated a new support tier setup with agents: ${newAgents}, Ticket Volume: ${newVolume}.`
      },
      ...hist
    ]);

    // Reset Form
    setNewChannelName("");
    setNewLead("");
    setNewAgents(3);
    setNewVolume(1200);
    setNewSla(45);
    setShowAddModal(false);
  };

  // Compile totals & calculations
  const stats = useMemo(() => {
    const originalChannels = [
      { agents: 6, volume: 4500, sla: 5, tooling: 3500 },
      { agents: 4, volume: 2200, sla: 60, tooling: 2000 },
      { agents: 3, volume: 600, sla: 10, tooling: 1500 },
      { agents: 1, volume: 8000, sla: 1, tooling: 4500 },
      { agents: 2, volume: 1800, sla: 120, tooling: 1000 }
    ];

    const baseAgentsSum = originalChannels.reduce((sum, c) => sum + c.agents, 0);
    const baseTicketsSum = originalChannels.reduce((sum, c) => sum + c.volume, 0);
    
    // Average baseline response time (minutes)
    const baseFRT = originalChannels.reduce((sum, c) => {
      const frt = (c.volume / (c.agents * 15)) * (2000 / c.tooling);
      return sum + frt;
    }, 0) / originalChannels.length;

    // Baseline CSAT index
    const baseCSAT = 83;

    // Simulated values
    const simulatedAgentsSum = channels.reduce((sum, c) => sum + c.assigned_agents, 0);
    const simulatedTicketsSum = channels.reduce((sum, c) => sum + c.monthly_ticket_volume, 0);

    // Simulated FRT response time (minutes)
    const simulatedFRT = channels.reduce((sum, c) => {
      // response time is high if agent count is too low relative to volume
      const staffShortage = c.monthly_ticket_volume / (c.assigned_agents * 18);
      const toolingRatio = 2000 / c.tooling_budget;
      let frt = staffShortage * toolingRatio * (1.0 - aiAutomationOffset * 0.4);
      return sum + Math.max(1, frt);
    }, 0) / (channels.length || 1);

    // CSAT calculation based on response speed vs SLA targets
    let finalCSAT = 83;
    const frtDelta = baseFRT - simulatedFRT;
    finalCSAT += Math.round(frtDelta * 0.4);
    
    // SLA breach penalties
    channels.forEach(c => {
      const channelFRT = (c.monthly_ticket_volume / (c.assigned_agents * 18)) * (2000 / c.tooling_budget) * (1.0 - aiAutomationOffset * 0.4);
      if (channelFRT > c.sla_response_target) {
        finalCSAT -= 3; // breach penalty
      }
    });

    finalCSAT = Math.max(10, Math.min(100, finalCSAT));
    const csatDelta = finalCSAT - baseCSAT;

    // Health Score %
    let healthScore = 80;
    healthScore += csatDelta * 1.5;
    if (finalCSAT < targetCSATScore) healthScore -= 15;
    healthScore = Math.max(10, Math.min(100, healthScore));

    return {
      baseAgentsSum,
      simulatedAgentsSum,
      baseTicketsSum,
      simulatedTicketsSum,
      baseFRT: Math.round(baseFRT),
      simulatedFRT: Math.round(simulatedFRT),
      baseCSAT,
      simulatedCSAT: finalCSAT,
      delta: csatDelta,
      healthScore
    };
  }, [channels, targetCSATScore, aiAutomationOffset]);

  // Compute 12-month timeline for CSAT trend curve
  const timelineData = useMemo(() => {
    const timeline = [];
    const base = stats.baseCSAT;
    const sim = stats.simulatedCSAT;

    for (let m = 1; m <= 12; m++) {
      // Baseline seasonal CSAT noise
      const baseNoise = Math.sin(m / 1.5) * 1.5;
      const baseVal = base + baseNoise;

      // Simulated CSAT curve
      const adjustment = m <= 4 ? (sim - base) * (m / 4) : (sim - base);
      const simNoise = Math.cos(m / 2.2) * 1.2;
      const simVal = base + adjustment + simNoise;

      timeline.push({
        month: m,
        baseline: Math.round(baseVal),
        simulated: Math.round(simVal)
      });
    }
    return timeline;
  }, [stats]);

  // Render Bezier CSAT velocity chart
  const renderCSATChart = () => {
    const width = 500;
    const height = 240;

    const allVals = [
      ...timelineData.map(d => d.baseline),
      ...timelineData.map(d => d.simulated)
    ];
    const maxVal = Math.max(...allVals) + 8;
    const minVal = Math.min(...allVals) - 8;
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

  // Call OpenRouter API for Support consequence insights
  const generateAISupportInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsError("");
    try {
      const payload = {
        initial_metrics: {
          total_employees: stats.baseAgentsSum,
          total_revenue_arr: 5000000,
          total_opex_monthly: 320000,
          total_profit_monthly: stats.baseFRT,
          company_health_score: 83,
          employee_satisfaction: 80,
          customer_satisfaction: stats.baseCSAT,
          risk_score: 10,
          productivity: 83,
          delivery_speed: 83
        },
        simulated_metrics: {
          total_employees: stats.simulatedAgentsSum,
          total_revenue_arr: 5000000,
          total_opex_monthly: 320000,
          total_profit_monthly: stats.simulatedFRT,
          company_health_score: stats.healthScore,
          employee_satisfaction: Math.max(10, Math.min(100, Math.round(80 + (stats.delta * 2)))),
          customer_satisfaction: stats.simulatedCSAT,
          risk_score: Math.max(5, Math.min(95, 10 - Math.round(stats.delta))),
          productivity: 83,
          delivery_speed: 83
        }
      };

      const res = await api.post("/simulation/insights", payload);
      setAiInsights(res.data.insights || "");
    } catch (err: any) {
      console.error("Failed to generate AI Support insights.", err);
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
            <Headphones className="text-indigo-400" size={24} /> Customer Support Simulator Sandbox
          </h1>
          <p className="text-gray-400 text-sm">
            Adjust support tier headcounts, SLA target times, monthly tickets, and AI assistants. Model First Response Times and CSAT scores.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Add Sandbox Support Tier
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
        
        {/* Left Side: Channel headcounts (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text" placeholder="Search support channels by tier name or manager..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="glass-panel py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="animate-spin text-indigo-400" size={32} />
              <span className="text-sm text-gray-400">Loading support platform tiers...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredChannels.map(c => {
                const isBreachingSLA = Math.round((c.monthly_ticket_volume / (c.assigned_agents * 18)) * (2000 / c.tooling_budget)) > c.sla_response_target;
                return (
                  <div key={c.id} className="glass-panel p-5 border border-white/5 hover:border-indigo-500/30 transition-all">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <MessageSquare size={14} className="text-indigo-400" /> {c.name}
                        </h3>
                        <span className="text-xs text-gray-400 block mt-0.5">
                          Support Lead: <span className="text-gray-300 font-medium">{c.channel_lead}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Monthly Tickets</span>
                        <span className="text-sm font-bold text-white">{c.monthly_ticket_volume.toLocaleString()} tickets</span>
                      </div>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 border-t border-white/5 pt-4">
                      
                      {/* Assigned Agents */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Support Reps</span>
                        <span className="text-xs font-bold text-white block">{c.assigned_agents} FTEs</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustAgents(c.id, 0.80, "Agents reduced")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -1 Agent
                          </button>
                          <button
                            onClick={() => adjustAgents(c.id, 1.25, "Agents deployed")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +1 Agent
                          </button>
                        </div>
                      </div>

                      {/* SLA Response Limit */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">SLA Window</span>
                        <span className={`text-xs font-bold block ${isBreachingSLA ? "text-red-400" : "text-white"}`}>
                          {c.sla_response_target} min {isBreachingSLA && "⚠️"}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustSLA(c.id, 0.80, "Tighten SLA target")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            Tighten
                          </button>
                          <button
                            onClick={() => adjustSLA(c.id, 1.25, "Relax SLA target")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            Relax
                          </button>
                        </div>
                      </div>

                      {/* Tooling spend */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Tooling Spend</span>
                        <span className="text-xs font-bold text-white block">€{c.tooling_budget.toLocaleString()}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustTooling(c.id, 0.80, "Reduce licenses")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -20%
                          </button>
                          <button
                            onClick={() => adjustTooling(c.id, 1.20, "License upgrades")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            +20%
                          </button>
                        </div>
                      </div>

                      {/* Ticket Volume */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Incoming Volume</span>
                        <span className="text-xs font-bold text-white block">{c.monthly_ticket_volume} tix</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => adjustVolume(c.id, 0.90, "Ticket volume cut")}
                            className="flex-1 py-0.5 border border-white/10 hover:bg-white/5 text-gray-400 text-[9px] font-bold rounded cursor-pointer"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => adjustVolume(c.id, 1.10, "Ticket volume raise")}
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
              Support Performance Summary
            </h3>

            {/* Main monthly closed ARR metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Avg First Response Time</span>
                <span className="text-lg font-bold text-white mt-1 block">{stats.simulatedFRT} min</span>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Simulated CSAT Score</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">{stats.simulatedCSAT}% CSAT</span>
              </div>
            </div>

            {/* CSAT Delta Counter */}
            <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Satisfaction CSAT Shift</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-2xl font-bold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {stats.delta >= 0 ? "+" : ""}{stats.delta.toLocaleString()}% CSAT
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    stats.delta >= 0 ? "text-green-400 border-green-500/20 bg-green-500/10" : "text-red-400 border-red-500/20 bg-red-500/10"
                  }`}>
                    {stats.delta >= 0 ? "SATISFACTION" : "FRUSTRATION"}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-white/5 ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                <Zap size={22} />
              </div>
            </div>

            {/* csat target slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Target CSAT Threshold Goal</span>
                <span className="text-white font-semibold">{targetCSATScore}%</span>
              </div>
              <input 
                type="range" min="70" max="98" step="1" 
                value={targetCSATScore} onChange={e => handleCSATTargetChange(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-gray-500">
                Increasing CSAT targets requires corresponding improvements in response SLA velocities.
              </p>
            </div>

            {/* Edge-to-Edge SVG lead Curve */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-2xs font-semibold text-gray-400 flex items-center gap-1">
                <Headphones size={14} className="text-gray-500" /> 12-Month Customer Satisfaction Trend
              </span>
              <div className="w-full h-64 bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-center">
                {renderCSATChart()}
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#319795] rounded-full inline-block"></span> Baseline CSAT</span>
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
              <span className="flex items-center gap-1.5"><Sparkles className="text-indigo-400" size={18} /> Strategic Support: Before vs. After</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-2xs">
              {/* Baseline */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-teal-400 block border-b border-white/5 pb-1 uppercase tracking-wider">Before (Baseline)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Assigned Reps:</span>
                    <span className="font-semibold text-white">{stats.baseAgentsSum} FTEs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average CSAT:</span>
                    <span className="font-semibold text-white">{stats.baseCSAT}% CSAT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response Time:</span>
                    <span className="font-semibold text-white">{stats.baseFRT} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total tickets:</span>
                    <span className="font-semibold text-white">{stats.baseTicketsSum.toLocaleString()} tix</span>
                  </div>
                </div>
              </div>

              {/* Simulated */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-indigo-400 block border-b border-white/5 pb-1 uppercase tracking-wider">After (Simulated)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Assigned Reps:</span>
                    <span className="font-semibold text-white">{stats.simulatedAgentsSum} FTEs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average CSAT:</span>
                    <span className={`font-semibold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {stats.simulatedCSAT}% CSAT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response Time:</span>
                    <span className="font-semibold text-white">{stats.simulatedFRT} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total tickets:</span>
                    <span className="font-semibold text-white">{stats.simulatedTicketsSum.toLocaleString()} tix</span>
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
                  onClick={generateAISupportInsights}
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
                  Click the button above to generate a custom OpenRouter AI analysis of this specific customer support tier scenario.
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
              <Plus className="text-indigo-400" size={20} /> Add Sandbox Support Tier
            </h3>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Support Tier / Channel Name</label>
              <input 
                type="text" required placeholder="e.g. Tier 4 Senior Solutions Architect Phone Calls"
                value={newChannelName} onChange={e => setNewChannelName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">Tier Team Lead Manager</label>
              <input 
                type="text" required placeholder="e.g. John Doe"
                value={newLead} onChange={e => setNewLead(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Rep Coverage (FTEs)</label>
                <input 
                  type="number" min="1" max="100" value={newAgents} onChange={e => setNewAgents(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Monthly Ticket Volume</label>
                <input 
                  type="number" min="10" max="100000" value={newVolume} onChange={e => setNewVolume(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs text-gray-400 mb-1">SLA Response Window target (minutes)</label>
              <input 
                type="number" min="1" max="1440" value={newSla} onChange={e => setNewSla(Number(e.target.value))}
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
                Add Tier
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
