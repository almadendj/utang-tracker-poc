import { useState, useCallback } from 'react';
import { Loan } from '../types';
import { defaultLoans } from '../data/loans';

const STORAGE_KEY = 'utang-tracker-loans';

function isValidLoans(data: unknown): data is Loan[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (l) =>
        typeof l === 'object' &&
        l !== null &&
        typeof l.id === 'string' &&
        Array.isArray(l.payments),
    )
  );
}

function loadLoans(): Loan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidLoans(parsed)) return parsed;
      // Stale/incompatible data — reset to defaults
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
  return defaultLoans;
}

function saveLoans(loans: Loan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
}

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>(loadLoans);

  const togglePayment = useCallback((loanId: string, paymentId: string) => {
    setLoans(prev => {
      const next = prev.map(loan => {
        if (loan.id !== loanId) return loan;
        return {
          ...loan,
          payments: loan.payments.map(p => {
            if (p.id !== paymentId) return p;
            const nowPaid = !p.isPaid;
            return {
              ...p,
              isPaid: nowPaid,
              paidDate: nowPaid ? new Date().toISOString().split('T')[0] : undefined,
            };
          }),
        };
      });
      saveLoans(next);
      return next;
    });
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(loans, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utang-tracker-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [loans]);

  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string) as Loan[];
        saveLoans(data);
        setLoans(data);
      } catch {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  }, []);

  return { loans, togglePayment, exportData, importData };
}
