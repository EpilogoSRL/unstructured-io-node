export class StringifiableError extends Error {
  constructor(parent?: any) {
    const e = normalizeError(parent);
    super(e.message);
    if (e.name) {
      this.name = e.name;
    }
    if (e.stack) {
      this.stack = e.stack;
    }
  }

  toString() {
    return JSON.stringify({
      name: this.name,
      message: this.message,
      stack: this.stack,
    });
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
    };
  }
}

function normalizeError(err?: any) {
  if (!err) {
    return {
      name: 'Unknown',
      message: '',
      stack: null,
    };
  }

  if (typeof err === 'string') {
    return {
      name: 'Unknown',
      message: err,
      stack: null,
    };
  }

  if (typeof err === 'object' && err.message && typeof err.message === 'string') {
    return {
      name: err.name ?? 'Unknown',
      message: err.message,
      stack: err.stack ?? null,
    };
  }

  return {
    name: 'Unknown',
    message: JSON.stringify(err),
    stack: null,
  };
}
