export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-ES');
};

export const ensureDate = (date: string | Date | undefined): Date => {
  if (!date) return new Date();
  return typeof date === 'string' ? new Date(date) : date;
};

export const debugLog = (message: string, data?: any) => {
  console.log(`[DEBUG] ${message}`, data);
};