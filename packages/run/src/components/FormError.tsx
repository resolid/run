export class ServerError extends Error {
  status: number;
  constructor(message: string, { status, stack }: { status?: number; stack?: string } = {}) {
    super(message);
    this.name = 'ServerError';
    this.status = status || 400;
    if (stack) {
      this.stack = stack;
    }
  }
}

export class FormError extends ServerError {
  formError?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  fields?: {};
  fieldErrors?: { [key: string]: string };
  constructor(
    message: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    { fieldErrors = {}, form, fields, stack }: { fieldErrors?: {}; form?: FormData; fields?: {}; stack?: string } = {}
  ) {
    super(message, { stack });
    this.formError = message;
    this.name = 'FormError';
    this.fields = fields || Object.fromEntries(typeof form !== 'undefined' ? form.entries() : []) || {};
    this.fieldErrors = fieldErrors;
  }
}
