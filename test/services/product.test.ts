import { ProductCreationAttributes } from '../../src/models/product';
import { create, destroy } from '../../src/services/products';

describe('Product Service', () => {
  let productId = 0;

  test('should create a product', async () => {
    const product: ProductCreationAttributes = {
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

  test('should throw error if product name is duplicated', async () => {
    const product: ProductCreationAttributes = {
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

  test('should delete a product by id', async () => {
    const result = await destroy(productId);
    expect(result).toBe(true);
  });
});
