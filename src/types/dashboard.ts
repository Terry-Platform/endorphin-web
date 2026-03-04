export interface DashboardData {
  earning?: {
    cashback?: {
      total?: number;
      payable?: number;
      pending?: number;
      confirmed?: number;
      declined?: number;
    };
    paid?: {
      cashback?: number;
    };
  };
  your_mission?: Mission;
  collective_earning?: number | string;
  impact?: Record<string, unknown>;
  impact_summary?: { id?: number; label?: string; value?: number; icon?: string }[];
  projects?: Project[];
  [key: string]: unknown;
}

export interface Mission {
  id?: number;
  name?: string;
  mission_desc?: string;
  logo?: string;
  target_amount?: number | string;
  current_total?: number | string;
  contributed_user_count?: number;
  currency_type?: string;
  [key: string]: unknown;
}

export interface Project {
  id: number;
  name: string;
  [key: string]: unknown;
}
