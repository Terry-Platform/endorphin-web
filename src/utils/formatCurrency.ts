export function formatCurrency(
  amount: number | undefined | null,
  currency = 'EUR',
  locale = 'nl-NL',
): string {
  if (amount == null) return '-';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
