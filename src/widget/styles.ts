export const WIDGET_STYLES = `
  :host {
    display: block;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .terry-slider {
    overflow: hidden;
    padding: 12px 0;
    position: relative;
    mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  }

  .terry-track {
    display: flex;
    gap: 14px;
    width: max-content;
    animation: terry-scroll var(--scroll-duration, 60s) linear infinite;
  }

  .terry-track:hover {
    animation-play-state: paused;
  }

  @keyframes terry-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .terry-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    border-radius: 14px;
    padding: 10px 16px;
    min-width: 280px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    cursor: default;
    flex-shrink: 0;
  }

  .terry-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);
  }

  .terry-logo {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    object-fit: contain;
    background: #f9fafb;
    border: 1px solid #f3f4f6;
    flex-shrink: 0;
  }

  .terry-logo-fallback {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #16a34a, #059669);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 16px;
    flex-shrink: 0;
  }

  .terry-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .terry-store-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .terry-details {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
  }

  .terry-amount {
    font-weight: 700;
    color: #16a34a;
    white-space: nowrap;
  }

  .terry-arrow {
    color: #d1d5db;
    font-size: 11px;
    flex-shrink: 0;
  }

  .terry-project {
    color: #6b7280;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  }

  .terry-skeleton {
    display: flex;
    gap: 14px;
    padding: 12px 0;
    overflow: hidden;
  }

  .terry-skeleton-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    border-radius: 14px;
    padding: 10px 16px;
    min-width: 280px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
    flex-shrink: 0;
  }

  .terry-skeleton-circle {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: terry-shimmer 1.5s infinite;
    flex-shrink: 0;
  }

  .terry-skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }

  .terry-skeleton-line {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: terry-shimmer 1.5s infinite;
  }

  .terry-skeleton-line:first-child { width: 70%; }
  .terry-skeleton-line:last-child { width: 50%; }

  @keyframes terry-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 640px) {
    .terry-card {
      min-width: 240px;
      padding: 8px 12px;
    }

    .terry-logo, .terry-logo-fallback {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }

    .terry-store-name { font-size: 13px; }
    .terry-details { font-size: 12px; }
    .terry-project { max-width: 120px; }
  }
`;
