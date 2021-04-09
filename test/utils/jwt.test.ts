import { signPayload, verifyToken } from '../../src/utils/jwt';

describe('JWT Utilities', () => {
  let token = '';

  test('should sign a payload', () => {
    const jwt = signPayload({
      id: 15,
      name: 'John Smith',
    });
    token = jwt;
    expect(jwt).not.toBeUndefined();
  });

  test('should return true when token is valid', () => {
    const verify = verifyToken(token);
    expect(verify).toBe(true);
  });
});
