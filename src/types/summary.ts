export interface SummaryData {
  total?: number;
  confirmed?: number;
  pending?: number;
  paid?: number;
  [key: string]: unknown;
}

export interface AllSummaries {
  cashback: SummaryData | null;
  bonus: SummaryData | null;
  referral: SummaryData | null;
  click: SummaryData | null;
  payment: SummaryData | null;
}
