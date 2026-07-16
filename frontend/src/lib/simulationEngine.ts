export interface SimulatedEmployee {
  id: string;
  first_name: string;
  last_name: string;
  role_title: string;
  email: string;
  department_id?: string;
  manager_id?: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  billable_rate_eur: number;
  salary: number;
  experience_years: number;
  skill_level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  performance_score: number; // 0 to 100
  productivity: number; // 0 to 100
  burnout_score: number; // 0 to 100
  satisfaction_score: number; // 0 to 100
  ai_automation_risk: number; // 0 to 100
  promotion_status: 'Standard' | 'Promoted' | 'FastTrack';
  training_hours: number;
}

export interface SimulationSettings {
  marketing_investment: number; // EUR
  research_budget: number;       // EUR
  cybersecurity_budget: number;  // EUR
  training_budget: number;       // EUR
  customer_success_budget: number; // EUR
  ai_automation_level: number;   // 0.0 to 1.0 (0% to 100%)
  salary_multiplier: number;     // e.g. 1.0 (no change), 1.1 (+10%), 0.9 (-10%)
  timeline_months: number;       // 1, 3, 6, 12, 36, 60
}

export interface DepartmentMetrics {
  name: string;
  code: string;
  employee_count: number;
  efficiency_score: number;
  satisfaction: number;
  productivity: number;
  cost_monthly: number;
  revenue_contribution: number;
  risk_level: number;
  health_score: number;
}

export interface SimulationResult {
  month: number;
  total_employees: number;
  total_revenue_arr: number;
  total_opex_monthly: number;
  total_profit_monthly: number;
  company_health_score: number;
  productivity: number;
  burnout_score: number;
  employee_satisfaction: number;
  customer_satisfaction: number;
  delivery_speed: number;
  risk_score: number;
  departments: DepartmentMetrics[];
}

export function runBusinessSimulation(
  baseEmployees: SimulatedEmployee[],
  settings: SimulationSettings
): SimulationResult[] {
  const months = settings.timeline_months;
  const results: SimulationResult[] = [];

  // Initialize simulated employee registry
  let activeEmployees = baseEmployees.map(emp => ({ ...emp }));

  // Department metadata
  const depts = [
    { id: 'eng_dept', name: 'Engineering', code: 'ENG', rev_factor: 0.4 },
    { id: 'prod_dept', name: 'Product Management', code: 'PROD', rev_factor: 0.2 },
    { id: 'sales_dept', name: 'Sales & Success', code: 'SALE', rev_factor: 0.4 },
    { id: 'hr_dept', name: 'Human Resources', code: 'HR', rev_factor: 0.0 }
  ];

  // Base state values
  let currentRevenueArr = 12500000;
  let baseOpex = 80000;

  for (let m = 1; m <= months; m++) {
    // 1. Process Employee-level modifications
    activeEmployees = activeEmployees.map(emp => {
      if (emp.status === 'Terminated') return emp;

      // Adjust individual satisfaction based on training and salaries
      let sat = emp.satisfaction_score;
      sat += (settings.training_budget / 20000);
      sat *= settings.salary_multiplier;
      sat = Math.max(10, Math.min(100, sat));

      // Adjust individual burnout based on automation and staff levels
      let burn = emp.burnout_score;
      const automationReduction = settings.ai_automation_level * 15;
      burn = Math.max(10, Math.min(100, burn - automationReduction + (settings.salary_multiplier < 1 ? 10 : 0)));

      // Adjust productivity
      let prod = emp.productivity;
      prod = prod * (1 + settings.ai_automation_level * 0.3) * (sat / 100);
      prod = Math.max(10, Math.min(100, prod));

      return {
        ...emp,
        satisfaction_score: Math.round(sat),
        burnout_score: Math.round(burn),
        productivity: Math.round(prod)
      };
    });

    const livingEmployees = activeEmployees.filter(e => e.status !== 'Terminated');
    const totalEmployees = livingEmployees.length;

    // 2. Recalculate Department Metrics
    const deptMetricsList: DepartmentMetrics[] = depts.map(d => {
      const deptEmployees = livingEmployees.filter(e => e.department_id === d.id || e.role_title.toLowerCase().includes(d.name.toLowerCase()));
      const empCount = deptEmployees.length;

      const avgSatisfy = empCount > 0 ? deptEmployees.reduce((sum, e) => sum + e.satisfaction_score, 0) / empCount : 75;
      const avgProd = empCount > 0 ? deptEmployees.reduce((sum, e) => sum + e.productivity, 0) / empCount : 75;
      const avgBurn = empCount > 0 ? deptEmployees.reduce((sum, e) => sum + e.burnout_score, 0) / empCount : 40;

      // Cost calculation: Payroll + Allocated investments
      const baseSalarySum = deptEmployees.reduce((sum, e) => sum + e.salary, 0);
      const payrollCost = (baseSalarySum * settings.salary_multiplier) / 12;
      
      let allocatedInv = 0;
      if (d.code === 'ENG') allocatedInv = settings.research_budget + settings.cybersecurity_budget;
      if (d.code === 'SALE') allocatedInv = settings.marketing_investment + settings.customer_success_budget;
      if (d.code === 'HR') allocatedInv = settings.training_budget;
      const costMonthly = payrollCost + (allocatedInv / 12);

      // Efficency and Health score of Department
      const efficiency = Math.max(10, Math.min(100, avgProd * (1 - avgBurn / 250)));
      const risk = Math.max(5, Math.min(95, 50 - (settings.cybersecurity_budget / 4000) + (settings.ai_automation_level * 20)));
      const health = Math.round((avgSatisfy * 0.3) + (efficiency * 0.4) + ((100 - risk) * 0.3));

      // Estimate revenue contribution based on efficiency factor
      const revenueContribution = (currentRevenueArr / 12) * d.rev_factor * (efficiency / 100);

      return {
        name: d.name,
        code: d.code,
        employee_count: empCount,
        efficiency_score: Math.round(efficiency),
        satisfaction: Math.round(avgSatisfy),
        productivity: Math.round(avgProd),
        cost_monthly: Math.round(costMonthly),
        revenue_contribution: Math.round(revenueContribution),
        risk_level: Math.round(risk),
        health_score: health
      };
    });

    // 3. Aggregate Top-Level Metrics
    const avgProductivity = deptMetricsList.reduce((sum, d) => sum + d.productivity, 0) / depts.length;
    const avgSatisfaction = deptMetricsList.reduce((sum, d) => sum + d.satisfaction, 0) / depts.length;
    const avgRisk = deptMetricsList.reduce((sum, d) => sum + d.risk_level, 0) / depts.length;
    const avgBurnout = livingEmployees.length > 0 
      ? livingEmployees.reduce((sum, e) => sum + e.burnout_score, 0) / livingEmployees.length 
      : 30;

    // Delivery speed scales with productivity and engineering headcount
    const engCount = deptMetricsList.find(d => d.code === 'ENG')?.employee_count || 1;
    const deliverySpeed = Math.max(10, Math.min(150, avgProductivity * (1 + (engCount - 4) * 0.08)));

    // Customer satisfaction and churn rate
    const csBudgetFactor = settings.customer_success_budget / 20000;
    const customerSatisfaction = Math.max(15, Math.min(100, (deliverySpeed * 0.5) + (avgProductivity * 0.3) + (csBudgetFactor * 10)));
    const churnRate = Math.max(1, Math.min(45, 18 - (customerSatisfaction / 8)));

    // Financial calculations: Revenue, OpEx, Profit
    const leads = (settings.marketing_investment / 100000) * 45;
    const newArrPipeline = leads * 12000 * (deliverySpeed / 100);
    
    currentRevenueArr = (currentRevenueArr * (1 - (churnRate / 1200))) + (newArrPipeline / 12);
    
    const totalPayrollMonthly = livingEmployees.reduce((sum, e) => sum + e.salary, 0) * settings.salary_multiplier / 12;
    const aiAutomationMaintenance = totalPayrollMonthly * (settings.ai_automation_level * 0.12);
    const totalOpexMonthly = (baseOpex * (1 - (settings.ai_automation_level * 0.3))) + aiAutomationMaintenance + 
      ((settings.marketing_investment + settings.research_budget + settings.cybersecurity_budget + settings.training_budget + settings.customer_success_budget) / 12);
    
    const totalProfitMonthly = (currentRevenueArr / 12) - totalPayrollMonthly - totalOpexMonthly;

    // Core Company Health Score (0 to 100)
    const margin = currentRevenueArr > 0 ? (totalProfitMonthly / (currentRevenueArr / 12)) * 100 : 0;
    const healthScore = Math.max(10, Math.min(100, Math.round(
      (avgSatisfaction * 0.2) +
      (customerSatisfaction * 0.2) +
      (Math.min(100, Math.max(0, margin + 20)) * 0.4) +
      ((100 - avgRisk) * 0.2)
    )));

    results.push({
      month: m,
      total_employees: totalEmployees,
      total_revenue_arr: Math.round(currentRevenueArr),
      total_opex_monthly: Math.round(totalOpexMonthly),
      total_profit_monthly: Math.round(totalProfitMonthly),
      company_health_score: healthScore,
      productivity: Math.round(avgProductivity),
      burnout_score: Math.round(avgBurnout),
      employee_satisfaction: Math.round(avgSatisfaction),
      customer_satisfaction: Math.round(customerSatisfaction),
      delivery_speed: Math.round(deliverySpeed),
      risk_score: Math.round(avgRisk),
      departments: deptMetricsList
    });
  }

  return results;
}
