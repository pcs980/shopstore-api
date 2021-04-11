import { sign, verify } from 'jsonwebtoken';
import k from './constants';

interface TokenPayload {
  id: number;
  name: string;
}

const secret = k.SERVICE.JWT_SK || '';

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