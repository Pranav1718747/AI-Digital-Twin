"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BadgeEuro, BriefcaseBusiness, Loader2, Mail, RefreshCw, Search, UserRoundCheck, Users } from "lucide-react";
import { api } from "@/lib/api";

type Employee = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_title: string;
  department_id: string | null;
  manager_id: string | null;
  status: string;
  billable_rate_eur: number;
};

type PaginatedEmployees = {
  total: number;
  page: number;
  page_size: number;
  items: Employee[];
};

type ApiError = {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message?: string;
};

const statusStyles: Record<string, string> = {
  active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  deactivated: "border-gray-400/30 bg-gray-400/10 text-gray-300",
  inactive: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.get<PaginatedEmployees>("/employees", {
        params: { page: 1, page_size: 100 },
      });
      setEmployees(response.data.items ?? []);
      setTotal(response.data.total ?? 0);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.detail || apiError.message || "Unable to load employees.");
      setEmployees([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadEmployees();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredEmployees = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return employees.filter((employee) => {
      const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
      const matchesSearch =
        !needle ||
        fullName.includes(needle) ||
        employee.email.toLowerCase().includes(needle) ||
        employee.role_title.toLowerCase().includes(needle);

      const matchesStatus =
        statusFilter === "all" || employee.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, query, statusFilter]);

  const activeEmployees = employees.filter((employee) => employee.status.toLowerCase() === "active").length;
  const averageRate =
    employees.length > 0
      ? Math.round(employees.reduce((sum, employee) => sum + Number(employee.billable_rate_eur || 0), 0) / employees.length)
      : 0;

  const metrics = [
    { label: "Total Employees", value: total.toLocaleString(), icon: Users, color: "text-indigo-300" },
    { label: "Active Profiles", value: activeEmployees.toLocaleString(), icon: UserRoundCheck, color: "text-emerald-300" },
    { label: "Visible Records", value: filteredEmployees.length.toLocaleString(), icon: BriefcaseBusiness, color: "text-pink-300" },
    { label: "Avg. Billable Rate", value: `EUR ${averageRate.toLocaleString()}`, icon: BadgeEuro, color: "text-cyan-300" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Employees</h1>
          <p className="text-gray-400 text-sm">Manage workforce records, status, and billable capacity.</p>
        </div>

        <button
          type="button"
          onClick={loadEmployees}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-400">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold text-white">{metric.value}</p>
              </div>
              <div className={`rounded-lg bg-white/5 p-3 ${metric.color}`}>
                <metric.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-500"
              placeholder="Search name, role, or email"
            />
          </div>

          <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
            {["all", "active", "deactivated"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`h-8 rounded-md px-3 text-xs font-medium capitalize transition ${
                  statusFilter === status ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-start gap-3 rounded-lg border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-red-100">Employees could not be loaded.</p>
              <p className="mt-1 text-red-200/80">{error}</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Rate</th>
                <th className="px-5 py-3 font-medium">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-10 w-52 rounded bg-white/10" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-40 rounded bg-white/10" /></td>
                    <td className="px-5 py-4"><div className="h-6 w-20 rounded-full bg-white/10" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-32 rounded bg-white/10" /></td>
                  </tr>
                ))}

              {!isLoading &&
                filteredEmployees.map((employee) => {
                  const statusKey = employee.status.toLowerCase();
                  return (
                    <tr key={employee.id} className="transition-colors hover:bg-white/[0.03]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500/80 to-pink-500/80 text-sm font-bold text-white">
                            {employee.first_name.charAt(0)}
                            {employee.last_name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white">{employee.first_name} {employee.last_name}</p>
                            <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-gray-500">
                              <Mail size={12} />
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-300">{employee.role_title}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[statusKey] ?? "border-white/10 bg-white/5 text-gray-300"}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-300">EUR {Number(employee.billable_rate_eur || 0).toLocaleString()}</td>
                      <td className="px-5 py-4 font-mono text-xs text-gray-500">{employee.department_id ?? "Unassigned"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {!isLoading && !error && filteredEmployees.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 rounded-lg bg-white/5 p-4 text-gray-400">
              <Users size={28} />
            </div>
            <p className="text-sm font-medium text-white">No employees found</p>
            <p className="mt-1 text-sm text-gray-500">Adjust the search or status filter to see more records.</p>
          </div>
        )}
      </div>
    </div>
  );
}
