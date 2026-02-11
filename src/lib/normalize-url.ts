import { createHash } from 'crypto';

const TRACKING_PARAMS = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'mc_cid', 'mc_eid',
  'fbclid', 'gclid', 'gclsrc', 'dclid', 'msclkid',
  'ref', 'source', 'via',
  '_hsenc', '_hsmi', 'hsa_cam', 'hsa_grp', 'hsa_mt', 'hsa_src', 'hsa_ad', 'hsa_acc', 'hsa_net', 'hsa_ver', 'hsa_la', 'hsa_ol', 'hsa_kw',
  'ck_subscriber_id',
  'ss_source', 'ss_campaign_id',
]);

export function normalizeUrl(raw: string): { url: string; hash: string; domain: string } {
  const parsed = new URL(raw);

  // Force HTTPS
  parsed.protocol = 'https:';

  // Lowercase host, remove www.
  parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

  // Strip tracking params
  const params = new URLSearchParams(parsed.search);
  for (const key of [...params.keys()]) {
    if (TRACKING_PARAMS.has(key)) {
      params.delete(key);
    }
  }

  // Sort remaining params for deterministic output
  const sorted = new URLSearchParams([...params.entries()].sort());
  parsed.search = sorted.toString();

  // Remove fragment
  parsed.hash = '';

  // Remove trailing slash (except for root path)
  let url = parsed.toString();
  if (url.endsWith('/') && parsed.pathname !== '/') {
    url = url.slice(0, -1);
  }

  const hash = createHash('sha256').update(url).digest('hex');
  const domain = parsed.hostname;

  return { url, hash, domain };
}
