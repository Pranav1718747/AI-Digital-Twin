"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { 
  Network, Users, FolderKanban, Activity, ShieldCheck, 
  Brain, Coins, TrendingUp, Sparkles, Plus, Trash2, 
  Layers, UsersRound, CalendarDays, RefreshCw, BarChart4
} from "lucide-react";
import { api } from "@/lib/api";
import { runBusinessSimulation, SimulatedEmployee, SimulationResult, SimulationSettings } from "@/lib/simulationEngine";

const SimulatedGraphExplorer = dynamic(() => import("@/components/SimulatedGraphExplorer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] bg-white/5 border border-white/5 rounded-lg flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

interface SavedScenario {
  id: string;
  name: string;
  settings: SimulationSettings;
  result: SimulationResult;
}

export default function Dashboard() {
  // Mode selection: "production" vs "simulation"
  const [activeTab, setActiveTab] = useState<"production" | "simulation">("production");

  // Baseline employees from API
  const [employees, setEmployees] = useState<SimulatedEmployee[]>([]);
  const [isEmpLoading, setIsEmpLoading] = useState(true);

  // Simulation Sliders / Settings
  const [marketing, setMarketing] = useState(100000);
  const [research, setResearch] = useState(50000);
  const [cybersecurity, setCybersecurity] = useState(30000);
  const [training, setTraining] = useState(15000);
  const [csm, setCsm] = useState(25000);
  const [automationLevel, setAutomationLevel] = useState(0.0);
  const [salaryMultiplier, setSalaryMultiplier] = useState(1.0);
  const [timelineMonths, setTimelineMonths] = useState(12);
  const [chartTab, setChartTab] = useState<"finance" | "sentiment" | "productivity">("finance");

  // Hiring adjustments
  const [hiredEng, setHiredEng] = useState(0);
  const [hiredSupport, setHiredSupport] = useState(0);
  const [terminatedEng, setTerminatedEng] = useState(0);
  const [terminatedSupport, setTerminatedSupport] = useState(0);

  // Saved scenarios in localStorage
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [scenarioNameInput, setScenarioNameInput] = useState("");

  // AI insights state
  const [insights, setInsights] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Fetch real employee database list as simulation baseline
  useEffect(() => {
    async function loadEmployees() {
      setIsEmpLoading(true);
      try {
        const response = await api.get<any>("/employees", {
          params: { page: 1, page_size: 100 },
        });
        const items = response.data.items || [];
        
        // Map PG models to Simulation models
        const mapped: SimulatedEmployee[] = items.map((emp: any) => {
          // Estimate base salary: €250 billable rate * 1600 = €400k (or standard role average if missing)
          const baseRate = emp.billable_rate_eur || 150;
          const salary = baseRate * 1600;
          
          return {
            id: emp.id,
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            role_title: emp.role_title,
            department_id: emp.department_id || 'eng_dept',
            manager_id: emp.manager_id || undefined,
            status: 'Active',
            billable_rate_eur: baseRate,
            salary: salary,
            experience_years: 5,
            skill_level: 'Mid',
            performance_score: 80,
            productivity: 80,
            burnout_score: 40,
            satisfaction_score: 80,
            ai_automation_risk: 15,
            promotion_status: 'Standard',
            training_hours: 0
          };
        });
        setEmployees(mapped);
      } catch (err) {
        console.error("Failed to load employees for simulation baseline. Using mocks.", err);
        // Fallback to standard seeded employees structure if backend is not seeded
        const mocks: SimulatedEmployee[] = Array.from({ length: 8 }).map((_, i) => ({
          id: `mock-${i}`,
          first_name: `Employee`,
          last_name: `${i + 1}`,
          email: `employee${i + 1}@company.com`,
          role_title: i === 0 ? "Chief Executive Officer" : "Software Developer",
          department_id: i === 0 ? "hr_dept" : "eng_dept",
          status: 'Active',
          billable_rate_eur: 150,
          salary: 85000,
          experience_years: 4,
          skill_level: 'Mid',
          performance_score: 80,
          productivity: 80,
          burnout_score: 40,
          satisfaction_score: 80,
          ai_automation_risk: 20,
          promotion_status: 'Standard',
          training_hours: 0
        }));
        setEmployees(mocks);
      } finally {
        setIsEmpLoading(false);
      }
    }
    loadEmployees();
  }, []);

  // Load saved scenarios from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sentinelos_scenarios");
    if (stored) {
      try {
        setSavedScenarios(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored scenarios", e);
      }
    }
  }, []);

  // Recalculate simulation state dynamically on inputs update
  const simSettings: SimulationSettings = useMemo(() => ({
    marketing_investment: marketing,
    research_budget: research,
    cybersecurity_budget: cybersecurity,
    training_budget: training,
    customer_success_budget: csm,
    ai_automation_level: automationLevel,
    salary_multiplier: salaryMultiplier,
    timeline_months: timelineMonths
  }), [marketing, research, cybersecurity, training, csm, automationLevel, salaryMultiplier, timelineMonths]);

  // Adjust baseline employees for in-sandbox hires/terminations
  const adjustedEmployees: SimulatedEmployee[] = useMemo(() => {
    let list = [...employees];
    
    // Process sandbox terminations: mark specified employees as terminated
    let countEngTerminated = 0;
    let countSupportTerminated = 0;
    
    list = list.map(emp => {
      if (emp.role_title.toLowerCase().includes("engineer") || emp.role_title.toLowerCase().includes("developer")) {
        if (countEngTerminated < terminatedEng) {
          countEngTerminated++;
          return { ...emp, status: 'Terminated' as const };
        }
      }
      if (emp.role_title.toLowerCase().includes("support") || emp.role_title.toLowerCase().includes("success")) {
        if (countSupportTerminated < terminatedSupport) {
          countSupportTerminated++;
          return { ...emp, status: 'Terminated' as const };
        }
      }
      return emp;
    });

    // Process sandbox hires: push new mock employee configurations
    for (let i = 0; i < hiredEng; i++) {
      list.push({
        id: `sandbox-hire-eng-${i}-${Date.now()}`,
        first_name: `Eng-Hire`,
        last_name: `${i + 1}`,
        email: `eng.hire${i + 1}@company.com`,
        role_title: "Software Engineer",
        department_id: "eng_dept",
        status: 'Active',
        billable_rate_eur: 150,
        salary: 90000,
        experience_years: 3,
        skill_level: 'Mid',
        performance_score: 80,
        productivity: 85,
        burnout_score: 30,
        satisfaction_score: 85,
        ai_automation_risk: 10,
        promotion_status: 'Standard',
        training_hours: 0
      });
    }

    for (let i = 0; i < hiredSupport; i++) {
      list.push({
        id: `sandbox-hire-sup-${i}-${Date.now()}`,
        first_name: `CS-Hire`,
        last_name: `${i + 1}`,
        email: `cs.hire${i + 1}@company.com`,
        role_title: "Customer Support Specialist",
        department_id: "sales_dept",
        status: 'Active',
        billable_rate_eur: 100,
        salary: 60000,
        experience_years: 2,
        skill_level: 'Mid',
        performance_score: 80,
        productivity: 80,
        burnout_score: 30,
        satisfaction_score: 80,
        ai_automation_risk: 40,
        promotion_status: 'Standard',
        training_hours: 0
      });
    }

    return list;
  }, [employees, hiredEng, hiredSupport, terminatedEng, terminatedSupport]);

  // Compute final forecast timeline array
  const simulationResults: SimulationResult[] = useMemo(() => {
    if (employees.length === 0) return [];
    return runBusinessSimulation(adjustedEmployees, simSettings);
  }, [adjustedEmployees, simSettings, employees]);

  const currentSimResult = useMemo(() => {
    if (simulationResults.length === 0) return null;
    return simulationResults[simulationResults.length - 1];
  }, [simulationResults]);

  // Call the backend endpoint to compile AI Narrative insights
  const fetchAIInsights = async () => {
    if (!currentSimResult || employees.length === 0) return;
    setIsGeneratingInsights(true);
    setInsights("");

    // Baseline baseline mapping for comparison prompt
    const initialMetrics = {
      total_employees: employees.length,
      total_revenue_arr: 12500000,
      total_opex_monthly: 80000,
      total_profit_monthly: 90000,
      company_health_score: 78,
      productivity: 80,
      burnout_score: 40,
      employee_satisfaction: 80,
      customer_satisfaction: 82,
      delivery_speed: 100,
      risk_score: 40
    };

    try {
      const response = await api.post("/simulation/insights", {
        initial_metrics: initialMetrics,
        simulated_metrics: currentSimResult
      });
      setInsights(response.data.insights || "Analysis complete.");
    } catch (e) {
      console.error("Failed to generate AI insights:", e);
      setInsights("AI Insights currently unavailable. Please verify API key configurations.");
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Trigger insights automatically when sandbox settings stabilize (lazy load)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (activeTab === "simulation" && currentSimResult) {
        fetchAIInsights();
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [simSettings, hiredEng, hiredSupport, terminatedEng, terminatedSupport, activeTab]);

  // Saving Simulation scenarios to localStorage
  const handleSaveScenario = () => {
    if (!scenarioNameInput.trim() || !currentSimResult) return;
    
    const newScenario: SavedScenario = {
      id: `scenario-${Date.now()}`,
      name: scenarioNameInput.trim(),
      settings: { ...simSettings },
      result: { ...currentSimResult }
    };

    const updated = [...savedScenarios, newScenario];
    setSavedScenarios(updated);
    localStorage.setItem("sentinelos_scenarios", JSON.stringify(updated));
    setScenarioNameInput("");
  };

  const handleDeleteScenario = (id: string) => {
    const updated = savedScenarios.filter(s => s.id !== id);
    setSavedScenarios(updated);
    localStorage.setItem("sentinelos_scenarios", JSON.stringify(updated));
  };

  // Helper to determine color badge of company health score
  const getHealthColorClass = (score: number) => {
    if (score < 45) return "text-red-400 border-red-500/20 bg-red-500/10";
    if (score < 65) return "text-orange-400 border-orange-500/20 bg-orange-500/10";
    if (score < 80) return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
    return "text-green-400 border-green-500/20 bg-green-500/10";
  };

  // Reset sliders back to baseline
  const handleResetSandbox = () => {
    setMarketing(100000);
    setResearch(50000);
    setCybersecurity(30000);
    setTraining(15000);
    setAutomationLevel(0.0);
    setSalaryMultiplier(1.0);
    setHiredEng(0);
    setHiredSupport(0);
    setTerminatedEng(0);
    setTerminatedSupport(0);
  };

  // --- Render custom SVG line chart of forecasts ---
  const renderSVGChart = () => {
    if (simulationResults.length === 0) return null;

    const width = 500;
    const height = 150;
    const points = simulationResults.length;

    let line1Data: number[] = [];
    let line2Data: number[] = [];
    let line3Data: number[] = [];
    
    let color1 = "#3182CE"; // blue
    let color2 = "#38A169"; // green
    let color3 = "#E53E3E"; // red
    
    let gradId1 = "blueGrad";
    let gradId2 = "greenGrad";
    let gradId3 = "redGrad";

    if (chartTab === "finance") {
      line1Data = simulationResults.map(r => r.total_revenue_arr / 1000); // in k EUR
      line2Data = simulationResults.map(r => r.total_profit_monthly);
      line3Data = simulationResults.map(r => r.total_opex_monthly);
      color1 = "#3182CE"; // Revenue (ARR scaled)
      color2 = "#38A169"; // Profit
      color3 = "#DD6B20"; // OpEx
      gradId1 = "revGrad";
      gradId2 = "profitGrad";
      gradId3 = "opexGrad";
    } else if (chartTab === "sentiment") {
      line1Data = simulationResults.map(r => r.employee_satisfaction);
      line2Data = simulationResults.map(r => r.customer_satisfaction);
      line3Data = simulationResults.map(r => r.burnout_score);
      color1 = "#6366f1"; // Employee Sat
      color2 = "#ec4899"; // Customer Sat
      color3 = "#ECC94B"; // Burnout
      gradId1 = "empGrad";
      gradId2 = "custGrad";
      gradId3 = "burnGrad";
    } else { // productivity
      line1Data = simulationResults.map(r => r.productivity);
      line2Data = simulationResults.map(r => r.delivery_speed);
      line3Data = simulationResults.map(r => r.risk_score);
      color1 = "#319795"; // Productivity
      color2 = "#805AD5"; // Delivery
      color3 = "#E53E3E"; // Risk
      gradId1 = "prodGrad";
      gradId2 = "delGrad";
      gradId3 = "riskGrad";
    }

    // Helper to scale coordinates
    const allValues = [...line1Data, ...line2Data, ...line3Data];
    const maxVal = Math.max(...allValues);
    const minVal = Math.min(...allValues);
    const range = maxVal - minVal || 1;

    const getCoords = (data: number[]) => {
      return data.map((val, i) => {
        const x = (i / (points - 1)) * (width - 40) + 20;
        const y = height - ((val - minVal) / range) * (height - 40) - 20;
        return `${x},${y}`;
      }).join(" ");
    };

    const coords1 = getCoords(line1Data);
    const coords2 = getCoords(line2Data);
    const coords3 = getCoords(line3Data);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-gray-500">
        <defs>
          <linearGradient id={gradId1} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color1} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color1} stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id={gradId2} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color2} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color2} stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id={gradId3} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color3} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color3} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal gridlines */}
        <line x1="20" y1={height - 20} x2={width - 20} y2={height - 20} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="20" y1={height / 2} x2={width - 20} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="20" y1="20" x2={width - 20} y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        
        {/* Area paths */}
        <polygon points={`20,${height - 20} ${coords1} ${width - 20},${height - 20}`} fill={`url(#${gradId1})`} />
        <polygon points={`20,${height - 20} ${coords2} ${width - 20},${height - 20}`} fill={`url(#${gradId2})`} />
        <polygon points={`20,${height - 20} ${coords3} ${width - 20},${height - 20}`} fill={`url(#${gradId3})`} />

        {/* Line paths */}
        <polyline points={coords1} fill="none" stroke={color1} strokeWidth="2" />
        <polyline points={coords2} fill="none" stroke={color2} strokeWidth="2" />
        <polyline points={coords3} fill="none" stroke={color3} strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Selector Switch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Corporate Digital Twin Overview
          </h1>
          <p className="text-gray-400 text-sm">
            {activeTab === "production" 
              ? "Real-time telemetry and state analysis of your enterprise."
              : "What-If planning: Simulate cascading strategic consequences client-side."}
          </p>
        </div>
        
        <div className="flex bg-white/5 border border-white/5 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab("production")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "production" ? "bg-indigo-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
            }`}
          >
            Production Telemetry
          </button>
          <button 
            onClick={() => setActiveTab("simulation")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "simulation" ? "bg-amber-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles size={14} /> Simulation Sandbox
          </button>
        </div>
      </div>

      {activeTab === "production" ? (
        // =====================================================================
        // TAB: PRODUCTION MODE (Existing intact visual dashboard)
        // =====================================================================
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Total Employees", value: "8", change: "+12%", icon: Users, color: "text-blue-400" },
              { name: "Active Projects", value: "3", change: "+4%", icon: FolderKanban, color: "text-pink-400" },
              { name: "Graph Nodes", value: "24", change: "+210", icon: Network, color: "text-indigo-400" },
              { name: "Agent Queries", value: "450/hr", change: "+22%", icon: Activity, color: "text-emerald-400" },
            ].map((metric) => (
              <div key={metric.name} className="glass-card p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{metric.name}</p>
                    <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-white/5 ${metric.color}`}>
                    <metric.icon size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-emerald-400 font-medium">{metric.change}</span>
                  <span className="text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity & System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-4">Live Agent Reasoning</h3>
              <div className="space-y-4">
                {[
                  { time: "Just now", agent: "Sentinel-1", action: "Resolved complex query querying Neo4j and PostgreSQL." },
                  { time: "2 mins ago", agent: "RAG-Indexer", action: "Ingested 14 page SOC2 compliance PDF into Qdrant." },
                  { time: "15 mins ago", agent: "Graph-Sync", action: "Synchronized 24 new employee records from HR system." },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4 items-start p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-xs font-mono text-gray-500 w-20 pt-1">{activity.time}</div>
                    <div>
                      <div className="text-sm font-medium text-indigo-400">{activity.agent}</div>
                      <div className="text-sm text-gray-300 mt-1">{activity.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-white mb-4">Infrastructure Health</h3>
              <div className="space-y-6">
                {[
                  { name: "PostgreSQL 16", status: "Healthy", color: "bg-emerald-400", labelColor: "text-emerald-400" },
                  { name: "Neo4j Graph Database", status: "Healthy", color: "bg-emerald-400", labelColor: "text-emerald-400" },
                  { name: "Qdrant Vector Store", status: "Healthy", color: "bg-emerald-400", labelColor: "text-emerald-400" },
                  { name: "Celery Workers", status: "Healthy", color: "bg-emerald-400", labelColor: "text-emerald-400" },
                ].map((infra) => (
                  <div key={infra.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">{infra.name}</span>
                      <span className={`${infra.labelColor} font-medium`}>{infra.status}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className={`${infra.color} h-1.5 rounded-full`} style={{ width: '100%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        // =====================================================================
        // TAB: SIMULATION MODE (Fully interactive sandbox view)
        // =====================================================================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Sliders & Actions Panel (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Control Sliders Card */}
            <div className="glass-panel p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="text-amber-400" size={18} /> Financial & Budget Allocation Sliders
                </h3>
                <button 
                  onClick={handleResetSandbox}
                  className="px-2.5 py-1 text-xs border border-white/10 rounded-md hover:bg-white/5 text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Reset Inputs
                </button>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Marketing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Marketing Investment</span>
                    <span className="text-white font-semibold">€{marketing.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1000000" step="25000" 
                    value={marketing} onChange={e => setMarketing(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
                  />
                </div>

                {/* Research */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Product Research & Dev</span>
                    <span className="text-white font-semibold">€{research.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1000000" step="25000" 
                    value={research} onChange={e => setResearch(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
                  />
                </div>

                {/* Cybersecurity */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Cybersecurity Budget</span>
                    <span className="text-white font-semibold">€{cybersecurity.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="0" max="500000" step="10000" 
                    value={cybersecurity} onChange={e => setCybersecurity(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
                  />
                </div>

                {/* Employee Training */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Employee Training Budget</span>
                    <span className="text-white font-semibold">€{training.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="0" max="500000" step="10000" 
                    value={training} onChange={e => setTraining(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
                  />
                </div>

                {/* Customer Success */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Customer Success Budget</span>
                    <span className="text-white font-semibold">€{csm.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="0" max="500000" step="10000" 
                    value={csm} onChange={e => setCsm(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
                  />
                </div>

                {/* Salary adjustments */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Salary Adjustments</span>
                    <span className="text-white font-semibold">{salaryMultiplier >= 1 ? `+${Math.round((salaryMultiplier - 1)*100)}%` : `-${Math.round((1 - salaryMultiplier)*100)}%`}</span>
                  </div>
                  <input 
                    type="range" min="0.8" max="1.3" step="0.05" 
                    value={salaryMultiplier} onChange={e => setSalaryMultiplier(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
                  />
                </div>

                {/* Timeline selector */}
                <div className="space-y-2">
                  <label className="block text-xs text-gray-400">Timeline Horizon</label>
                  <select 
                    value={timelineMonths} 
                    onChange={e => setTimelineMonths(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-2 py-1.5 outline-none focus:border-amber-500"
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months (1 Year)</option>
                    <option value="36">36 Months (3 Years)</option>
                    <option value="60">60 Months (5 Years)</option>
                  </select>
                </div>

                {/* AI Automation percentage */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Process Automation (AI)</span>
                    <span className="text-white font-semibold">{Math.round(automationLevel * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1.0" step="0.05" 
                    value={automationLevel} onChange={e => setAutomationLevel(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Staffing Modifications Card */}
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <UsersRound className="text-amber-400" size={18} /> Staffing Modifications Simulator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hire Staff */}
                <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/5">
                  <h4 className="text-xs font-semibold text-emerald-400">Add Staff / Hire Teams</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs text-gray-500 mb-1">Hire Engineers</label>
                      <input 
                        type="number" min="0" value={hiredEng} onChange={e => setHiredEng(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-2.5 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs text-gray-500 mb-1">Hire Support</label>
                      <input 
                        type="number" min="0" value={hiredSupport} onChange={e => setHiredSupport(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-2.5 py-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Terminate Staff */}
                <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/5">
                  <h4 className="text-xs font-semibold text-red-400">Reduce Staff / Layoffs</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs text-gray-500 mb-1">Fire Engineers</label>
                      <input 
                        type="number" min="0" value={terminatedEng} onChange={e => setTerminatedEng(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-2.5 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs text-gray-500 mb-1">Fire Support</label>
                      <input 
                        type="number" min="0" value={terminatedSupport} onChange={e => setTerminatedSupport(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-2.5 py-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario Comparative Panel */}
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <Layers className="text-amber-400" size={18} /> Scenario Comparative Matrix
              </h3>

              <div className="flex gap-2">
                <input 
                  type="text" placeholder="Enter Scenario Name (e.g. Scenario A)"
                  value={scenarioNameInput} onChange={e => setScenarioNameInput(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none"
                />
                <button 
                  onClick={handleSaveScenario}
                  disabled={!scenarioNameInput.trim()}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-white/10 disabled:text-gray-500 text-white text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
                >
                  <Plus size={14} /> Save Scenario
                </button>
              </div>

              {savedScenarios.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-2xs">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-400">
                        <th className="py-2">Scenario Name</th>
                        <th className="py-2">Employees</th>
                        <th className="py-2">ARR Forecast</th>
                        <th className="py-2">Monthly OpEx</th>
                        <th className="py-2">Monthly Profit</th>
                        <th className="py-2">Health</th>
                        <th className="py-2">CSAT</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedScenarios.map(s => (
                        <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 text-gray-300">
                          <td className="py-2 font-medium text-white">{s.name}</td>
                          <td className="py-2">{s.result.total_employees}</td>
                          <td className="py-2">€{s.result.total_revenue_arr.toLocaleString()}</td>
                          <td className="py-2">€{s.result.total_opex_monthly.toLocaleString()}</td>
                          <td className="py-2 font-medium text-emerald-400">€{s.result.total_profit_monthly.toLocaleString()}</td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 border rounded-full text-3xs ${getHealthColorClass(s.result.company_health_score)}`}>
                              {s.result.company_health_score}
                            </span>
                          </td>
                          <td className="py-2">{s.result.customer_satisfaction}%</td>
                          <td className="py-2">
                            <button 
                              onClick={() => handleDeleteScenario(s.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Visual Forecasts & AI Insights (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Projections Health Dial & KPIs */}
            {currentSimResult && (
              <div className="glass-panel p-6 space-y-6">
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">
                  Forecast Projections (Month {timelineMonths})
                </h3>

                {/* Health Score Gauge */}
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* SVG Radial Gauge */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <circle 
                        cx="56" cy="56" r="48" fill="none" 
                        stroke={
                          currentSimResult.company_health_score < 45 ? "#F87171" : 
                          currentSimResult.company_health_score < 65 ? "#FB923C" : 
                          currentSimResult.company_health_score < 80 ? "#FBBF24" : "#34D399"
                        }
                        strokeWidth="8" 
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - currentSimResult.company_health_score / 100)}
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-extrabold text-white">{currentSimResult.company_health_score}</span>
                      <p className="text-3xs text-gray-500 uppercase mt-0.5 tracking-wider">Health</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={`px-2 py-0.5 border rounded-full text-2xs font-semibold ${getHealthColorClass(currentSimResult.company_health_score)}`}>
                      {
                        currentSimResult.company_health_score < 45 ? "CRITICAL RISK" : 
                        currentSimResult.company_health_score < 65 ? "POOR PERFORMANCE" : 
                        currentSimResult.company_health_score < 80 ? "STABLE / AVERAGE" : "EXCELLENT HEALTH"
                      }
                    </span>
                  </div>
                </div>

                {/* Secondary KPIs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                    <span className="block text-3xs text-gray-500 uppercase tracking-wider">ARR Forecast</span>
                    <span className="text-lg font-bold text-white mt-1 block">€{currentSimResult.total_revenue_arr.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                    <span className="block text-3xs text-gray-500 uppercase tracking-wider">Monthly Profit</span>
                    <span className={`text-lg font-bold mt-1 block ${currentSimResult.total_profit_monthly >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {currentSimResult.total_profit_monthly < 0 ? "-" : ""}€{Math.abs(currentSimResult.total_profit_monthly).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                    <span className="block text-3xs text-gray-500 uppercase tracking-wider">Staff Burnout</span>
                    <span className="text-lg font-bold text-amber-400 mt-1 block">{currentSimResult.burnout_score}%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                    <span className="block text-3xs text-gray-500 uppercase tracking-wider">Customer Sat (CSAT)</span>
                    <span className="text-lg font-bold text-blue-400 mt-1 block">{currentSimResult.customer_satisfaction}%</span>
                  </div>
                </div>

                {/* Forecasted Curves Line Chart */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xs font-semibold text-gray-400 flex items-center gap-1">
                      <BarChart4 size={14} /> Forecast Trend Curve
                    </span>
                    
                    {/* Metric Selectors */}
                    <div className="flex bg-white/5 border border-white/5 p-0.5 rounded text-3xs">
                      <button 
                        onClick={() => setChartTab("finance")}
                        className={`px-2 py-0.5 rounded ${chartTab === "finance" ? "bg-amber-600/80 text-white" : "text-gray-400"}`}
                      >
                        Finance
                      </button>
                      <button 
                        onClick={() => setChartTab("sentiment")}
                        className={`px-2 py-0.5 rounded ${chartTab === "sentiment" ? "bg-amber-600/80 text-white" : "text-gray-400"}`}
                      >
                        Sentiment
                      </button>
                      <button 
                        onClick={() => setChartTab("productivity")}
                        className={`px-2 py-0.5 rounded ${chartTab === "productivity" ? "bg-amber-600/80 text-white" : "text-gray-400"}`}
                      >
                        Efficiency
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-32 bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-center">
                    {renderSVGChart()}
                  </div>

                  {/* Dynamic Legends */}
                  <div className="flex justify-center gap-4 text-3xs text-gray-500">
                    {chartTab === "finance" ? (
                      <>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#3182CE] rounded-full inline-block"></span> ARR Forecast</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#38A169] rounded-full inline-block"></span> Net Profit</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#DD6B20] rounded-full inline-block"></span> OpEx</span>
                      </>
                    ) : chartTab === "sentiment" ? (
                      <>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#6366f1] rounded-full inline-block"></span> Employee Sat</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#ec4899] rounded-full inline-block"></span> Customer Sat</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#ECC94B] rounded-full inline-block"></span> Burnout</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#319795] rounded-full inline-block"></span> Productivity</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#805AD5] rounded-full inline-block"></span> Delivery Speed</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#E53E3E] rounded-full inline-block"></span> Security Risk</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights Card */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Brain size={18} className="text-indigo-400" /> AI Executive Insights
                </h3>
                {isGeneratingInsights && <span className="text-3xs text-indigo-400 animate-pulse">Analyzing...</span>}
              </div>

              {isGeneratingInsights ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3 text-center">
                  <RefreshCw className="animate-spin text-indigo-400" size={24} />
                  <span className="text-xs text-gray-400">Synthesizing cascading trade-offs...</span>
                </div>
              ) : (
                <div className="space-y-3 text-xs leading-relaxed text-gray-300">
                  {insights ? (
                    <div className="space-y-2 whitespace-pre-line bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg text-indigo-300">
                      {insights}
                    </div>
                  ) : (
                    <span className="text-gray-500 italic block text-center py-6">
                      Adjust simulation settings to generate contextual AI summaries.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Simulated Org Tree Network Graph Card */}
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">
                Simulated Organization Topology
              </h3>
              <div className="w-full h-[340px]">
                <SimulatedGraphExplorer employees={adjustedEmployees} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
