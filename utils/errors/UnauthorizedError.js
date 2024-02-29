const { UNAUTHORIZED } = require('../errorCodes');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = UNAUTHORIZED;
  }

}

module.exports = UnauthorizedError;