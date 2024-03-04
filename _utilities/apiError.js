class APIError extends Error {
  constructor(name, status = 500, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }

    this.name = name;
    this.status = status;

    // Custom debugging information
    this.name = name;
    this.date = new Date();
  }
}

export default APIError;