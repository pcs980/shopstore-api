import { Request, Response } from 'express';
import * as service from '../services/users';
import * as messages from '../utils/messages';
import k from '../utils/constants';
import { validEmail, validText } from '../utils/valid';
import { logger } from '../utils/logger';
import { startUserRequestTimer } from '../utils/metrics';

const signup = async (req: Request, res: Response) => {
  const timer = startUserRequestTimer('signup');

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
  const timer = startUserRequestTimer('signin');

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
  signin,
  signup,
};
