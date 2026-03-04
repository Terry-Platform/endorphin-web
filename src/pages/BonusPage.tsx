import { useState } from 'react';
import { useActivity } from '../hooks/useActivity';
import { MonthPicker } from '../components/MonthPicker';
import { ActivityTable } from '../components/ActivityTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { currentMonthYear } from '../utils/formatDate';

export function BonusPage() {
  const [month, setMonth] = useState(currentMonthYear());
  const { data, loading, error, retry } = useActivity('bonus', month);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Bonus</h2>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={retry} />}
      {data && <ActivityTable items={data.items ?? []} />}
    </div>
  );
}
