export interface ResponseErrorBody {
  code: string;
  message: string;
  detail?: string;
}

const INVALID_REQUEST = 'INVALID_REQUEST';

export const emptyBody = {
  code: 'EMPTY_BODY',
  message: 'Request with empty body',
};

export const invalidRequest = (message: string) => ({
  code: INVALID_REQUEST,
  message,
});

export const invalidName = (name: string) => ({
  code: INVALID_REQUEST,
  message: `Invalid name: "${name}"`,
});

export const invalidEmail = (email: string) => ({
  code: INVALID_REQUEST,
  message: `Invalid e-mail address: "${email}"`,
});
