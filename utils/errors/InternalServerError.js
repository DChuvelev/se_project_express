const { INTERNAL_SERVER_ERROR } = require('../errorCodes');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.status = INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;