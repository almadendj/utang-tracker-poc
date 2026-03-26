export interface Payment {
  id: string;
  dueDate: string; // ISO date
  amount: number;
  isPaid: boolean;
  paidDate?: string;
}

export interface Loan {
  id: string;
  lender: string;
  totalAmount: number;
  monthlyPayment: number;
  payments: Payment[];
}
