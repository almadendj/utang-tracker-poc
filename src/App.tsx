import { useState } from 'react';
import { useLoans } from './hooks/useLoans';
import { Dashboard } from './components/Dashboard';
import { PaymentList } from './components/PaymentList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

type Tab = 'overview' | 'loans';

export default function App() {
  const { loans, togglePayment, exportData, importData } = useLoans();
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('overview');

  const selectedLoan = selectedLoanId ? loans.find(l => l.id === selectedLoanId) ?? null : null;

  if (selectedLoan) {
    return (
      <PaymentList
        loan={selectedLoan}
        onToggle={paymentId => togglePayment(selectedLoan.id, paymentId)}
        onBack={() => setSelectedLoanId(null)}
      />
    );
  }

  return (
    <div className="relative">
      {/* Tab content */}
      {tab === 'overview' && <AnalyticsDashboard loans={loans} />}
      {tab === 'loans' && (
        <Dashboard
          loans={loans}
          onSelectLoan={id => { setSelectedLoanId(id); }}
          onExport={exportData}
          onImport={importData}
        />
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-20 safe-bottom">
        <TabButton
          active={tab === 'overview'}
          onClick={() => setTab('overview')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          label="Overview"
        />
        <TabButton
          active={tab === 'loans'}
          onClick={() => setTab('loans')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          label="Loans"
        />
      </nav>
    </div>
  );
}

function TabButton({
  active, onClick, icon, label,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
        active ? 'text-indigo-600' : 'text-gray-400'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
