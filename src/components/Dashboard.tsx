import { useRef } from 'react';
import { Loan } from '../types';
import { LoanCard } from './LoanCard';
import { SummaryBar } from './SummaryBar';

interface Props {
  loans: Loan[];
  onSelectLoan: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export function Dashboard({ loans, onSelectLoan, onExport, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen px-4 pt-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Utang Tracker</h1>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg font-medium active:bg-gray-200"
          >
            Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg font-medium active:bg-gray-200"
          >
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <SummaryBar loans={loans} />

      <div className="space-y-3">
        {loans.map(loan => (
          <LoanCard key={loan.id} loan={loan} onClick={() => onSelectLoan(loan.id)} />
        ))}
      </div>
    </div>
  );
}
