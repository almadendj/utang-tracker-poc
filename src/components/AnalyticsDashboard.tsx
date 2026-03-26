import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Loan } from '../types';

interface Props {
  loans: Loan[];
}

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

function baseLender(lender: string) {
  return lender.split(' #')[0].split(' (')[0];
}

function fmt(n: number) {
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtShort(n: number) {
  if (n >= 1000) return '₱' + (n / 1000).toFixed(1) + 'k';
  return '₱' + n.toFixed(0);
}

export function AnalyticsDashboard({ loans }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  const currentMonth = todayStr.slice(0, 7);

  const allPayments = loans.flatMap(l => l.payments);

  const dueThisMonth = allPayments
    .filter(p => !p.isPaid && p.dueDate.startsWith(currentMonth))
    .reduce((s, p) => s + p.amount, 0);

  const overdue = allPayments
    .filter(p => !p.isPaid && p.dueDate < todayStr)
    .reduce((s, p) => s + p.amount, 0);

  const totalRemaining = allPayments
    .filter(p => !p.isPaid)
    .reduce((s, p) => s + p.amount, 0);

  const totalPaid = allPayments
    .filter(p => p.isPaid)
    .reduce((s, p) => s + p.amount, 0);

  const totalDebt = loans.reduce((s, l) => s + l.totalAmount, 0);
  const paidPct = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;

  // Monthly schedule (next 6 months of unpaid payments)
  const monthlyMap: Record<string, number> = {};
  allPayments
    .filter(p => !p.isPaid)
    .forEach(p => {
      const m = p.dueDate.slice(0, 7);
      monthlyMap[m] = (monthlyMap[m] || 0) + p.amount;
    });
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 8)
    .map(([month, amount]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-PH', { month: 'short', year: '2-digit' }),
      amount: Math.round(amount * 100) / 100,
    }));

  // Lender breakdown (remaining per lender group)
  const lenderMap: Record<string, number> = {};
  loans.forEach(loan => {
    const name = baseLender(loan.lender);
    const remaining = loan.payments.filter(p => !p.isPaid).reduce((s, p) => s + p.amount, 0);
    if (remaining > 0) lenderMap[name] = (lenderMap[name] || 0) + remaining;
  });
  const lenderData = Object.entries(lenderMap)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));

  // Upcoming payments (next 10 unpaid, sorted by date)
  const upcoming = allPayments
    .filter(p => !p.isPaid && p.dueDate >= todayStr)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 10)
    .map(p => {
      const loan = loans.find(l => l.payments.some(lp => lp.id === p.id));
      return { ...p, lender: loan ? baseLender(loan.lender) : '—' };
    });

  const overdueCount = allPayments.filter(p => !p.isPaid && p.dueDate < todayStr).length;
  const dueThisMonthCount = allPayments.filter(p => !p.isPaid && p.dueDate.startsWith(currentMonth)).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-indigo-600 pt-8 pb-6 px-4">
        <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">
          {today.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <h1 className="text-white text-2xl font-bold mb-4">Overview</h1>

        {/* Overall progress */}
        <div className="bg-indigo-700/50 rounded-2xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-indigo-200">Overall progress</span>
            <span className="text-white font-semibold">{paidPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-indigo-900/50 rounded-full h-2.5 overflow-hidden mb-3">
            <div
              className="bg-white h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${paidPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-indigo-200">
            <span>Paid: <span className="text-white font-semibold">{fmt(totalPaid)}</span></span>
            <span>Left: <span className="text-white font-semibold">{fmt(totalRemaining)}</span></span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-1 space-y-4 pt-4">
        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Due This Month"
            value={fmt(dueThisMonth)}
            sub={`${dueThisMonthCount} payment${dueThisMonthCount !== 1 ? 's' : ''}`}
            color="text-indigo-600"
            bg="bg-indigo-50"
            icon="📅"
          />
          <MetricCard
            label="Overdue"
            value={fmt(overdue)}
            sub={`${overdueCount} payment${overdueCount !== 1 ? 's' : ''}`}
            color={overdue > 0 ? 'text-red-600' : 'text-green-600'}
            bg={overdue > 0 ? 'bg-red-50' : 'bg-green-50'}
            icon={overdue > 0 ? '⚠️' : '✅'}
          />
          <MetricCard
            label="Total Remaining"
            value={fmt(totalRemaining)}
            sub="across all loans"
            color="text-amber-600"
            bg="bg-amber-50"
            icon="💰"
          />
          <MetricCard
            label="Total Paid"
            value={fmt(totalPaid)}
            sub={`of ${fmt(totalDebt)}`}
            color="text-green-600"
            bg="bg-green-50"
            icon="✓"
          />
        </div>

        {/* Monthly schedule chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-bold text-gray-800 mb-1">Monthly Schedule</h2>
          <p className="text-xs text-gray-400 mb-4">Upcoming payments by month</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v) => [fmt(Number(v)), 'Due']}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lender breakdown */}
        {lenderData.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-bold text-gray-800 mb-1">Remaining by Lender</h2>
            <p className="text-xs text-gray-400 mb-4">Balance still owed per provider</p>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={lenderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {lenderData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [fmt(Number(v)), 'Remaining']}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ fontSize: 12, color: '#6b7280' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Lender list */}
            <div className="space-y-2 mt-2">
              {lenderData.map((d, i) => {
                const pct = totalRemaining > 0 ? (d.value / totalRemaining) * 100 : 0;
                return (
                  <div key={d.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{d.name}</span>
                      <span className="text-gray-500">{fmt(d.value)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming payments */}
        {upcoming.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-bold text-gray-800 mb-1">Upcoming Payments</h2>
            <p className="text-xs text-gray-400 mb-3">Next {upcoming.length} scheduled payments</p>
            <div className="space-y-2">
              {upcoming.map(p => {
                const due = new Date(p.dueDate);
                const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = diff <= 7;
                return (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isUrgent ? 'bg-amber-400' : 'bg-gray-200'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{p.lender}</p>
                        <p className="text-xs text-gray-400">
                          {due.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {diff === 0 && <span className="ml-1 text-red-500 font-medium">· Today</span>}
                          {diff === 1 && <span className="ml-1 text-amber-500 font-medium">· Tomorrow</span>}
                          {diff > 1 && diff <= 7 && <span className="ml-1 text-amber-500 font-medium">· In {diff} days</span>}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{fmt(p.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label, value, sub, color, bg, icon,
}: {
  label: string; value: string; sub: string; color: string; bg: string; icon: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-4`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`text-lg font-bold ${color} leading-tight`}>{value}</p>
      <p className="text-xs font-semibold text-gray-600 mt-0.5">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}
