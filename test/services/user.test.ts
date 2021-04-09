import { CreateUserRequest, UserUpdateRequest } from '../../src/models/user';
import { create, destroy, get, signin, signup, update } from '../../src/services/users';

describe('User Service', () => {
  let userId = 0;

  test('should signup a new user', async () => {
    const user: CreateUserRequest = {
      name: 'John Smith',
      email: 'john@company.com',
      password: '123456',
    };

    const result = await signup(user);
    expect(result.id).not.toBeUndefined();
    expect(result.name).toBe('John Smith');
    expect(result.email).toBe('john@company.com');
    expect(result.password).not.toBe('123456');
    expect(result.token).not.toBeUndefined();
    expect(result.registered_at).not.toBeUndefined();
    expect(result.updated_at).not.toBeUndefined();

    userId = result.id;
  });

  test('should return token when password is correct', async () => {
    const result = await signin({ email: 'john@company.com', password: '123456' });
    console.log(result);
    expect(result.id).toBe(userId);
    expect(result.name).toBe('John Smith');
    expect(result).toHaveProperty('token');
    expect(result.token).not.toBeUndefined();
  });

  test('should return error when password is not correct', async () => {
    try {
      await signin({ email: 'john@company.com', password: 'wrong' });
    } catch (error) {
      expect(error.code).toBe('INVALID_CREDENTIAL');
      expect(error.detail).toBe('john@company.com');
    }
  });

  test('should throw error if email is duplicated', async () => {
    const user: CreateUserRequest = {
      name: 'John Smith',
      email: 'john@company.com',
      password: '123456',
    };

    try {
      await create(user);
      fail();
    } catch (error) {
      expect(error.name).toBe('DatabaseError');
      expect(error.message).toBe('Unique constraint violation');
    }
  });

  test('should throw error when user is not found', async () => {
    try {
      await get({ email: 'not@found.com' });
    } catch (error) {
      expect(error.code).toBe('NOT_FOUND');
    }
  });

  test('should update user name and password', async () => {
    const request: UserUpdateRequest = {
      id: userId,
      name: 'John Francis Smith',
      password: '654321'
    }
    const result = await update(request);
    console.log(result);
    expect(result.id).toBe(userId);
    expect(result.name).toBe('John Francis Smith');
  });

  test('should signin with new credential', async () => {
    const result = await signin({ email: 'john@company.com', password: '654321' });
    console.log(result);
    expect(result.id).toBe(userId);
    expect(result.name).toBe('John Francis Smith');
    expect(result).toHaveProperty('token');
    expect(result.token).not.toBeUndefined();
  });

  test('should delete a user by id', async () => {
    const result = await destroy(userId);
    expect(result).toBe(true);
  });
});
