import { useState, useEffect, useCallback } from 'react';
import { fetchActivity } from '../api/activity';
import type { ActivityData, ActivityType } from '../types/activity';

export function useActivity(type: ActivityType, monthyear: string) {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchActivity(type, monthyear);
      if (res.error === 0) {
        setData(res.data);
      } else {
        setError('msg' in res ? res.msg ?? 'Fout bij laden' : 'Fout bij laden');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fout bij laden');
    } finally {
      setLoading(false);
    }
  }, [type, monthyear]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, retry: load };
}
