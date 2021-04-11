import { NextFunction, Request, Response } from "express";
import { verifyToken } from '../utils/jwt';
import k from '../utils/constants';
import { getOne } from "../services/users";

const authorization = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer') || authorization.indexOf(' ') < 0) {
    return res.status(k.STATUS_UNAUTHORIZED).json({ error: 'Invalid authorization' });
  }

  const token = authorization.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload.id || !payload.name) {
    return res.status(k.STATUS_UNAUTHORIZED).json({ error: 'Payload not recognized' });
  }

  try {
    const user = await getOne({ id: payload.id });
    if (!user.email_verified) {
      return res.status(k.STATUS_UNAUTHORIZED).json({ error: 'E-mail not verified' });
    }
  } catch (error) {
    if (error.name === 'NOT_FOUND') {
      return res.status(k.STATUS_UNAUTHORIZED).json({ error: 'User not found' });
    }
    return res.status(k.STATUS_INTERNAL_ERROR).json({ error: error.message });
  }

  next();
};

export default authorization;
