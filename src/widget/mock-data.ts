export interface Transaction {
  store_name: string;
  store_logo: string | null;
  cashback: number;
  project_name: string | null;
  date: string;
  status?: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { store_name: 'Bol.com', store_logo: null, cashback: 12.34, project_name: 'One Tree Planted', date: '2026-03-03 10:15:00' },
  { store_name: 'Coolblue', store_logo: null, cashback: 28.45, project_name: 'Oceaanbescherming', date: '2026-03-03 09:42:00' },
  { store_name: 'Zalando', store_logo: null, cashback: 5.67, project_name: 'Regenwoud Herstel', date: '2026-03-03 08:30:00' },
  { store_name: 'MediaMarkt', store_logo: null, cashback: 15.20, project_name: 'Koraalrif Herstel', date: '2026-03-02 22:10:00' },
  { store_name: 'H&M', store_logo: null, cashback: 3.89, project_name: 'One Tree Planted', date: '2026-03-02 20:45:00' },
  { store_name: 'Booking.com', store_logo: null, cashback: 42.10, project_name: 'Schone Energie', date: '2026-03-02 18:20:00' },
  { store_name: 'ASOS', store_logo: null, cashback: 7.56, project_name: 'Regenwoud Herstel', date: '2026-03-02 16:55:00' },
  { store_name: 'Nike', store_logo: null, cashback: 9.30, project_name: 'Oceaanbescherming', date: '2026-03-02 15:30:00' },
  { store_name: 'Wehkamp', store_logo: null, cashback: 18.75, project_name: 'One Tree Planted', date: '2026-03-02 14:10:00' },
  { store_name: 'Adidas', store_logo: null, cashback: 6.40, project_name: 'Schone Energie', date: '2026-03-02 12:45:00' },
  { store_name: 'Albert Heijn', store_logo: null, cashback: 2.15, project_name: 'Koraalrif Herstel', date: '2026-03-02 11:20:00' },
  { store_name: 'Bijenkorf', store_logo: null, cashback: 31.60, project_name: 'Regenwoud Herstel', date: '2026-03-02 09:50:00' },
  { store_name: 'Decathlon', store_logo: null, cashback: 11.25, project_name: 'One Tree Planted', date: '2026-03-01 23:30:00' },
  { store_name: 'IKEA', store_logo: null, cashback: 8.90, project_name: 'Schone Energie', date: '2026-03-01 21:15:00' },
  { store_name: 'Thuisbezorgd', store_logo: null, cashback: 1.45, project_name: 'Oceaanbescherming', date: '2026-03-01 19:40:00' },
  { store_name: 'Kruidvat', store_logo: null, cashback: 4.30, project_name: 'Regenwoud Herstel', date: '2026-03-01 17:25:00' },
  { store_name: 'Efteling', store_logo: null, cashback: 22.80, project_name: 'One Tree Planted', date: '2026-03-01 15:00:00' },
  { store_name: 'Rituals', store_logo: null, cashback: 13.55, project_name: 'Koraalrif Herstel', date: '2026-03-01 13:30:00' },
  { store_name: 'Gamma', store_logo: null, cashback: 7.20, project_name: 'Schone Energie', date: '2026-03-01 11:10:00' },
  { store_name: 'COS', store_logo: null, cashback: 16.90, project_name: 'Regenwoud Herstel', date: '2026-03-01 09:00:00' },
];
