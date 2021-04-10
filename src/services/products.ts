import ProductModel, { CreateProductRequest, ProductUpdateRequest } from '../models/product';
import { DatabaseError } from '../errors';
import { logger } from '../utils/logger';
import Product from '../models/product';

export interface GetProductRequest {
  id?: number;
  name?: string;
  code?: string;
}

const create = async (product: CreateProductRequest): Promise<ProductModel> => {
  try {
    const result: ProductModel = await ProductModel.create<ProductModel>(product);
    logger.debug(`New product: ${JSON.stringify(result)}`);
    return <ProductModel>result.toJSON();
  } catch (error) {
    logger.error(`Create product error: ${JSON.stringify(error)}`);
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new DatabaseError(
        'UNQ_CONS_VIOLATION',
        'Unique constraint violation',
        error.parent?.detail,
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

const getOne = async (request: GetProductRequest): Promise<ProductModel> => {
  const product = await getAll(request);
  return product[0];
};

const getAll = async (request: GetProductRequest): Promise<ProductModel[]> => {
  const products = await ProductModel.findAll({ where: { ...request } });
  if (!products || products.length === 0) {
    logger.warn(`Product not found: ${JSON.stringify(request)}`);
    throw new DatabaseError(
      'NOT_FOUND',
      'Product not found',
      JSON.stringify(request),
    );
  }
  return <ProductModel[]>products;
};

const update = async (request: ProductUpdateRequest): Promise<ProductModel> => {
  let count: number;
  let rows: Product[];

  try {
    [count, rows] = await ProductModel.update({
      ...request,
    }, {
      where: { id: request.id },
      returning: true,
      limit: 1,
    })
  } catch (error) {
    logger.error(`Update product error: ${JSON.stringify(error)}`);
    throw new DatabaseError(
      'UPDATE_ERROR',
      error.message,
      JSON.stringify(request),
    );
  }

  if (count === 0) {
    throw new DatabaseError(
      'NOT_FOUND',
      'Update affect no products',
      JSON.stringify(request),
    );
  }
  return <ProductModel>rows[0].toJSON();
};

export {
  create,
  destroy,
  getAll,
  getOne,
  update,
};
