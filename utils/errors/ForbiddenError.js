const { FORBIDDEN } = require('../errorCodes');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.status = FORBIDDEN;
  }
}

module.exports = ForbiddenError;