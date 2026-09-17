export type LeadEventName =
  | 'page_view'
  | 'cta_click'
  | 'contact_start'
  | 'contact_submit'
  | 'contact_success';

type LeadEventDetails = Record<string, string | undefined>;

const sourceKeys = ['utm_source', 'utm_medium', 'utm_campaign'] as const;

export function getLeadSource(): string {
  if (typeof window === 'undefined') return 'direct';

  const params = new URLSearchParams(window.location.search);
  const taggedSource = sourceKeys
    .map((key) => params.get(key))
    .filter(Boolean)
    .join(' / ');

  if (taggedSource) {
    window.localStorage.setItem('lead_source', taggedSource);
    return taggedSource;
  }

  return window.localStorage.getItem('lead_source') || 'direct';
}

export function trackLeadEvent(
  name: LeadEventName,
  details: LeadEventDetails = {},
): void {
  if (typeof window === 'undefined') return;

  const event = {
    name,
    source: getLeadSource(),
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...details,
  };

  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
  if (Array.isArray(dataLayer)) {
    dataLayer.push({ event: `lead_${name}`, ...event });
  }

  window.dispatchEvent(new CustomEvent('lead-analytics', { detail: event }));
}
