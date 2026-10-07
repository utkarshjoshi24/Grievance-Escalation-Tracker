const { v4: uuidv4 } = require('uuid');

/**
 * Generates an institutional tracking token (e.g. GET-2026-4819)
 */
const generateTrackingToken = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `GET-${year}-${randomSuffix}`;
};

/**
 * Generates a full RFC-compliant UUID v4
 */
const generateUUID = () => {
  return uuidv4();
};

module.exports = {
  generateTrackingToken,
  generateUUID,
};
