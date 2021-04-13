import { Request, Response } from 'express';
import * as service from '../services/products';
import * as messages from '../utils/messages';
import k from '../utils/constants';
import { logger } from '../utils/logger';
import { startUserRequestTimer } from '../utils/metrics';
import { validNumber, validText } from '../utils/valid';
import { storeLocalFiles } from '../services/storage';

const create = async (req: Request, res: Response) => {
  const timer = startUserRequestTimer('signup');

  logger.debug(`Create Product request: ${JSON.stringify(req.body.name)}`);
  if (Object.keys(req.body).length === 0) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.emptyBody);
  }

  const { name, price, description, active, base64images } = req.body;
  if (!validText(name)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidName(name));
  } else if (!validNumber(price)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidPrice(price));
  }

  let result;
  try {
    result = await service.create({
      name,
      price,
      description,
      active,
    });

  } catch (error) {
    timer({ error: error.code });
    logger.error(`Create Product error: ${JSON.stringify(error)}`);
    if (error.name !== k.STATUS_INTERNAL_ERROR) {
      return res.status(k.STATUS_INVALID_REQUEST).json({
        ...error,
        error: error.message,
      });
    }
    return res.status(k.STATUS_INTERNAL_ERROR).json({...error});
  }

  if (base64images) {
    try {
      const images = await storeLocalFiles(base64images);
      result.images = await service.saveImages(result.id, images);
    } catch (error) {
      timer({ error: error.code });
      logger.error(`Store image error: ${error.message}`);
      return res.status(k.STATUS_INTERNAL_ERROR).json({ error: error.message });
    }
  }

  timer();
  res.status(k.STATUS_CREATED).json(result);
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

const getImages = async (req: Request, res: Response) => {
  const timer = startUserRequestTimer('get_images');

  logger.debug(`get product images request: ${JSON.stringify(req.body)}`);

  const { id } = req.params;
  if (!validNumber(id)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidId(id));
  }

  try {
    const result = await service.getImages(Number(id));
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

  logger.debug(`Update Product request: ${JSON.stringify(req.body.name)}`);
  if (Object.keys(req.body).length === 0) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.emptyBody);
  }

  const { id } = req.params;
  const { name, description, price, active, base64images, removedImageIds } = req.body;
  if (!validNumber(id)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidId(id));
  } else if (!validText(name)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidName(name));
  } if (!validNumber(price)) {
    return res.status(k.STATUS_INVALID_REQUEST).json(messages.invalidPrice(price));
  }

  let result;
  try {
    result = await service.update({
      id: Number(id),
      name,
      description,
      price,
      active,
    });
  } catch (error) {
    timer({ error: error.code });
    logger.error(`Product get error: ${JSON.stringify(error)}`);
    if (error.name !== k.STATUS_INTERNAL_ERROR) {
      return res.status(k.STATUS_INVALID_REQUEST).json({
        ...error,
        error: error.message,
      });
    }
    return res.status(k.STATUS_INTERNAL_ERROR).json({...error});
  }

  if (removedImageIds && Array.isArray(removedImageIds)) {
    logger.debug(`Should remove ${removedImageIds.length} images.`);
    try {
      removedImageIds.map((id) => service.destroyImage(id));
    } catch (error) {
      timer({ error: error.code });
      logger.error(`Remove image error: ${error.message}`);
      return res.status(k.STATUS_INTERNAL_ERROR).json({ error: error.message });
    }
  }

  if (base64images) {
    logger.debug(`Should store ${base64images.length} images.`);
    try {
      const images = await storeLocalFiles(base64images);
      result.images = await service.saveImages(result.id, images);
    } catch (error) {
      timer({ error: error.code });
      logger.error(`Store image error: ${error.message}`);
      return res.status(k.STATUS_INTERNAL_ERROR).json({ error: error.message });
    }
  }

  timer();
  res.status(k.STATUS_OK).json(result);
};

export {
  create,
  get,
  getImages,
  update,
};
