/**
 * Parses CORS_ORIGIN from env.
 * - unset in development → allow any origin (local DX)
 * - unset in production → deny (must set explicit origins)
 * - "https://a.com,https://b.com" → allowlist
 */
export function getCorsOrigin():
  | boolean
  | string
  | string[] {
  const raw = process.env.CORS_ORIGIN?.trim();
  const isProd = process.env.NODE_ENV === 'production';

  if (!raw) {
    return isProd ? false : true;
  }

  const origins = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    return isProd ? false : true;
  }

  return origins.length === 1 ? origins[0] : origins;
}

export function getThrottleTtlMs(): number {
  const value = Number(process.env.THROTTLE_TTL_MS ?? 60_000);
  return Number.isFinite(value) && value > 0 ? value : 60_000;
}

export function getThrottleLimit(): number {
  const value = Number(process.env.THROTTLE_LIMIT ?? 100);
  return Number.isFinite(value) && value > 0 ? value : 100;
}

export function getLoginThrottleLimit(): number {
  const value = Number(process.env.LOGIN_THROTTLE_LIMIT ?? 10);
  return Number.isFinite(value) && value > 0 ? value : 10;
}
