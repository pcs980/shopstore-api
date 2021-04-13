import { CreateProductRequest, ProductUpdateRequest } from '../../src/models/product';
import { create, destroy, getAll, getOne, update } from '../../src/services/products';

describe('Product Service', () => {
  let productId = 0;

  it('should create a product', async () => {
    const product: CreateProductRequest = {
      name: 'Example',
      description: 'Description of product example',
      price: 88.96
    };

    const result = await create(product);
    expect(result.id).not.toBeUndefined();
    expect(result.name).toBe('Example');
    expect(result.price).toBe('88.96');
    expect(result.published_at).not.toBeUndefined();
    expect(result.updated_at).not.toBeUndefined();

    productId = result.id;
  });

  it('should get product', async () => {
    const result = await getOne({ id: productId });
    expect(result.id).toBe(productId);
    expect(result.name).toBe('Example');
    expect(result.price).toBe('88.96');
  });

  it('should return empty array when product is not found', async () => {
    const result = await getAll({ id: 9999 });
    expect(result).not.toBeUndefined();
    expect(result).toHaveLength(0);
  });

  it('should throw error if product name is duplicated', async () => {
    const product: CreateProductRequest = {
      name: 'Example',
      price: 88.96
    };

    try {
      await create(product);
      fail();
    } catch (error) {
      expect(error.name).toBe('DatabaseError');
      expect(error.message).toBe('Unique constraint violation');
    }
  });

  it('should update product price and code', async () => {
    const request: ProductUpdateRequest = {
      id: productId,
      price: 174.10,
    }
    const result = await update(request);
    expect(result.id).toBe(productId);
    expect(result.price).toBe('174.10');
  });

  it('should delete a product by id', async () => {
    const result = await destroy(productId);
    expect(result).toBe(true);
  });
});
