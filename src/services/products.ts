import { DatabaseError } from '../errors/DatabaseError';
import ProductModel, { ProductCreationAttributes } from '../models/product';
import { logger } from '../utils/logger';

const create = async (product: ProductCreationAttributes): Promise<ProductModel> => {
  try {
    const result: ProductModel = await ProductModel.create<ProductModel>(product);
    logger.debug(`New product: ${JSON.stringify(result)}`);
    return <ProductModel>result.toJSON();
  } catch (error) {
    logger.error(`Error creating product: ${JSON.stringify(error)}`);
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new DatabaseError(
        'Unique constraint violation',
        error.parent?.detail,
        error.parent?.code,
      );
    }
    throw new Error(error);
  }
};

const destroy = async (id: number): Promise<boolean> => {
  const result = await ProductModel.destroy({
    where: {
      id
    }
  });
  return result > 0;
};

export {
  create,
  destroy,
};
