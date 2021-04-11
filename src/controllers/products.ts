import { Request, Response } from 'express';
import * as service from '../services/products';
import * as messages from '../utils/messages';
import k from '../utils/constants';
import { logger } from '../utils/logger';
import { startUserRequestTimer } from '../utils/metrics';
import { validNumber, validText } from '../utils/valid';

const create = async (req: Request, res: Response) => {
  const timer = startUserRequestTimer('signup');

  logger.debug(`create product request: ${JSON.stringify(req.body)}`);
  if (Object.keys(req.body).length === 0) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.emptyBody);
  }

  const { name, description, price, active } = req.body;
  if (!validText(name)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidName(name));
  }

  try {
    const result = await service.create({
      name,
      description,
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

const update = async (req: Request, res: Response) => {
  const timer = startUserRequestTimer('update_products');

  logger.debug(`update product request: ${JSON.stringify(req.body)}`);
  if (Object.keys(req.body).length === 0) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.emptyBody);
  }

  const { id } = req.params;
  const { name, description, price, active } = req.body;
  if (!validNumber(id)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidId(id));
  } else if (!validText(name)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidName(name));
  } if (!validNumber(price)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidPrice(price));
  } else

  try {
    const result = await service.update({
      id: Number(id),
      name,
      description,
      price,
      active,
    });
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
  update,
};
