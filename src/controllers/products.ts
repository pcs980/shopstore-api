import { Request, Response } from 'express';
import * as service from '../services/products';
import * as messages from '../utils/messages';
import k from '../utils/constants';
import { logger } from '../utils/logger';
import { startUserRequestTimer } from '../utils/metrics';
import { validText } from '../utils/valid';

const create = async (req: Request, res: Response) => {
  const timer = startUserRequestTimer('signup');

  logger.debug(`signup request: ${req.body.email}`);
  if (Object.keys(req.body).length === 0) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.emptyBody);
  }

  const { name, description, code, price, active } = req.body;
  if (!validText(name)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidName(name));
  }

  try {
    const result = await service.create({
      name,
      description,
      code,
      price,
      active,
    });

    timer();
    res.status(k.STATUS_CREATED).json(result);
  } catch (error) {
    timer({ error: error.code });
    logger.error(`Product create error: ${JSON.stringify(error)}`);
    if (error.name !== k.STATUS_INTERNAL_ERROR) {
      return res.status(k.STATUS_INVALID_REQUEST).json({
        ...error,
        error: error.message,
      });
    }
    res.status(k.STATUS_INTERNAL_ERROR).json({...error});
  }
};

const get = async (_: Request, res: Response) => {
  const timer = startUserRequestTimer('get_products');

  try {
    const result = await service.getAll({});
    timer();
    res.status(k.STATUS_OK).json(result);
  } catch (error) {
    timer({ error: error.code });
    logger.error(`Product get error: ${JSON.stringify(error)}`);
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
  create,
  get,
};
