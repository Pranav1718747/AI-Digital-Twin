"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Users, Search, UserMinus, UserPlus, RefreshCw, BarChart4, 
  Briefcase, DollarSign, Award, ThumbsUp, AlertTriangle, 
  Trash2, Plus, Sparkles, Zap, Activity
} from "lucide-react";
import { api } from "@/lib/api";

interface SimulatedWorker {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_title: string;
  department_id: string | null;
  billable_rate_eur: number;
  salary: number;
  status: "Active" | "Terminated";
  // Custom work contribution values
  tickets_completed_monthly: number;
  story_points_monthly: number;
  strategic_impact: "High" | "Medium" | "Low";
  productivity_score: number; // 0 - 100
  performance_score: number; // 0 - 100
}

interface ActionHistoryItem {
  id: string;
  timestamp: string;
  action: string; // "Hired" | "Terminated" | "Reinstated"
  employeeName: string;
  details: string;
}

export default function EmployeeSimulator() {
  const [employees, setEmployees] = useState<SimulatedWorker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // AI insights variables
  const [aiInsights, setAiInsights] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");
  
  // Simulation modifiers
  const [aiAutomationOffset, setAiAutomationOffset] = useState(0.0); // 0.0 to 1.0
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  
  // Custom new hire state variables
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newRole, setNewRole] = useState("Software Engineer");
  const [newRate, setNewRate] = useState(120);
  const [newProductivity, setNewProductivity] = useState(80);
  const [newImpact, setNewImpact] = useState<"High" | "Medium" | "Low">("Medium");

  // Load baseline employee database items on mount
  useEffect(() => {
    async function fetchBaseline() {
      setIsLoading(true);
      try {
        const response = await api.get<any>("/employees", {
          params: { page: 1, page_size: 100 },
        });
        const items = response.data.items || [];
        
        const enriched: SimulatedWorker[] = items.map((emp: any, i: number) => {
          const baseRate = emp.billable_rate_eur || 150;
          const salary = baseRate * 1600; // annual salary estimate
          
          // Seed realistic work contributions dynamically based on role titles
          const isCEO = emp.role_title.toLowerCase().includes("ceo") || emp.role_title.toLowerCase().includes("chief");
          const isLead = emp.role_title.toLowerCase().includes("director") || emp.role_title.toLowerCase().includes("lead") || emp.role_title.toLowerCase().includes("vp");
          
          let tickets = Math.round(15 + (i * 3) % 20);
          let points = Math.round(40 + (i * 7) % 50);
          let impact: "High" | "Medium" | "Low" = "Medium";
          let productivity = Math.round(75 + (i * 4) % 20);
          let performance = Math.round(80 + (i * 3) % 18);

          if (isCEO) {
            tickets = 5;
            points = 15;
            impact = "High";
            productivity = 95;
            performance = 98;
          } else if (isLead) {
            tickets = 10;
            points = 30;
            impact = "High";
            productivity = 90;
            performance = 92;
          } else if (emp.role_title.toLowerCase().includes("senior")) {
            tickets = 28;
            points = 85;
            impact = "High";
            productivity = 88;
            performance = 87;
          } else if (emp.role_title.toLowerCase().includes("director")) {
            impact = "High";
          }

          return {
            id: emp.id,
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            role_title: emp.role_title,
            department_id: emp.department_id,
            billable_rate_eur: baseRate,
            salary: salary,
            status: "Active",
            tickets_completed_monthly: tickets,
            story_points_monthly: points,
            strategic_impact: impact,
            productivity_score: productivity,
            performance_score: performance
          };
        });

        setEmployees(enriched);
      } catch (err) {
        console.error("Failed to load employees for simulation. Using robust mocks.", err);
        // Robust mocks fallback
        const mockRoles = [
          { title: "VP of Engineering", rate: 250, tickets: 8, points: 25, impact: "High" as const },
          { title: "Senior Software Architect", rate: 220, tickets: 22, points: 75, impact: "High" as const },
          { title: "Lead Software Developer", rate: 190, tickets: 35, points: 95, impact: "High" as const },
          { title: "Senior Software Developer", rate: 160, tickets: 30, points: 85, impact: "Medium" as const },
          { title: "Software Engineer II", rate: 130, tickets: 25, points: 70, impact: "Medium" as const },
          { title: "Junior DevOps Specialist", rate: 110, tickets: 20, points: 55, impact: "Low" as const },
          { title: "Product Support Specialist", rate: 90, tickets: 45, points: 60, impact: "Medium" as const },
          { title: "Director of Product", rate: 210, tickets: 10, points: 30, impact: "High" as const }
        ];

        const mocks: SimulatedWorker[] = mockRoles.map((role, i) => ({
          id: `mock-worker-${i}`,
          first_name: i === 0 ? "Sarah" : i === 1 ? "John" : i === 2 ? "Charlie" : `Employee`,
          last_name: i === 0 ? "Connor" : i === 1 ? "Doe" : i === 2 ? "Davis" : `${i + 1}`,
          email: `worker${i + 1}@company.com`,
          role_title: role.title,
          department_id: "eng_dept",
          billable_rate_eur: role.rate,
          salary: role.rate * 1600,
          status: "Active",
          tickets_completed_monthly: role.tickets,
          story_points_monthly: role.points,
          strategic_impact: role.impact,
          productivity_score: 80 + (i % 3) * 5,
          performance_score: 82 + (i % 2) * 8
        }));
        setEmployees(mocks);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBaseline();
  }, []);

  // Filter list based on search bar query
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchQuery = `${emp.first_name} ${emp.last_name} ${emp.role_title} ${emp.email}`.toLowerCase();
      return matchQuery.includes(searchQuery.toLowerCase());
    });
  }, [employees, searchQuery]);

  // Handle fire/termination
  const handleTerminateEmployee = (id: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        const time = new Date().toLocaleTimeString();
        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: "Terminated",
            employeeName: `${emp.first_name} ${emp.last_name}`,
            details: `Fired ${emp.role_title} (Contribution: ${emp.productivity_score}%, Impact: ${emp.strategic_impact}). Monthly payroll saved: €${Math.round(emp.salary / 12).toLocaleString()}.`
          },
          ...hist
        ]);
        return { ...emp, status: "Terminated" };
      }
      return emp;
    }));
  };

  // Handle rehire/reinstatement
  const handleRehireEmployee = (id: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        const time = new Date().toLocaleTimeString();
        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: "Reinstated",
            employeeName: `${emp.first_name} ${emp.last_name}`,
            details: `Reinstated ${emp.role_title} back to active staff status.`
          },
          ...hist
        ]);
        return { ...emp, status: "Active" };
      }
      return emp;
    }));
  };

  // Handle Promotion
  const handlePromoteEmployee = (id: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        let newTitle = emp.role_title;
        if (!newTitle.toLowerCase().includes("senior") && !newTitle.toLowerCase().includes("lead") && !newTitle.toLowerCase().includes("vp") && !newTitle.toLowerCase().includes("chief")) {
          newTitle = `Senior ${newTitle}`;
        } else if (newTitle.toLowerCase().includes("senior")) {
          newTitle = newTitle.replace(/senior/i, "Lead");
        } else if (newTitle.toLowerCase().includes("lead")) {
          newTitle = newTitle.replace(/lead/i, "Principal");
        }

        const time = new Date().toLocaleTimeString();
        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: "Promoted",
            employeeName: `${emp.first_name} ${emp.last_name}`,
            details: `Promoted to ${newTitle}. Productivity boosted to ${Math.min(100, emp.productivity_score + 10)}%.`
          },
          ...hist
        ]);

        return {
          ...emp,
          role_title: newTitle,
          productivity_score: Math.min(100, emp.productivity_score + 10),
          performance_score: Math.min(100, emp.performance_score + 8)
        };
      }
      return emp;
    }));
  };

  // Handle Demotion
  const handleDemoteEmployee = (id: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        let newTitle = emp.role_title;
        if (newTitle.toLowerCase().includes("senior")) {
          newTitle = newTitle.replace(/senior\s+/i, "");
        } else if (newTitle.toLowerCase().includes("lead")) {
          newTitle = newTitle.replace(/lead\s+/i, "Senior ");
        } else if (newTitle.toLowerCase().includes("principal")) {
          newTitle = newTitle.replace(/principal\s+/i, "Lead ");
        }

        const time = new Date().toLocaleTimeString();
        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: "Demoted",
            employeeName: `${emp.first_name} ${emp.last_name}`,
            details: `Demoted to ${newTitle}. Productivity dropped by 15% due to morale drop.`
          },
          ...hist
        ]);

        return {
          ...emp,
          role_title: newTitle,
          productivity_score: Math.max(10, emp.productivity_score - 15),
          performance_score: Math.max(10, emp.performance_score - 10)
        };
      }
      return emp;
    }));
  };

  // Handle Salary Increase
  const handleSalaryIncrease = (id: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        const newSalary = Math.round(emp.salary * 1.10);
        const newRate = Math.round(emp.billable_rate_eur * 1.10);
        const time = new Date().toLocaleTimeString();
        
        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: "Salary Raised",
            employeeName: `${emp.first_name} ${emp.last_name}`,
            details: `Raised salary by 10% (New Rate: €${newRate}/hr, Salary: €${Math.round(newSalary/12).toLocaleString()}/mo). Performance & motivation improved.`
          },
          ...hist
        ]);

        return {
          ...emp,
          salary: newSalary,
          billable_rate_eur: newRate,
          productivity_score: Math.min(100, emp.productivity_score + 5),
          performance_score: Math.min(100, emp.performance_score + 5)
        };
      }
      return emp;
    }));
  };

  // Handle Salary Cut
  const handleSalaryCut = (id: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        const newSalary = Math.round(emp.salary * 0.90);
        const newRate = Math.round(emp.billable_rate_eur * 0.90);
        const time = new Date().toLocaleTimeString();

        setActionHistory(hist => [
          {
            id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: time,
            action: "Salary Cut",
            employeeName: `${emp.first_name} ${emp.last_name}`,
            details: `Cut salary by 10% (New Rate: €${newRate}/hr). Productivity dropped by 20% due to severe morale loss.`
          },
          ...hist
        ]);

        return {
          ...emp,
          salary: newSalary,
          billable_rate_eur: newRate,
          productivity_score: Math.max(10, emp.productivity_score - 20),
          performance_score: Math.max(10, emp.performance_score - 15)
        };
      }
      return emp;
    }));
  };

  // Add custom simulated employee
  const handleAddSimulatedEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newLastName.trim()) return;

    const rateVal = newRate;
    const salaryVal = rateVal * 1600;
    
    // Seed contributions
    const tickets = Math.round(newProductivity / 3);
    const points = Math.round(newProductivity * 0.9);

    const newWorker: SimulatedWorker = {
      id: `sandbox-hire-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      first_name: newFirstName.trim(),
      last_name: newLastName.trim(),
      email: `${newFirstName.toLowerCase()}.${newLastName.toLowerCase()}@company-sandbox.com`,
      role_title: newRole,
      department_id: "eng_dept",
      billable_rate_eur: rateVal,
      salary: salaryVal,
      status: "Active",
      tickets_completed_monthly: tickets,
      story_points_monthly: points,
      strategic_impact: newImpact,
      productivity_score: newProductivity,
      performance_score: 80
    };

    setEmployees(prev => [...prev, newWorker]);
    setActionHistory(hist => [
      {
        id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "Hired",
        employeeName: `${newFirstName} ${newLastName}`,
        details: `Simulated hire as ${newRole} (Productivity: ${newProductivity}%, Rate: €${rateVal}/hr).`
      },
      ...hist
    ]);

    // Reset Form & Modal
    setNewFirstName("");
    setNewLastName("");
    setNewRole("Software Engineer");
    setNewRate(120);
    setNewProductivity(80);
    setNewImpact("Medium");
    setShowAddModal(false);
  };

  // Clean simulation logs
  const handleClearHistory = () => {
    setActionHistory([]);
  };

  // Reset sandbox back to original list
  const handleResetSandbox = () => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id.startsWith("sandbox-hire")) {
        // Remove simulated hires
        return null;
      }
      return { ...emp, status: "Active" };
    }).filter(Boolean) as SimulatedWorker[]);
    setActionHistory([]);
    setAiAutomationOffset(0.0);
  };

  // --- Recalculate simulation values dynamically ---
  const activeWorkers = useMemo(() => employees.filter(e => e.status === "Active"), [employees]);
  const terminatedWorkers = useMemo(() => employees.filter(e => e.status === "Terminated"), [employees]);

  const stats = useMemo(() => {
    const activeCount = activeWorkers.length;
    const baseCount = employees.filter(e => !e.id.startsWith("sandbox-hire")).length;
    
    // Average productivity baseline vs simulated
    const baselineProductivitySum = employees.filter(e => !e.id.startsWith("sandbox-hire")).reduce((sum, e) => sum + e.productivity_score, 0);
    const baselineAvg = employees.filter(e => !e.id.startsWith("sandbox-hire")).length > 0 ? baselineProductivitySum / baseCount : 80;

    // Simulated productivity calculation
    const activeProductivitySum = activeWorkers.reduce((sum, e) => sum + e.productivity_score, 0);
    let simulatedAvg = activeCount > 0 ? activeProductivitySum / activeCount : 0;
    
    // AI Automation mitigates lost productivity of missing workforce
    const workerDifference = Math.max(0, baseCount - activeCount);
    const automationOffset = workerDifference * (aiAutomationOffset * 25);
    simulatedAvg = Math.min(100, simulatedAvg + automationOffset);

    // Operational expenses saved dynamically
    const payrollOpexSavedMonthly = terminatedWorkers.reduce((sum, e) => sum + (e.salary / 12), 0);

    // Base vs Simulated Payroll totals
    const basePayroll = employees.filter(e => !e.id.startsWith("sandbox-hire")).reduce((sum, e) => sum + (e.salary / 12), 0);
    const simulatedPayroll = activeWorkers.reduce((sum, e) => sum + (e.salary / 12), 0);

    // Productivity delta
    const delta = simulatedAvg - baselineAvg;

    return {
      activeCount,
      baseCount,
      terminatedCount: terminatedWorkers.length,
      baselineAvg: Math.round(baselineAvg),
      simulatedAvg: Math.round(simulatedAvg),
      payrollOpexSavedMonthly: Math.round(payrollOpexSavedMonthly),
      basePayroll: Math.round(basePayroll),
      simulatedPayroll: Math.round(simulatedPayroll),
      delta: Math.round(delta)
    };
  }, [activeWorkers, terminatedWorkers, employees, aiAutomationOffset]);

  const generateAIConsequences = async () => {
    setIsGeneratingInsights(true);
    setInsightsError("");
    try {
      const payload = {
        initial_metrics: {
          total_employees: stats.baseCount,
          total_revenue_arr: 5000000,
          total_opex_monthly: stats.basePayroll,
          total_profit_monthly: 416666 - stats.basePayroll,
          company_health_score: 85,
          employee_satisfaction: 82,
          customer_satisfaction: 80,
          risk_score: 15,
          productivity: stats.baselineAvg,
          delivery_speed: stats.baselineAvg
        },
        simulated_metrics: {
          total_employees: stats.activeCount,
          total_revenue_arr: Math.round(5000000 + (stats.delta * 25000)),
          total_opex_monthly: stats.simulatedPayroll,
          total_profit_monthly: Math.round((416666 - stats.simulatedPayroll) + (stats.delta * 2000)),
          company_health_score: Math.max(10, Math.min(100, 85 + stats.delta)),
          employee_satisfaction: Math.max(10, Math.min(100, 82 + (stats.delta * 0.8))),
          customer_satisfaction: Math.max(10, Math.min(100, 80 + (stats.delta * 0.5))),
          risk_score: Math.max(5, Math.min(95, 15 - stats.delta)),
          productivity: stats.simulatedAvg,
          delivery_speed: stats.simulatedAvg
        }
      };

      const res = await api.post("/simulation/insights", payload);
      setAiInsights(res.data.insights || "");
    } catch (err: any) {
      console.error("Failed to generate AI sandbox insights.", err);
      setInsightsError("Failed to fetch simulation insights. Verify OpenRouter settings.");
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Compute 12-month productivity timeline list for plotting
  const productivityTimelineData = useMemo(() => {
    const timeline = [];
    const base = stats.baselineAvg;
    const sim = stats.simulatedAvg;

    for (let m = 1; m <= 12; m++) {
      // Baseline trajectory (mild random noise around 0.5%)
      const baseNoise = Math.sin(m / 2) * 2;
      const baseVal = Math.max(10, Math.min(100, base + baseNoise));

      // Simulated trajectory
      // Gradually adjust simulated productivity over months as AI takes effect or burnout settles
      const adjustmentSpeed = m <= 4 ? (sim - base) * (m / 4) : (sim - base);
      const simNoise = Math.cos(m / 3) * 1.5;
      const simVal = Math.max(10, Math.min(100, base + adjustmentSpeed + simNoise));

      timeline.push({
        month: m,
        baseline: Math.round(baseVal),
        simulated: Math.round(simVal)
      });
    }
    return timeline;
  }, [stats]);

  // --- Render custom SVG line chart comparing productivities ---
  const renderProductivityChart = () => {
    const width = 500;
    const height = 240; // Taller SVG height for clear layout
    
    // Scale bounds dynamically to fill the vertical space
    const allVals = [
      ...productivityTimelineData.map(d => d.baseline),
      ...productivityTimelineData.map(d => d.simulated)
    ];
    const maxVal = Math.min(100, Math.max(...allVals) + 4);
    const minVal = Math.max(0, Math.min(...allVals) - 8);
    const range = maxVal - minVal || 1;

    // Calculate exact coordinates (Edge-to-Edge)
    const basePoints = productivityTimelineData.map((d, i) => {
      const x = (i / 11) * width;
      const y = height - ((d.baseline - minVal) / range) * (height - 50) - 25;
      return { x, y };
    });

    const simPoints = productivityTimelineData.map((d, i) => {
      const x = (i / 11) * width;
      const y = height - ((d.simulated - minVal) / range) * (height - 50) - 25;
      return { x, y };
    });

    // Helper to generate a smooth Bezier path curve
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
          
          {/* Glowing dropshadow filters */}
          <filter id="glow-base" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#319795" floodOpacity="0.4" />
          </filter>
          <filter id="glow-sim" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={deltaColor} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Vertical month grids */}
        {productivityTimelineData.map((d, i) => {
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

        {/* Interactive Dots & Pulsing Pointer */}
        {simPoints.map((p, i) => {
          const isLast = i === simPoints.length - 1;
          const isFirst = i === 0;
          if (!isLast && !isFirst && i % 2 !== 0) return null; // reduce clutter
          
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

  return (
    <div className="space-y-6">
      
      {/* Header Selector Switch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-indigo-400" size={24} /> Employee Simulator Sandbox
          </h1>
          <p className="text-gray-400 text-sm">
            Simulate granular staffing mutations. Search profiles, check individual work metrics, fire/hire staff, and plot immediate productivity changes.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus size={14} /> Hire Custom Specialist
          </button>
          <button 
            onClick={handleResetSandbox}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Reset Sandbox
          </button>
        </div>
      </div>

      {/* Primary Simulator Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Employee Directory & Contributions Search (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search Header */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text" placeholder="Search active or terminated employees by name, email, or role..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="glass-panel py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="animate-spin text-indigo-400" size={32} />
              <span className="text-sm text-gray-400">Querying active workforce records...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmployees.length === 0 ? (
                <div className="glass-panel p-8 text-center text-gray-500 italic text-xs">
                  No matching employees found in sandbox directory.
                </div>
              ) : (
                filteredEmployees.map((emp) => {
                  const isFired = emp.status === "Terminated";
                  return (
                    <div 
                      key={emp.id} 
                      className={`glass-panel p-5 border transition-all ${
                        isFired 
                          ? "border-red-500/25 bg-red-500/5 opacity-65 hover:opacity-90" 
                          : "border-white/5 hover:border-indigo-500/30"
                      }`}
                    >
                      {/* Worker Profile Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            isFired 
                              ? "bg-red-500/20 text-red-400" 
                              : "bg-gradient-to-tr from-indigo-500 to-pink-500 text-white"
                          }`}>
                            {emp.first_name[0]}{emp.last_name[0]}
                          </div>
                          <div>
                            <h3 className={`text-sm font-semibold flex items-center gap-1.5 ${isFired ? "text-red-300 line-through" : "text-white"}`}>
                              {emp.first_name} {emp.last_name}
                              {isFired && <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-medium ml-1.5 uppercase tracking-wider">Fired</span>}
                            </h3>
                            <span className="text-xs text-gray-400 block mt-0.5 flex items-center gap-1">
                              <Briefcase size={12} className="text-gray-500" /> {emp.role_title}
                            </span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">{emp.email}</span>
                          </div>
                        </div>

                        {/* Fire / Rehire Actions */}
                        {isFired ? (
                          <button 
                            onClick={() => handleRehireEmployee(emp.id)}
                            className="px-3 py-1 bg-emerald-600/80 hover:bg-emerald-500 text-white text-[10px] font-semibold rounded transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <UserPlus size={12} /> Rehire Worker
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleTerminateEmployee(emp.id)}
                            className="px-3 py-1 bg-red-600/80 hover:bg-red-500 text-white text-[10px] font-semibold rounded transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <UserMinus size={12} /> Fire / Terminate
                          </button>
                        )}
                      </div>

                      {/* Work Contributions Panel */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 border-t border-white/5 pt-4">
                        {/* Productivity */}
                        <div className="space-y-1">
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Zap size={10} className="text-amber-400" /> Labor Prod
                          </span>
                          <span className="text-xs font-semibold text-white">{emp.productivity_score}%</span>
                        </div>
                        {/* Monthly Output */}
                        <div className="space-y-1">
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Award size={10} className="text-indigo-400" /> Story Points
                          </span>
                          <span className="text-xs font-semibold text-white">{emp.story_points_monthly} pts / mo</span>
                        </div>
                        {/* Tickets Resolved */}
                        <div className="space-y-1">
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <ThumbsUp size={10} className="text-pink-400" /> Resolved Tasks
                          </span>
                          <span className="text-xs font-semibold text-white">{emp.tickets_completed_monthly} items / mo</span>
                        </div>
                        {/* Strategic Impact */}
                        <div className="space-y-1">
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Strategic Impact</span>
                          <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 border rounded-full inline-block ${
                            emp.strategic_impact === "High" ? "text-red-400 border-red-500/20 bg-red-500/10" :
                            emp.strategic_impact === "Medium" ? "text-orange-400 border-orange-500/20 bg-orange-500/10" : "text-blue-400 border-blue-500/20 bg-blue-500/10"
                          }`}>
                            {emp.strategic_impact}
                          </span>
                        </div>
                      </div>

                      {/* Salary/Rate details */}
                      <div className="flex justify-between items-center mt-3 text-[10px] text-gray-500 border-t border-white/5 pt-3">
                        <div className="flex gap-4">
                          <span className="flex items-center gap-0.5"><DollarSign size={10} /> Rate: €{emp.billable_rate_eur}/hr</span>
                          <span className="flex items-center gap-0.5"><DollarSign size={10} /> Salary: €{Math.round(emp.salary / 12).toLocaleString()}/mo</span>
                        </div>
                      </div>

                      {/* Simulation Actions */}
                      {!isFired && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                          <button
                            onClick={() => handlePromoteEmployee(emp.id)}
                            className="px-2 py-1 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 text-[9px] font-bold rounded transition-all cursor-pointer"
                          >
                            Promote
                          </button>
                          <button
                            onClick={() => handleDemoteEmployee(emp.id)}
                            className="px-2 py-1 border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400 text-[9px] font-bold rounded transition-all cursor-pointer"
                          >
                            Demote
                          </button>
                          <button
                            onClick={() => handleSalaryIncrease(emp.id)}
                            className="px-2 py-1 border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 text-[9px] font-bold rounded transition-all cursor-pointer"
                          >
                            +10% Raise
                          </button>
                          <button
                            onClick={() => handleSalaryCut(emp.id)}
                            className="px-2 py-1 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[9px] font-bold rounded transition-all cursor-pointer"
                          >
                            -10% Cut
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Right Hand: Sandbox Summary Dashboard & Graphs (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Sandbox Live Metrics Summary */}
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">
              Sandbox Trajectory Stats
            </h3>

            {/* Main stats counters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Payroll Saved</span>
                <span className="text-xl font-bold text-emerald-400 mt-1 block">€{stats.payrollOpexSavedMonthly.toLocaleString()}/mo</span>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Fired Count</span>
                <span className="text-xl font-bold text-red-400 mt-1 block">{stats.terminatedCount} FTEs</span>
              </div>
            </div>

            {/* Productivity Change Indicator */}
            <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/5">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Sandbox Company Productivity</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-white">{stats.simulatedAvg}%</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    stats.delta >= 0 
                      ? "text-green-400 border-green-500/20 bg-green-500/10" 
                      : "text-red-400 border-red-500/20 bg-red-500/10"
                  }`}>
                    {stats.delta >= 0 ? "+" : ""}{stats.delta}%
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-white/5 ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                <Zap size={22} />
              </div>
            </div>

            {/* AI Automation mitigates Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Offset Fired Labor with AI Automation</span>
                <span className="text-white font-semibold">{Math.round(aiAutomationOffset * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1.0" step="0.05" 
                value={aiAutomationOffset} onChange={e => setAiAutomationOffset(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-gray-500 leading-normal">
                Increasing AI Automation reduces the productivity deficit caused by headcount terminations.
              </p>
            </div>

            {/* Interactive SVG Productivity Curve */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-2xs font-semibold text-gray-400 flex items-center gap-1">
                <BarChart4 size={14} /> 12-Month Company Productivity Forecast
              </span>
              <div className="w-full h-64 bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-center">
                {renderProductivityChart()}
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#319795] rounded-full inline-block"></span> Production Baseline</span>
                <span className="flex items-center gap-1">
                  <span className={`w-2.5 h-1 ${stats.delta >= 0 ? "bg-[#48BB78]" : "bg-[#E53E3E]"} rounded-full inline-block`}></span> 
                  Simulated Trend
                </span>
              </div>
            </div>
          </div>

          {/* Strategic Consequence & Before vs. After Analysis */}
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
              <span className="flex items-center gap-1.5"><Sparkles className="text-indigo-400" size={18} /> Strategic Impact: Before vs. After</span>
            </h3>

            {/* Before vs After comparison grid */}
            <div className="grid grid-cols-2 gap-4 text-2xs">
              {/* Baseline Column */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-teal-400 block border-b border-white/5 pb-1 uppercase tracking-wider">Before (Baseline)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>FTE Headcount:</span>
                    <span className="font-semibold text-white">{stats.baseCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Payroll:</span>
                    <span className="font-semibold text-white">€{stats.basePayroll.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Productivity:</span>
                    <span className="font-semibold text-white">{stats.baselineAvg}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employee Morale:</span>
                    <span className="font-semibold text-white">82% (Stable)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Burnout Risk:</span>
                    <span className="font-semibold text-white">Normal</span>
                  </div>
                </div>
              </div>

              {/* Forecast Column */}
              <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                <span className="font-bold text-indigo-400 block border-b border-white/5 pb-1 uppercase tracking-wider">After (Simulated)</span>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>FTE Headcount:</span>
                    <span className="font-semibold text-white">{stats.activeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Payroll:</span>
                    <span className="font-semibold text-white">€{stats.simulatedPayroll.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Productivity:</span>
                    <span className={`font-semibold ${stats.delta >= 0 ? "text-green-400" : "text-red-400"}`}>{stats.simulatedAvg}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employee Morale:</span>
                    <span className="font-semibold text-white">
                      {Math.max(10, Math.min(100, Math.round(82 + (stats.delta * 0.8))))}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Burnout Risk:</span>
                    <span className={`font-semibold ${stats.delta < -10 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                      {stats.delta < -15 ? "Critical" : stats.delta < -5 ? "Elevated" : "Low"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Narrative Generation */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xs text-gray-400 font-semibold flex items-center gap-1">
                  <Sparkles size={12} className="text-indigo-400" /> Executive AI Scenario Analysis
                </span>
                <button
                  onClick={generateAIConsequences}
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

              {/* Narrative Content */}
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
                  Click the button above to generate a custom OpenRouter AI analysis of this specific staffing scenario.
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
                  onClick={handleClearHistory}
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
                      <span className="font-semibold text-indigo-400">{hist.action} – {hist.employeeName}</span>
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

      {/* CUSTOM HIRE SPECIALIST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddSimulatedEmployee}
            className="w-full max-w-md glass-panel p-6 space-y-4 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <UserPlus className="text-indigo-400" size={20} /> Hire Custom Specialist
            </h3>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs text-gray-400 mb-1">First Name</label>
                <input 
                  type="text" required value={newFirstName} onChange={e => setNewFirstName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Last Name</label>
                <input 
                  type="text" required value={newLastName} onChange={e => setNewLastName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Role Title */}
            <div>
              <label className="block text-2xs text-gray-400 mb-1">Job Role / Title</label>
              <select 
                value={newRole} onChange={e => setNewRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="DevOps Architect">DevOps Architect</option>
                <option value="Product Owner">Product Owner</option>
                <option value="CSM Support Agent">CSM Support Agent</option>
                <option value="QA Engineer">QA Engineer</option>
              </select>
            </div>

            {/* Billable Rate & Productivity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Billable Rate (€/hr)</label>
                <input 
                  type="number" min="30" max="500" value={newRate} onChange={e => setNewRate(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-2xs text-gray-400 mb-1">Labor Prod (%)</label>
                <input 
                  type="number" min="10" max="100" value={newProductivity} onChange={e => setNewProductivity(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Strategic Impact */}
            <div>
              <label className="block text-2xs text-gray-400 mb-1">Strategic Impact Rating</label>
              <select 
                value={newImpact} onChange={e => setNewImpact(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
              >
                <option value="High">High Impact</option>
                <option value="Medium">Medium Impact</option>
                <option value="Low">Low Impact</option>
              </select>
            </div>

            {/* Submit / Cancel */}
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
                Hire Specialist
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
