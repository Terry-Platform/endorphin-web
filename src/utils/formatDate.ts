export function formatDate(dateStr: string | undefined | null, locale = 'nl-NL'): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function currentMonthYear(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${month}${year}`;
}

export function monthYearLabel(monthyear: string): string {
  const month = parseInt(monthyear.slice(0, 2), 10);
  const year = parseInt(monthyear.slice(2), 10);
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
}
