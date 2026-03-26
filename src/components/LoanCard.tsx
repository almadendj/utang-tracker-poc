import { Loan, Payment } from '../types';

interface Props {
  loan: Loan;
  onClick: () => void;
}

function getPaymentStatus(p: Payment): 'paid' | 'overdue' | 'upcoming' | 'future' {
  if (p.isPaid) return 'paid';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(p.dueDate);
  const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'overdue';
  if (diff <= 7) return 'upcoming';
  return 'future';
}

export function LoanCard({ loan, onClick }: Props) {
  const paidAmount = loan.payments.filter(p => p.isPaid).reduce((s, p) => s + p.amount, 0);
  const pct = loan.totalAmount > 0 ? (paidAmount / loan.totalAmount) * 100 : 0;

  const nextUnpaid = loan.payments.find(p => !p.isPaid);
  const nextDue = nextUnpaid
    ? new Date(nextUnpaid.dueDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const statuses = loan.payments.map(getPaymentStatus);
  const hasOverdue = statuses.includes('overdue');
  const hasUpcoming = statuses.includes('upcoming');

  const borderColor = hasOverdue
    ? 'border-l-red-500'
    : hasUpcoming
    ? 'border-l-amber-400'
    : pct >= 100
    ? 'border-l-green-500'
    : 'border-l-gray-200';

  const fmt = (n: number) =>
    '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <button
      onClick={onClick}
      className={`w-full bg-white rounded-2xl shadow p-4 text-left border-l-4 ${borderColor} active:scale-95 transition-transform`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-gray-800 text-lg">{loan.lender}</span>
        {hasOverdue && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Overdue</span>
        )}
        {!hasOverdue && hasUpcoming && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Due Soon</span>
        )}
        {!hasOverdue && !hasUpcoming && pct >= 100 && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Done!</span>
        )}
      </div>

      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Paid: <span className="text-green-600 font-semibold">{fmt(paidAmount)}</span></span>
        <span>Left: <span className="text-red-500 font-semibold">{fmt(loan.totalAmount - paidAmount)}</span></span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>{pct.toFixed(0)}% of {fmt(loan.totalAmount)}</span>
        {nextDue && <span>Next: {nextDue}</span>}
        {!nextDue && <span>All paid!</span>}
      </div>
    </button>
  );
}
