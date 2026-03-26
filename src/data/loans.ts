import { Loan } from "../types";

const PAID_BEFORE = "2026-03-24";

function makePayments(
  firstDue: string,
  count: number,
  amount: number,
  unit: "monthly" | "biweekly",
  loanId: string,
) {
  const payments = [];
  const first = new Date(firstDue);
  for (let i = 0; i < count; i++) {
    const due = new Date(first);
    if (unit === "monthly") {
      due.setMonth(due.getMonth() + i);
    } else {
      due.setDate(due.getDate() + i * 14);
    }
    const dueDate = due.toISOString().split("T")[0];
    const isPaid = dueDate < PAID_BEFORE;
    payments.push({
      id: `${loanId}-p${i}`,
      dueDate,
      amount,
      isPaid,
      ...(isPaid ? { paidDate: dueDate } : {}),
    });
  }
  return payments;
}

export const defaultLoans: Loan[] = [
  // ── FT Lending ───────────────────────────────────────────────────────────
  {
    id: "ft-1",
    lender: "FT Lending #1 (₱9,000)",
    totalAmount: Math.round(2377 * 7 * 100) / 100,
    monthlyPayment: 2377,
    payments: makePayments("2026-01-23", 7, 2377, "biweekly", "ft-1"),
  },
  {
    id: "ft-2",
    lender: "FT Lending #2 (₱4,200)",
    totalAmount: Math.round(1522 * 5 * 100) / 100,
    monthlyPayment: 1522,
    payments: makePayments("2026-02-12", 5, 1522, "biweekly", "ft-2"),
  },
  {
    id: "ft-3",
    lender: "FT Lending #3 (₱3,100)",
    totalAmount: Math.round(1169 * 5 * 100) / 100,
    monthlyPayment: 1169,
    payments: makePayments("2026-02-24", 5, 1169, "biweekly", "ft-3"),
  },
  {
    id: "ft-4",
    lender: "FT Lending #4 (₱2,850)",
    totalAmount: Math.round(1852 * 3 * 100) / 100,
    monthlyPayment: 1852,
    payments: makePayments("2026-03-20", 3, 1852, "biweekly", "ft-4"),
  },
  {
    id: "ft-5",
    lender: "FT Lending #5 (₱2,300)",
    totalAmount: Math.round(1546 * 3 * 100) / 100,
    monthlyPayment: 1546,
    payments: makePayments("2026-03-27", 3, 1546, "biweekly", "ft-5"),
  },

  // ── Juanhand ─────────────────────────────────────────────────────────────
  {
    id: "jh-1",
    lender: "Juanhand #1 (₱15,986)",
    totalAmount: Math.round(4210 * 6 * 100) / 100,
    monthlyPayment: 4210,
    payments: makePayments("2025-12-26", 6, 4210, "monthly", "jh-1"),
  },
  {
    id: "jh-2",
    lender: "Juanhand #2 (₱3,000)",
    totalAmount: Math.round(1049 * 4 * 100) / 100,
    monthlyPayment: 1049,
    payments: makePayments("2026-01-22", 4, 1049, "monthly", "jh-2"),
  },
  {
    id: "jh-3",
    lender: "Juanhand #3 (₱8,342)",
    totalAmount: Math.round(2920 * 4 * 100) / 100,
    monthlyPayment: 2920,
    payments: makePayments("2026-02-10", 4, 2920, "monthly", "jh-3"),
  },
  {
    id: "jh-4",
    lender: "Juanhand #4 (₱6,917)",
    totalAmount: Math.round(1821 * 6 * 100) / 100,
    monthlyPayment: 1821,
    payments: makePayments("2026-02-26", 6, 1821, "monthly", "jh-4"),
  },
  {
    id: "jh-5",
    lender: "Juanhand #5 (₱2,000)",
    totalAmount: Math.round(699 * 4 * 100) / 100,
    monthlyPayment: 699,
    payments: makePayments("2026-03-01", 4, 699, "monthly", "jh-5"),
  },

  // ── SLoan ────────────────────────────────────────────────────────────────
  {
    id: "sl-1",
    lender: "SLoan #1 (₱7,200)",
    totalAmount: Math.round(1570.78 * 6 * 100) / 100,
    monthlyPayment: 1570.78,
    payments: makePayments("2025-10-24", 6, 1570.78, "monthly", "sl-1"),
  },
  {
    id: "sl-2",
    lender: "SLoan #2 (₱9,800)",
    totalAmount: Math.round(2138.01 * 6 * 100) / 100,
    monthlyPayment: 2138.01,
    payments: makePayments("2025-12-08", 6, 2138.01, "monthly", "sl-2"),
  },
  {
    id: "sl-3",
    lender: "SLoan #3 (₱4,000)",
    totalAmount: Math.round(872.66 * 6 * 100) / 100,
    monthlyPayment: 872.66,
    payments: makePayments("2025-12-26", 6, 872.66, "monthly", "sl-3"),
  },
  {
    id: "sl-4",
    lender: "SLoan #4 (₱5,000)",
    totalAmount: Math.round(1090.82 * 6 * 100) / 100,
    monthlyPayment: 1090.82,
    payments: makePayments("2026-01-16", 6, 1090.82, "monthly", "sl-4"),
  },
  {
    id: "sl-5",
    lender: "SLoan #5 (₱7,100)",
    totalAmount: Math.round(1548.97 * 6 * 100) / 100,
    monthlyPayment: 1548.97,
    payments: makePayments("2026-02-07", 6, 1548.97, "monthly", "sl-5"),
  },
  {
    id: "sl-6",
    lender: "SLoan #6 (₱2,900)",
    totalAmount: Math.round(632.68 * 6 * 100) / 100,
    monthlyPayment: 632.68,
    payments: makePayments("2026-02-26", 6, 632.68, "monthly", "sl-6"),
  },
  {
    id: "sl-7",
    lender: "SLoan #7 (₱7,600)",
    totalAmount: Math.round(1658.05 * 6 * 100) / 100,
    monthlyPayment: 1658.05,
    payments: makePayments("2026-03-07", 6, 1658.05, "monthly", "sl-7"),
  },
  {
    id: "sl-8",
    lender: "SLoan #8 (₱3,500)",
    totalAmount: Math.round(1346.92 * 6 * 100) / 100,
    monthlyPayment: 1346.92,
    payments: makePayments("2026-03-27", 6, 1346.92, "monthly", "sl-8"),
  },
  {
    id: "sl-9",
    lender: "SLoan #9 (₱3,800)",
    totalAmount: Math.round(829.03 * 6 * 100) / 100,
    monthlyPayment: 829.03,
    payments: makePayments("2026-04-09", 6, 829.03, "monthly", "sl-9"),
  },

  // ── SpayLater ─────────────────────────────────────────────────────────────
  {
    id: "spl-1",
    lender: "SpayLater (Apr)",
    totalAmount: 1178.36,
    monthlyPayment: 1178.36,
    payments: makePayments("2026-04-05", 1, 1178.36, "monthly", "spl-1"),
  },
  {
    id: "spl-2",
    lender: "SpayLater (May)",
    totalAmount: 227.59,
    monthlyPayment: 227.59,
    payments: makePayments("2026-05-05", 1, 227.59, "monthly", "spl-2"),
  },

  // ── HomeCredit ───────────────────────────────────────────────────────────
  {
    id: "hc-1",
    lender: "HomeCredit (₱30,000)",
    totalAmount: Math.round(4458 * 9 * 100) / 100,
    monthlyPayment: 4458,
    payments: makePayments("2026-03-25", 9, 4458, "monthly", "hc-1"),
  },
];
