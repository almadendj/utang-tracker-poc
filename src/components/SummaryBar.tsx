import { Loan } from '../types';

interface Props {
  loans: Loan[];
}

export function SummaryBar({ loans }: Props) {
  const totalOwed = loans.reduce((s, l) => s + l.totalAmount, 0);
  const totalPaid = loans.reduce(
    (s, l) => s + l.payments.filter(p => p.isPaid).reduce((a, p) => a + p.amount, 0),
    0
  );
  const remaining = totalOwed - totalPaid;
  const pct = totalOwed > 0 ? (totalPaid / totalOwed) * 100 : 0;

  const fmt = (n: number) =>
    '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Overall Progress</h2>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500">Paid</span>
        <span className="font-semibold text-green-600">{fmt(totalPaid)}</span>
      </div>
      <div className="flex justify-between text-sm mb-3">
        <span className="text-gray-500">Remaining</span>
        <span className="font-semibold text-red-500">{fmt(remaining)}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{pct.toFixed(1)}% paid</span>
        <span>Total: {fmt(totalOwed)}</span>
      </div>
    </div>
  );
}
