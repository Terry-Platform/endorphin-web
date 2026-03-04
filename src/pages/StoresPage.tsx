import { useState, useEffect, useMemo } from 'react';
import { apiGet } from '../api/client';
import { API_ROUTES } from '../api/routes';
import { useAuth } from '../auth/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.terry.earth';

interface Store {
  id: number;
  name: string;
  slug: string;
  logo: string;
  homepage: string;
  about: string;
  cashback_string: string;
  cashback_amount: string;
  alpha: string;
}

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function cleanCashbackString(str: string): string {
  if (!str) return '';
  return str.replace(/^(common\.store[._]cashback\.[a-z]+\s*)/i, '').trim();
}

function parseStores(data: any): Store[] {
  const stores: Store[] = [];
  if (typeof data !== 'object' || !data) return stores;

  for (const letter of Object.keys(data)) {
    const group = data[letter];
    if (!Array.isArray(group)) continue;
    for (const s of group) {
      if (!s?.id || !s?.name) continue;
      stores.push({
        id: s.id,
        name: s.name,
        slug: s.slug || '',
        logo: s.logo || '',
        homepage: s.homepage || '',
        about: stripHtml(s.about || ''),
        cashback_string: cleanCashbackString(s.cashback_string || ''),
        cashback_amount: s.cashback_amount || '0',
        alpha: s.alpha || letter,
      });
    }
  }

  stores.sort((a, b) => a.name.localeCompare(b.name));
  return stores;
}

export function StoresPage() {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('all');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    setLoading(true);
    apiGet<any>(API_ROUTES['app.stores'])
      .then((res) => {
        const data = res?.data || res;
        setStores(parseStores(data));
      })
      .catch(() => setError('Kon winkels niet laden.'))
      .finally(() => setLoading(false));
  }, []);

  const letters = useMemo(() => {
    const set = new Set<string>();
    stores.forEach((s) => set.add(s.alpha || s.name.charAt(0).toUpperCase()));
    return ['all', ...Array.from(set).sort()];
  }, [stores]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return stores.filter((s) => {
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.homepage.toLowerCase().includes(q);
      const first = s.alpha || s.name.charAt(0).toUpperCase();
      const matchLetter = activeLetter === 'all' || first === activeLetter;
      return matchSearch && matchLetter;
    });
  }, [stores, query, activeLetter]);

  const userId = (user as any)?.user_id ?? (user as any)?.id;

  const handleShop = (store: Store) => {
    const url = `${API_BASE}/mout/store/${store.id}/${userId}`;
    window.open(url, '_blank');
    setSelectedStore(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center py-8">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Winkels</h2>
      <p className="text-sm text-gray-500 mb-4">Shop bij een winkel en doneer automatisch</p>

      {/* Search */}
      <div className="relative max-w-md mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveLetter('all'); }}
          placeholder="Zoek een winkel..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}
      </div>

      {/* Alphabet filter */}
      <div className="flex flex-wrap gap-1 mb-4 p-2 bg-gray-50 rounded-lg">
        {letters.map((l) => (
          <button
            key={l}
            onClick={() => { setActiveLetter(l); setQuery(''); }}
            className={`min-w-[32px] h-8 px-1.5 text-xs font-medium rounded transition-colors ${
              activeLetter === l
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {l === 'all' ? 'Alle' : l}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-3">{filtered.length} winkels</p>

      {/* Store grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2">🔍</p>
          <p>Geen winkels gevonden</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className="flex flex-col items-center p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
            >
              <div className="w-16 h-16 mb-2 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                {store.logo ? (
                  <img src={store.logo} alt={store.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-2xl font-bold text-gray-300">{store.name.charAt(0)}</span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-800 leading-tight">{store.name}</span>
              {store.cashback_string && (
                <span className="mt-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  {store.cashback_string}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Store modal */}
      {selectedStore && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedStore(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStore(null)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
            >
              ✕
            </button>
            <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden">
              {selectedStore.logo ? (
                <img src={selectedStore.logo} alt={selectedStore.name} className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-3xl font-bold text-gray-300">{selectedStore.name.charAt(0)}</span>
              )}
            </div>
            <h3 className="text-lg font-bold mb-1">{selectedStore.name}</h3>
            {selectedStore.cashback_string && (
              <p className="text-sm font-semibold text-green-600 mb-2">{selectedStore.cashback_string}</p>
            )}
            {selectedStore.about && (
              <p className="text-sm text-gray-500 mb-4 max-h-24 overflow-y-auto">{selectedStore.about}</p>
            )}
            <button
              onClick={() => handleShop(selectedStore)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Shop nu & Doneer
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
