# Interactive Loan Payment Tracker App

## Overview

A mobile-friendly web app that displays all your loans with their payment schedules. Tap a payment to toggle it paid/unpaid. Progress is saved locally so you can track where you stand across all lenders.

## Stack

- React + TypeScript
- Tailwind CSS
- Vite
- localStorage for persistence (no backend)

## Data Model

```ts
interface Loan {
  id: string;
  lender: string; // e.g. "Tala", "Cashalo", etc.
  totalAmount: number;
  monthlyPayment: number;
  payments: Payment[];
}

interface Payment {
  id: string;
  dueDate: string; // ISO date
  amount: number;
  isPaid: boolean;
  paidDate?: string; // when toggled paid
}
```

## Screens & Components

### 1. Dashboard

- Summary cards per loan showing progress bar, amount remaining, next due date
- Overall summary bar at the top: total debt, total paid, remaining

### 2. Loan Detail

- Tap a loan card to see its full payment schedule as a list of tappable rows

### 3. Payment Row

- Tap to toggle paid/unpaid with a satisfying animation (checkmark, strikethrough, color change)
- Confirmation prompt on "unpay" to avoid accidents

## Core Features

- Tap-to-toggle payments
- Progress bars per loan (paid / total)
- Overall summary (total owed, total paid, remaining)
- Color coding: green = paid, amber = upcoming (within 7 days), red = overdue
- Data persisted in localStorage
- Export/import JSON as backup

## File Structure

```
src/
  components/
    Dashboard.tsx
    LoanCard.tsx
    PaymentList.tsx
    PaymentRow.tsx
    SummaryBar.tsx
  data/
    loans.ts          # loan data seeded here
  hooks/
    useLoans.ts       # state + localStorage logic
  App.tsx
  main.tsx
```

## Claude Code Prompt

> Build a React + TypeScript + Tailwind app (Vite) for tracking loan payments. I have multiple loans from different lenders. Each loan has a series of monthly payments with due dates and amounts. The main screen shows a dashboard of all loans as cards with progress bars. Tapping a card opens the payment schedule. Each payment row is tappable to toggle paid/unpaid status. Use localStorage for persistence. Include an overall summary (total owed, total paid, remaining). Color code: green = paid, amber = upcoming (within 7 days), red = overdue. Add smooth toggle animations. Make it mobile-first.

Then feed it your actual loan data (lender names, amounts, schedules) as a follow-up message.

## Phase 2 (Nice-to-Haves)

- Push notification reminders for upcoming due dates (via PWA service worker)
- Monthly calendar view
- Export payment history as CSV
- Dark mode toggle
