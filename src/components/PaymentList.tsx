import { Loan } from '../types';
import { PaymentRow } from './PaymentRow';

interface Props {
  loan: Loan;
  onToggle: (paymentId: string) => void;
  onBack: () => void;
}

export function PaymentList({ loan, onToggle, onBack }: Props) {
  const paidCount = loan.payments.filter(p => p.isPaid).length;
  const total = loan.payments.length;
  const paidAmount = loan.payments.filter(p => p.isPaid).reduce((s, p) => s + p.amount, 0);

  const fmt = (n: number) =>
    '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="p-1 -ml-1 text-gray-500 active:text-gray-800">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="font-bold text-gray-900 text-xl">{loan.lender}</h1>
            <p className="text-xs text-gray-400">{paidCount}/{total} payments done</p>
          </div>
        </div>

        {/* Mini summary */}
        <div className="px-4 pb-4 flex gap-4">
          <div className="flex-1 bg-green-50 rounded-xl p-2.5 text-center">
            <p className="text-xs text-green-600 font-medium">Paid</p>
            <p className="text-sm font-bold text-green-700">{fmt(paidAmount)}</p>
          </div>
          <div className="flex-1 bg-red-50 rounded-xl p-2.5 text-center">
            <p className="text-xs text-red-500 font-medium">Remaining</p>
            <p className="text-sm font-bold text-red-600">{fmt(loan.totalAmount - paidAmount)}</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-2.5 text-center">
            <p className="text-xs text-gray-500 font-medium">Total</p>
            <p className="text-sm font-bold text-gray-700">{fmt(loan.totalAmount)}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pb-4">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${loan.totalAmount > 0 ? (paidAmount / loan.totalAmount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Payment rows */}
      <div className="flex-1 px-4 py-3 space-y-2">
        {loan.payments.map(p => (
          <PaymentRow key={p.id} payment={p} onToggle={() => onToggle(p.id)} />
        ))}
      </div>
    </div>
  );
}
