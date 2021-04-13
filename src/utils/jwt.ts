import { sign, verify } from 'jsonwebtoken';
import k from './constants';

interface TokenPayload {
  id: number;
  name: string;
}

const secret = k.SERVICE.JWT_SK || '';

const signPayload = (payload: TokenPayload): string => {
  return sign(payload, secret);
};

const verifyToken = (token: string): any => {
  try {
    const payload = verify(token, secret);
    return payload;
  } catch (error) {
    return false;
  }
};

export {
  signPayload,
  verifyToken,
};
