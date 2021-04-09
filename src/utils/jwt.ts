import { sign, verify } from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  name: string;
}

const secret = process.env.JWT_SK || '';

export const signPayload = (payload: TokenPayload): string => {
  return sign(payload, secret);
};

export const verifyToken = (token: string): boolean => {
  try {
    verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
};