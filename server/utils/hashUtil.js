const crypto = require('crypto');

/**
 * Creates a one-way cryptographic SHA-256 hash of an identifier
 * Used for rate-limiting and anonymous tracking without storing personal identity
 */
const hashIdentifier = (identifier) => {
  const salt = process.env.HASH_SALT || 'anti_spam_shield_salt_key_2026';
  return crypto
    .createHash('sha256')
    .update(`${identifier}:${salt}`)
    .digest('hex');
};

module.exports = { hashIdentifier };
