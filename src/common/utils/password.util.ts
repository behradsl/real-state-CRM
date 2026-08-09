import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * One-way hash for storing passwords.
 * Passwords cannot be decrypted — use comparePassword() at login.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Verify a plain password against a stored hash (for login).
 */
export async function comparePassword(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}
