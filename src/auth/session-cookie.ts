import { CookieOptions } from 'express';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from './auth.constants';

export function getSessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE_MS,
    path: '/',
  };
}

export function getClearSessionCookieOptions(): CookieOptions {
  const { maxAge: _maxAge, ...options } = getSessionCookieOptions();
  return options;
}

export { SESSION_COOKIE_NAME };
