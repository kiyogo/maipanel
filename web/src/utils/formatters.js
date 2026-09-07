/**
 * Formats a number to Vietnamese Dong currency format (e.g. 99.000 ₫)
 */
export function formatVND(amount) {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats standard date string
 */
export function formatDate(dateInput, includeTime = true) {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('vi-VN', options).format(date);
}

/**
 * Formats storage size
 */
export function formatGB(gb) {
  if (gb >= 1024) {
    return `${(gb / 1024).toFixed(1).replace('.0', '')} TB`;
  }
  return `${gb} GB`;
}

/**
 * Truncates text with ellipsis
 */
export function truncate(str, max = 50) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '...' : str;
}
