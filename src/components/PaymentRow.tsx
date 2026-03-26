import { useState } from 'react';
import { Payment } from '../types';

interface Props {
  payment: Payment;
  onToggle: () => void;
}

function getStatus(p: Payment): 'paid' | 'overdue' | 'upcoming' | 'future' {
  if (p.isPaid) return 'paid';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(p.dueDate);
  const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'overdue';
  if (diff <= 7) return 'upcoming';
  return 'future';
}

export function PaymentRow({ payment, onToggle }: Props) {
  const [confirming, setConfirming] = useState(false);

  const status = getStatus(payment);

  const handleTap = () => {
    if (payment.isPaid) {
      setConfirming(true);
    } else {
      onToggle();
    }
  };

  const handleConfirmUnpay = () => {
    setConfirming(false);
    onToggle();
  };

  const fmt = (n: number) =>
    '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const dueFormatted = new Date(payment.dueDate).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const rowBg =
    status === 'paid'
      ? 'bg-green-50 border-green-200'
      : status === 'overdue'
      ? 'bg-red-50 border-red-200'
      : status === 'upcoming'
      ? 'bg-amber-50 border-amber-200'
      : 'bg-white border-gray-100';

  const amountColor =
    status === 'paid'
      ? 'text-green-600'
      : status === 'overdue'
      ? 'text-red-500'
      : status === 'upcoming'
      ? 'text-amber-600'
      : 'text-gray-700';

  return (
    <>
      <button
        onClick={handleTap}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl active:scale-95 transition-all duration-200 ${rowBg}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              payment.isPaid
                ? 'bg-green-500 border-green-500'
                : status === 'overdue'
                ? 'border-red-400'
                : status === 'upcoming'
                ? 'border-amber-400'
                : 'border-gray-300'
            }`}
          >
            {payment.isPaid && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div className="text-left">
            <p className={`text-sm font-medium ${payment.isPaid ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {dueFormatted}
            </p>
            {payment.isPaid && payment.paidDate && (
              <p className="text-xs text-gray-400">Paid {new Date(payment.paidDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}</p>
            )}
            {!payment.isPaid && status === 'overdue' && (
              <p className="text-xs text-red-500 font-medium">Overdue</p>
            )}
            {!payment.isPaid && status === 'upcoming' && (
              <p className="text-xs text-amber-600 font-medium">Due soon</p>
            )}
          </div>
        </div>
        <span className={`font-semibold text-sm ${amountColor}`}>{fmt(payment.amount)}</span>
      </button>

      {confirming && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-gray-800 mb-1">Mark as Unpaid?</h3>
            <p className="text-sm text-gray-500 mb-4">This will remove the payment for {dueFormatted}.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnpay}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm"
              >
                Unpay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
