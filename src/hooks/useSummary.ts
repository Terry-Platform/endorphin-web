import { useState, useEffect, useCallback } from 'react';
import {
  fetchCashbackSummary,
  fetchBonusSummary,
  fetchReferralSummary,
  fetchClickSummary,
  fetchPaymentSummary,
} from '../api/summary';
import type { AllSummaries } from '../types/summary';

const initial: AllSummaries = {
  cashback: null,
  bonus: null,
  referral: null,
  click: null,
  payment: null,
};

export function useSummary() {
  const [data, setData] = useState<AllSummaries>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cashback, bonus, referral, click, payment] = await Promise.all([
        fetchCashbackSummary(),
        fetchBonusSummary(),
        fetchReferralSummary(),
        fetchClickSummary(),
        fetchPaymentSummary(),
      ]);
      console.log('[DEBUG] Summary responses:', { cashback, bonus, referral, click, payment });
      setData({
        cashback: cashback.error === 0 ? cashback.data : null,
        bonus: bonus.error === 0 ? bonus.data : null,
        referral: referral.error === 0 ? referral.data : null,
        click: click.error === 0 ? click.data : null,
        payment: payment.error === 0 ? payment.data : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, retry: load };
}
