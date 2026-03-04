import { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../auth/useAuth';
import { DataCard } from '../components/DataCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function sanitizeAmount(val: number | string | undefined): number {
  if (val == null) return 0;
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
  const parsed = Number(String(val).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

const FALLBACK_ICONS = ['🌳', '🌸', '🌱'];

export function DashboardPage() {
  const { data, loading } = useDashboard();
  const { user } = useAuth();
  const [referralCopied, setReferralCopied] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  if (loading) return <LoadingSpinner />;

  const cashback = data?.earning?.cashback;
  const paid = data?.earning?.paid;
  const mission = data?.your_mission;
  const impactSummary = data?.impact_summary;
  const collectiveEarning = sanitizeAmount(data?.collective_earning);
  const currency = mission?.currency_type || 'EUR';
  const referralCode = user?.referral_code;

  // Mission progress
  const targetAmount = sanitizeAmount(mission?.target_amount);
  const currentTotal = sanitizeAmount(mission?.current_total);
  const progress = targetAmount > 0 ? Math.min(1, currentTotal / targetAmount) : 0;

  const handleCopyReferral = () => {
    const url = `https://terry.earth/ref/${referralCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setReferralCopied(true);
      setTimeout(() => setReferralCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">

      {/* ─── Sectie 1: Header met naam + totale donaties ─── */}
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-6 text-white">
        <p className="text-lg font-semibold">{user?.name || user?.first_name || 'Mijn Account'}</p>
        <div className="flex items-center justify-between mt-3 bg-white/15 rounded-xl p-4">
          <span className="text-sm text-emerald-100">Jouw totale donaties:</span>
          <span className="text-2xl font-bold">{formatCurrency(collectiveEarning, currency)}</span>
        </div>
      </div>

      {/* ─── Sectie 2: Impact samenvatting ─── */}
      {impactSummary && impactSummary.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-3">Jouw impact tot nu toe kan worden gemeten als:</p>
          <div className="grid grid-cols-3 gap-3">
            {impactSummary.map((item, i) => (
              <div
                key={item.id ?? i}
                className="bg-white rounded-xl border border-gray-100 p-4 text-center"
              >
                <div className="text-2xl mb-1">{FALLBACK_ICONS[i] ?? '🌍'}</div>
                <p className="text-2xl font-bold text-gray-900">{item.value ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Sectie 3: Vriend uitnodigen ─── */}
      {referralCode && (
        <div>
          {!showReferral ? (
            <button
              onClick={() => setShowReferral(true)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Vriend uitnodigen
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm font-medium text-emerald-800 mb-2">Deel jouw uitnodigingslink:</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={`https://terry.earth/ref/${referralCode}`}
                  className="flex-1 text-sm bg-white border border-emerald-200 rounded-lg px-3 py-2 text-gray-700"
                />
                <button
                  onClick={handleCopyReferral}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
                >
                  {referralCopied ? 'Gekopieerd!' : 'Kopieer'}
                </button>
              </div>
              <button
                onClick={() => setShowReferral(false)}
                className="text-xs text-emerald-600 hover:underline mt-2"
              >
                Sluiten
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── Sectie 4: Jouw Huidige Missie ─── */}
      {mission?.name && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Jouw Huidige Missie</h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4">
              <h4 className="text-lg font-bold text-gray-900 text-center mb-3">{mission.name}</h4>
              <div className="flex gap-4">
                {mission.logo && (
                  <img
                    src={mission.logo}
                    alt={mission.name}
                    className="w-32 h-24 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {mission.mission_desc && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {stripHtml(mission.mission_desc)}
                    </p>
                  )}
                  {targetAmount > 0 && (
                    <p className="text-sm font-semibold text-gray-800 mt-2">
                      Goal: {formatCurrency(targetAmount, currency)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {targetAmount > 0 && (
              <div className="px-4 pb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span className="font-medium text-gray-900">
                    {formatCurrency(currentTotal, currency)}
                  </span>
                  <span>
                    Volgende mijlpaal{' '}
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(targetAmount, currency)}
                    </span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Sectie 5: Cashback overzicht ─── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Cashback overzicht</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <DataCard title="Totaal" value={formatCurrency(cashback?.total)} />
          <DataCard title="Bevestigd" value={formatCurrency(cashback?.payable ?? cashback?.confirmed)} />
          <DataCard title="In afwachting" value={formatCurrency(cashback?.pending)} />
          <DataCard title="Uitbetaald" value={formatCurrency(paid?.cashback)} />
        </div>
      </div>
    </div>
  );
}
