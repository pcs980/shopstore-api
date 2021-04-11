import { signPayload, verifyToken } from '../../src/utils/jwt';

describe('JWT Utilities', () => {
  let token = '';

  it('should sign a payload', () => {
    const jwt = signPayload({
      id: 15,
      name: 'John Smith',
    });
    token = jwt;
    expect(jwt).not.toBeUndefined();
  });

  it('should return true when token is valid', () => {
    const verify = verifyToken(token);
    expect(verify.id).toBe(15);
    expect(verify.name).toBe('John Smith');
  });
});
