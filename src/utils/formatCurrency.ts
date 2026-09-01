export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) {
    return 'LKR 0.00';
  }
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
