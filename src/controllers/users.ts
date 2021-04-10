import { Request, Response } from 'express';
import * as service from '../services/users';
import * as messages from '../utils/messages';
import k from '../utils/constants';
import { validText } from '../utils/valid';
import { logger } from '../utils/logger';

let errorBody: messages.ResponseErrorBody = {
  code: '',
  message: '',
};

const signup = async (req: Request, res: Response) => {
  logger.debug(`signup request ${JSON.stringify(req.body)}`);
  if (Object.keys(req.body).length === 0) {
    errorBody = messages.emptyBody;
  }

  const { name, password, email } = req.body;
  if (!validText(name)) {
    errorBody = messages.invalidName(name);
  } else if (!validText(password)) {
    errorBody = messages.invalidRequest(`Invalid password`);
  } else if (!validText(email)) {
    errorBody = messages.invalidEmail(email);
  }
  if (errorBody.code) {
    return res.status(k.STATUS_INVALID_REQUEST).json(errorBody);
  }

  try {
    const result = await service.signup({
      name,
      password,
      email
    });
    res.status(k.STATUS_CREATED).json(result);
  } catch (error) {
    res.status(k.STATUS_INTERNAL_ERROR).json(error);
  }
};

const signin = async (req: Request, res: Response) => {
  logger.debug(`signin request ${JSON.stringify(req.body)}`);
  if (Object.keys(req.body).length === 0) {
    errorBody = messages.emptyBody;
  }

  const { email, password } = req.body;
  if (!validText(password)) {
    errorBody = messages.invalidRequest(`Invalid password`);
  } else if (!validText(email)) {
    errorBody = messages.invalidEmail(email);
  }
  if (errorBody.code) {
    return res.status(k.STATUS_INVALID_REQUEST).json(errorBody);
  }

  try {
    const result = await service.signin({
      email,
      password,
    })
    res.status(k.STATUS_SUCCESS).json(result);
  } catch (error) {
    res.status(k.STATUS_INTERNAL_ERROR).json(error);
  }
};

export {
  signin,
  signup,
};
