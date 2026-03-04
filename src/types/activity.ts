export interface ActivityItem {
  id: number;
  store_name?: string;
  amount?: number;
  status?: string;
  date?: string;
  [key: string]: unknown;
}

export interface ActivityData {
  items: ActivityItem[];
  total?: number;
  [key: string]: unknown;
}

export type ActivityType = 'cashback' | 'bonus' | 'referral';
