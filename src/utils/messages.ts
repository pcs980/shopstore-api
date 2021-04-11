export interface ResponseErrorBody {
  code: string;
  error: string;
  detail?: string;
}

const INVALID_REQUEST = 'INVALID_REQUEST';

export const emptyBody = {
  code: 'EMPTY_BODY',
  error: 'Request with empty body',
};

export const invalidRequest = (error: string) => ({
  code: INVALID_REQUEST,
  error,
});

export const invalidId = (id: string) => ({
  code: INVALID_REQUEST,
  error: `Invalid id: "${id}"`,
});

export const invalidName = (name: string) => ({
  code: INVALID_REQUEST,
  error: `Invalid name: "${name}"`,
});

export const invalidEmail = (email: string) => ({
  code: INVALID_REQUEST,
  error: `Invalid e-mail address: "${email}"`,
});

export const invalidPrice = (price: string) => ({
  code: INVALID_REQUEST,
  error: `Invalid price: "${price}"`,
});

export const invalidConfirmationCode = (code: string) => ({
  code: INVALID_REQUEST,
  error: `Invalid confirmation code: "${code}"`,
});
