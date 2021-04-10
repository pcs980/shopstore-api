import { CreateUserRequest, UserUpdateRequest } from '../../src/models/user';
import { create, destroy, getOne, signin, signup, update } from '../../src/services/users';

describe('User Service', () => {
  let userId = 0;

  it('should signup a new user', async () => {
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

  it('should return token when password is correct', async () => {
    const result = await signin({ email: 'john@company.com', password: '123456' });
    expect(result.id).toBe(userId);
    expect(result.name).toBe('John Smith');
    expect(result).toHaveProperty('token');
    expect(result.token).not.toBeUndefined();
  });

  it('should return error when password is not correct', async () => {
    try {
      await signin({ email: 'john@company.com', password: 'wrong' });
      fail();
    } catch (error) {
      expect(error.code).toBe('INVALID_CREDENTIAL');
      expect(error.detail).toBe('john@company.com');
    }
  });

  it('should throw error if email is duplicated', async () => {
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

  it('should get user', async () => {
    const result = await getOne({ email: 'john@company.com' });
    expect(result.id).toBe(userId);
    expect(result.name).toBe('John Smith');
    expect(result.email).toBe('john@company.com');
    expect(result.email_verified).toBe(false);
  });

  it('should throw error when user is not found', async () => {
    try {
      await getOne({ email: 'not@found.com' });
      fail();
    } catch (error) {
      expect(error.code).toBe('NOT_FOUND');
    }
  });

  it('should update user name and password', async () => {
    const request: UserUpdateRequest = {
      id: userId,
      name: 'John Francis Smith',
      password: '654321'
    }
    const result = await update(request);
    expect(result.id).toBe(userId);
    expect(result.name).toBe('John Francis Smith');
  });

  it('should signin with new credential', async () => {
    const result = await signin({ email: 'john@company.com', password: '654321' });
    expect(result.id).toBe(userId);
    expect(result.name).toBe('John Francis Smith');
    expect(result).toHaveProperty('token');
    expect(result.token).not.toBeUndefined();
  });

  it('should delete a user by id', async () => {
    const result = await destroy(userId);
    expect(result).toBe(true);
  });
});
