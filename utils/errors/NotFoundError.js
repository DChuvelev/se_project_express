const { NOT_FOUND } = require('../errorCodes');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = NOT_FOUND;
  }
}

module.exports = NotFoundError;