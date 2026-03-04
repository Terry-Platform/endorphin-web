# Endorphin Web Dashboard

Terry/Endorphin cashback-donatie platform — web dashboard SPA.
API docs staan in `../endorphin-api/CLAUDE.md`.

## Tech Stack

- React 19 + TypeScript + Vite + Tailwind CSS v4
- HashRouter (voor GitHub Pages subpath deploy)
- Dev server: `npm run dev` → port 5173 (config in `../.claude/launch.json`)
- Build: `tsc -b && vite build` → `dist/` met base `/endorphin-web/`

## Projectstructuur

```
src/
├── api/           # API client + endpoint functions
│   ├── client.ts      # apiGet, apiPost, getSocialAuthUrl
│   ├── routes.ts      # Alle API route paden
│   ├── auth.ts        # loginWithEmail, logout
│   ├── dashboard.ts   # fetchDashboard, changeProject
│   ├── activity.ts    # fetchActivity(type, monthyear)
│   └── summary.ts     # fetchCashbackSummary, fetchBonusSummary, etc.
├── auth/          # Auth context + hooks
│   ├── AuthProvider.tsx   # Token state, login/logout, dashboard fetch
│   ├── AuthContext.tsx     # AuthContextValue type
│   ├── useAuth.ts         # useAuth() hook
│   └── ProtectedRoute.tsx # Redirect naar /login als niet ingelogd
├── components/    # Herbruikbare UI
│   ├── Layout.tsx         # NavBar + Outlet wrapper (max-w-5xl)
│   ├── NavBar.tsx         # Navigatie: Dashboard, Winkels, Referral, Overzicht
│   ├── ProjectSwitcher.tsx # Dropdown voor project wisselen
│   ├── DataCard.tsx       # Statistiek kaart (titel, waarde, subtitel)
│   ├── ActivityTable.tsx  # Tabel met store_name, amount, status, date
│   ├── MonthPicker.tsx    # Dropdown voor maand selectie (MMYYYY format)
│   ├── SocialLoginButtons.tsx # Google/Apple OAuth popup login
│   ├── LoadingSpinner.tsx # Spinner
│   └── ErrorMessage.tsx   # Foutmelding met retry knop
├── hooks/         # Custom hooks
│   ├── useDashboard.ts   # { data, loading } — uit AuthContext
│   ├── useActivity.ts    # { data, loading, error, retry } — per type + maand
│   ├── useSummary.ts     # { data, loading, error, retry } — alle 5 summaries
│   └── useProject.ts     # { switchProject, switching }
├── pages/         # Route pagina's
│   ├── LoginPage.tsx       # Email/wachtwoord + social login
│   ├── OAuthCallbackPage.tsx # Safari OAuth token ontvangst
│   ├── DashboardPage.tsx   # Profiel: impact, missie, referral, cashback
│   ├── StoresPage.tsx      # Winkels met zoek, filter, modal
│   ├── ReferralPage.tsx    # Referral activiteit per maand
│   ├── SummaryPage.tsx     # Overzicht alle earnings
│   ├── CashbackPage.tsx    # (legacy) Cashback activiteit
│   └── BonusPage.tsx       # (legacy) Bonus activiteit
├── types/         # TypeScript types
│   ├── api.ts        # ApiResponse, UserInfo, AuthError
│   ├── dashboard.ts  # DashboardData, Mission, Project
│   ├── activity.ts   # ActivityItem, ActivityData, ActivityType
│   └── summary.ts    # SummaryData, AllSummaries
└── utils/
    ├── formatCurrency.ts  # formatCurrency(amount, currency='EUR', locale='nl-NL')
    ├── formatDate.ts      # formatDate, currentMonthYear, monthYearLabel
    └── storage.ts         # getItem/setItem/removeItem (localStorage + fallback)
```

## Routes (App.tsx)

```
/login              → LoginPage (publiek)
/oauth-callback     → OAuthCallbackPage (publiek)
/dashboard          → DashboardPage (beschermd)
/stores             → StoresPage (beschermd)
/referral           → ReferralPage (beschermd)
/summary            → SummaryPage (beschermd)
*                   → redirect naar /dashboard
```

## API Client Pattern

```ts
// src/api/client.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.terry.earth';

apiGet<T>(path: string): Promise<T>    // Bearer token, credentials: include
apiPost<T>(path, body): Promise<T>     // + CSRF token als _token in body
// Beide gooien AuthError bij 401
```

### Bestaande routes (src/api/routes.ts)

```ts
// Auth
'/auth/csrf-token'          '/auth/login'               '/auth/social-auth/'
'/user/logout'

// Public
'/public/app/projects'      '/public/app/stores'

// User dashboard
'/user/dashboard'           '/user/modules'             '/user/project/change'

// Summary (GET)
'/user/summary/cashback'    '/user/summary/bonus'       '/user/summary/referral'
'/user/summary/click'       '/user/summary/payment'

// Activity (GET + MMYYYY suffix, bv. '/user/activity/cashback/032026')
'/user/activity/cashback/'  '/user/activity/bonus/'     '/user/activity/referral/'
'/user/activity/click/'     '/user/activity/click/recent'

// Graph (GET)
'/user/graph/earning/year'  '/user/graph/click/30'
```

## API Response Format

Alle responses zijn HTTP 200. Error zit in de body:

```ts
// Succes
{ success: 1, data: T, error: 0 }
// Succes met user (dashboard responses)
{ success: 1, data: T, user: UserInfo, error: 0 }
// Error
{ success: 1, data: false, error: 1, msg: "error message" }
```

## Key Types

```ts
interface UserInfo {
  id: number; first_name: string; last_name: string; name: string;
  email: string; referral_code?: string; project_id?: number;
}

interface DashboardData {
  earning?: { cashback?: { total, payable, pending, confirmed, declined }; paid?: { cashback } };
  your_mission?: Mission;
  collective_earning?: number | string;
  impact_summary?: { id, label, value, icon }[];
  projects?: Project[];
}

interface Mission {
  id, name, mission_desc (HTML!), logo (URL), target_amount, current_total,
  contributed_user_count, currency_type
}

type ActivityType = 'cashback' | 'bonus' | 'referral';
interface ActivityData { items: ActivityItem[]; total?: number; }
interface SummaryData { total, confirmed, pending, paid }
```

## Auth Flow

1. Email login: `loginWithEmail(email, pw)` → token → localStorage
2. OAuth: popup naar `api.terry.earth/auth/social-auth/{google|apple}` → token via postMessage / BroadcastChannel / localStorage / redirect-back (Safari fallback)
3. Token in elke request als `Authorization: Bearer {token}`
4. 401 → AuthError → auto-logout

## Stijl & Conventies

- UI labels in **Nederlands** (Winkels, Overzicht, Uitloggen, etc.)
- Locale: `nl-NL` voor datums en valuta
- Tailwind utility classes, responsive met `sm:` / `md:` / `lg:` prefixes
- Groene kleurschema (green-600, green-700, emerald accenten)
- Geen emojis tenzij gevraagd

## Nieuwe pagina/feature toevoegen — Stappenplan

1. **Type**: Voeg types toe in `src/types/` (of hergebruik bestaande)
2. **API functie**: Maak fetch functie in `src/api/` met `apiGet<T>(route)`
3. **Route**: Voeg pad toe aan `src/api/routes.ts` als het nog niet bestaat
4. **Hook** (optioneel): Maak custom hook in `src/hooks/` voor state management
5. **Page component**: Maak pagina in `src/pages/NaamPage.tsx`
6. **Route toevoegen**: In `App.tsx` binnen de ProtectedRoute
7. **Navigatie**: Voeg link toe aan `navItems` in `NavBar.tsx`
8. **Type check**: `npx tsc --noEmit`
