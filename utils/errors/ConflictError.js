const { CONFLICT } = require('../errorCodes');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = CONFLICT;
  }
}

module.exports = ConflictError;