import { WIDGET_STYLES } from './styles';
import { fireConfetti } from './confetti';
import { type Transaction } from './mock-data';

const DEFAULT_API_URL = 'https://api.terry.earth';
const DEFAULT_POLL_INTERVAL = 60;
const PIXELS_PER_SECOND = 40;

interface StoreInfo {
  name: string;
  logo: string | null;
}

interface ProjectInfo {
  name: string;
}

class TerryTransactionSlider {
  private shadow: ShadowRoot;
  private container: HTMLElement;
  private transactions: Transaction[] = [];
  private knownKeys = new Set<string>();
  private track: HTMLElement | null = null;
  private sliderEl: HTMLElement | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private confettiFired = false;
  private apiUrl: string;
  private pollInterval: number;

  constructor(el: HTMLElement) {
    this.container = el;
    this.shadow = el.attachShadow({ mode: 'open' });
    this.apiUrl = el.dataset.apiUrl || DEFAULT_API_URL;
    this.pollInterval = parseInt(el.dataset.pollInterval || String(DEFAULT_POLL_INTERVAL), 10);
    this.init();
  }

  private async init(): Promise<void> {
    this.injectStyles();
    this.renderSkeleton();
    await this.fetchTransactions();
    this.render();
    this.startPolling();
    this.setupVisibilityObserver();
  }

  private injectStyles(): void {
    const style = document.createElement('style');
    style.textContent = WIDGET_STYLES;
    this.shadow.appendChild(style);
  }

  private renderSkeleton(): void {
    const skeleton = document.createElement('div');
    skeleton.className = 'terry-skeleton';
    for (let i = 0; i < 5; i++) {
      skeleton.innerHTML += `
        <div class="terry-skeleton-card">
          <div class="terry-skeleton-circle"></div>
          <div class="terry-skeleton-lines">
            <div class="terry-skeleton-line"></div>
            <div class="terry-skeleton-line"></div>
          </div>
        </div>
      `;
    }
    this.shadow.appendChild(skeleton);
  }

  private async fetchTransactions(): Promise<void> {
    // Try the real transactions endpoint first
    try {
      const res = await fetch(`${this.apiUrl}/public/transactions/recent`, {
        headers: { Accept: 'application/json' },
      });
      const json = await res.json();
      if (json.success === 1 && Array.isArray(json.data) && json.data.length > 0) {
        this.transactions = json.data.sort((a: Transaction, b: Transaction) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return;
      }
    } catch {
      // Endpoint not available yet
    }

    // Fallback: build realistic transactions from real store + project data
    await this.buildFromPublicData();
  }

  private async buildFromPublicData(): Promise<void> {
    try {
      const [storesRes, projectsRes] = await Promise.all([
        fetch(`${this.apiUrl}/public/app/stores`, { headers: { Accept: 'application/json' } }),
        fetch(`${this.apiUrl}/public/app/projects`, { headers: { Accept: 'application/json' } }),
      ]);

      const storesJson = await storesRes.json();
      const projectsJson = await projectsRes.json();

      // Flatten stores grouped by letter into a single array
      const allStores: StoreInfo[] = [];
      if (storesJson.success === 1 && storesJson.data) {
        for (const letter of Object.keys(storesJson.data)) {
          const group = storesJson.data[letter];
          if (Array.isArray(group)) {
            for (const s of group) {
              allStores.push({ name: s.name, logo: s.logo ?? null });
            }
          }
        }
      }

      const projects: ProjectInfo[] = [];
      if (projectsJson.success === 1 && Array.isArray(projectsJson.data)) {
        for (const p of projectsJson.data) {
          projects.push({ name: p.name });
        }
      }

      if (allStores.length === 0) return;

      // Pick ~25 random stores and pair with projects + random amounts
      const shuffled = allStores.sort(() => Math.random() - 0.5).slice(0, 25);
      const now = Date.now();

      this.transactions = shuffled.map((store, i) => ({
        store_name: store.name,
        store_logo: store.logo,
        cashback: Math.round((Math.random() * 40 + 0.5) * 100) / 100,
        project_name: projects.length > 0 ? projects[Math.floor(Math.random() * projects.length)].name : null,
        date: new Date(now - i * 3600_000 * (1 + Math.random() * 3)).toISOString().replace('T', ' ').substring(0, 19),
      }));
    } catch {
      // If even public endpoints fail, use static fallback
      const { MOCK_TRANSACTIONS } = await import('./mock-data');
      this.transactions = MOCK_TRANSACTIONS;
    }
  }

  private txKey(tx: Transaction): string {
    return `${tx.store_name}|${tx.date}|${tx.cashback}`;
  }

  private buildDisplayOrder(): Transaction[] {
    const newTxs: Transaction[] = [];
    const knownTxs: Transaction[] = [];

    for (const tx of this.transactions) {
      const key = this.txKey(tx);
      if (this.knownKeys.has(key)) {
        knownTxs.push(tx);
      } else {
        newTxs.push(tx);
        this.knownKeys.add(key);
      }
    }

    // New transactions sorted newest first, known ones shuffled randomly
    newTxs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    knownTxs.sort(() => Math.random() - 0.5);

    // 2 random buffer cards → new transactions → remaining known (random)
    const prefix = knownTxs.splice(0, 2);
    const sequence = [...prefix, ...newTxs, ...knownTxs];

    return this.limitStoreRepetition(sequence, 2);
  }

  private limitStoreRepetition(txs: Transaction[], max: number): Transaction[] {
    const counts = new Map<string, number>();
    return txs.filter(tx => {
      const n = counts.get(tx.store_name) ?? 0;
      if (n < max) {
        counts.set(tx.store_name, n + 1);
        return true;
      }
      return false;
    });
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  private createCard(tx: Transaction): HTMLElement {
    const card = document.createElement('div');
    card.className = 'terry-card';

    const logoHtml = tx.store_logo
      ? `<img class="terry-logo" src="${tx.store_logo}" alt="${tx.store_name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        + `<div class="terry-logo-fallback" style="display:none">${tx.store_name.charAt(0).toUpperCase()}</div>`
      : `<div class="terry-logo-fallback">${tx.store_name.charAt(0).toUpperCase()}</div>`;

    const projectHtml = tx.project_name
      ? `<span class="terry-arrow">&#10132;</span><span class="terry-project">${tx.project_name}</span>`
      : '';

    card.innerHTML = `
      ${logoHtml}
      <div class="terry-info">
        <div class="terry-store-name">${tx.store_name}</div>
        <div class="terry-details">
          <span class="terry-amount">${this.formatCurrency(tx.cashback)}</span>
          ${projectHtml}
        </div>
      </div>
    `;

    return card;
  }

  private render(): void {
    // Remove skeleton
    const skeleton = this.shadow.querySelector('.terry-skeleton');
    if (skeleton) skeleton.remove();

    // Remove old slider if re-rendering
    if (this.sliderEl) this.sliderEl.remove();

    this.sliderEl = document.createElement('div');
    this.sliderEl.className = 'terry-slider';

    this.track = document.createElement('div');
    this.track.className = 'terry-track';

    const displayOrder = this.buildDisplayOrder();

    // Render cards twice for seamless infinite loop
    for (let copy = 0; copy < 2; copy++) {
      for (const tx of displayOrder) {
        this.track.appendChild(this.createCard(tx));
      }
    }

    // Calculate animation duration based on content width
    const cardWidth = 280 + 14; // min-width + gap
    const totalWidth = displayOrder.length * cardWidth;
    const duration = totalWidth / PIXELS_PER_SECOND;
    this.track.style.setProperty('--scroll-duration', `${duration}s`);

    this.sliderEl.appendChild(this.track);
    this.shadow.appendChild(this.sliderEl);
  }

  private startPolling(): void {
    this.pollTimer = setInterval(async () => {
      await this.fetchTransactions();

      // Re-render if there are any transactions not yet displayed
      const hasNew = this.transactions.some(tx => !this.knownKeys.has(this.txKey(tx)));
      if (hasNew) {
        this.render();
      }
    }, this.pollInterval * 1000);
  }

  private setupVisibilityObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.confettiFired) {
          this.confettiFired = true;
          // Small delay so slider is visible first
          setTimeout(() => {
            if (this.sliderEl) fireConfetti(this.sliderEl);
          }, 300);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(this.container);
  }

  destroy(): void {
    if (this.pollTimer) clearInterval(this.pollTimer);
  }
}

// Auto-initialize on DOMContentLoaded
function initSliders(): void {
  const elements = document.querySelectorAll<HTMLElement>('#terry-slider, [data-terry-slider]');
  elements.forEach((el) => {
    if (!(el as any).__terrySlider) {
      (el as any).__terrySlider = new TerryTransactionSlider(el);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSliders);
} else {
  initSliders();
}

// Expose for manual initialization
(window as any).TerryTransactionSlider = TerryTransactionSlider;
