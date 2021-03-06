import { Request, Response } from 'express';
import * as service from '../services/users';
import * as messages from '../utils/messages';
import k from '../utils/constants';
import { validEmail, validNumber, validText } from '../utils/valid';
import logger from '../utils/logger';
import { startUserRequestTimer } from '../utils/metrics';

const confirmCode = async (req: Request, res: Response) => {
  const timer = startUserRequestTimer('user_confirm_code');

  logger.debug(`signup request: ${req.body.email}`);
  if (Object.keys(req.body).length === 0) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.emptyBody);
  }

  const { id, code } = req.body;
  if (!validNumber(id) || id < 0) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidId(id));
  } else if (!validNumber(code) || id < 0) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidConfirmationCode(code));
  }

  try {
    const result = await service.confirmCode({ id, code });
    timer();
    res.status(k.STATUS_OK).json(result);
  } catch (error) {
    timer({ error: error.code });
    logger.error(`Confirm code error: ${JSON.stringify(error)}`);
    if (error.name !== k.STATUS_INTERNAL_ERROR) {
      return res.status(k.STATUS_INVALID_REQUEST).json({
        ...error,
        error: error.message,
      });
    }
    res.status(k.STATUS_INTERNAL_ERROR).json({...error});
  }
};

const signup = async (req: Request, res: Response) => {
  const timer = startUserRequestTimer('user_signup');

  logger.debug(`signup request: ${req.body.email}`);
  if (Object.keys(req.body).length === 0) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.emptyBody);
  }

  const { name, password, email } = req.body;
  if (!validText(name)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidName(name));
  } else if (!validText(password)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidRequest(`Invalid password`));
  } else if (!validEmail(email)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidEmail(email));
  }

  try {
    const result = await service.signup({
      name,
      password,
      email
    });
    result.password = '';

    timer();
    res.status(k.STATUS_CREATED).json(result);
  } catch (error) {
    timer({ error: error.code });
    logger.error(`User signup error: ${JSON.stringify(error)}`);
    if (error.name !== k.STATUS_INTERNAL_ERROR) {
      return res.status(k.STATUS_INVALID_REQUEST).json({
        ...error,
        error: error.message,
      });
    }
    res.status(k.STATUS_INTERNAL_ERROR).json({...error});
  }
};

const signin = async (req: Request, res: Response) => {
  const timer = startUserRequestTimer('user_signin');

  logger.debug(`signin request: ${req.body.email}`);
  if (Object.keys(req.body).length === 0) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.emptyBody);
  }

  const { email, password } = req.body;
  if (!validText(password)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidRequest(`Invalid password`));
  } else if (!validEmail(email)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidEmail(email));
  }

  try {
    const result = await service.signin({
      email,
      password,
    });
    result.password = '';

    timer();
    res.status(k.STATUS_OK).json(result);
  } catch (error) {
    timer({ error: error.code });
    logger.error(`User signin error: ${JSON.stringify(error)}`);
    if (error.name !== k.STATUS_INTERNAL_ERROR) {
      return res.status(k.STATUS_INVALID_REQUEST).json({
        ...error,
        error: error.message,
      });
    }
    res.status(k.STATUS_INTERNAL_ERROR).json({...error});
  }
};

export {
  confirmCode,
  signin,
  signup,
};
