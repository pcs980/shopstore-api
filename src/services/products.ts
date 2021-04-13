import Product, { CreateProductRequest, ProductUpdateRequest } from '../models/product';
import ProductImage from '../models/productImage';
import { DatabaseError } from '../errors';
import { logger } from '../utils/logger';

export interface GetProductRequest {
  id?: number;
  name?: string;
  code?: string;
}

const create = async (product: CreateProductRequest): Promise<Product> => {
  try {
    const result: Product = await Product.create(product);
    logger.debug(`New product: ${JSON.stringify(result)}`);
    return <Product>result.toJSON();
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
  const result = await Product.destroy({ where: { id }});
  return result > 0;
};

const getOne = async (request: GetProductRequest): Promise<Product> => {
  const product = await getAll(request);
  return product[0];
};

const getAll = async (request: GetProductRequest): Promise<Product[]> => {
  const products = await Product.findAll({
    where: { ...request },
    order: ['name'],
  });
  if (!products || products.length === 0) {
    logger.warn(`Product not found: ${JSON.stringify(request)}`);
  }

  return products;
};

const update = async (request: ProductUpdateRequest): Promise<Product> => {
  let count: number;
  let rows: Product[];

  try {
    [count, rows] = await Product.update({
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
  return <Product>rows[0].toJSON();
};

const destroyImage = async (id: number): Promise<boolean> => {
  const result = await ProductImage.destroy({ where: { id }});
  return result > 0;
};

const getImages = async (productId: number): Promise<ProductImage[]> => {
  const images = await ProductImage.findAll({ where: { product_id: productId }});
  return images;
};

const saveImages = async (productId: number, images: string[]): Promise<ProductImage[]> => {
  try {
    const promises = images.map((image) => (
      ProductImage.create({
        product_id: productId,
        image_name: image,
      }).then((result) => <ProductImage>result.toJSON())
    ));
    const res = await Promise.all(promises);
    logger.debug(`Saved product images: ${JSON.stringify(res)}`);
    return res;
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

export {
  create,
  destroy,
  destroyImage,
  getAll,
  getImages,
  getOne,
  saveImages,
  update,
};
