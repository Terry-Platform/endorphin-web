import { useSummary } from '../hooks/useSummary';
import { DataCard } from '../components/DataCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { formatCurrency } from '../utils/formatCurrency';

export function SummaryPage() {
  const { data, loading, error, retry } = useSummary();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Overzicht</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <DataCard
          title="Cashback"
          value={formatCurrency(data.cashback?.total)}
          subtitle={data.cashback?.pending != null ? `In afwachting: ${formatCurrency(data.cashback.pending)}` : undefined}
        />
        <DataCard
          title="Bonus"
          value={formatCurrency(data.bonus?.total)}
        />
        <DataCard
          title="Referrals"
          value={formatCurrency(data.referral?.total)}
        />
        <DataCard
          title="Kliks"
          value={String(data.click?.total ?? '-')}
        />
        <DataCard
          title="Betalingen"
          value={formatCurrency(data.payment?.total)}
          subtitle={data.payment?.paid != null ? `Uitbetaald: ${formatCurrency(data.payment.paid)}` : undefined}
        />
      </div>
    </div>
  );
}
