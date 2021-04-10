import { compareHash, hashText } from '../../src/utils/crypt';

describe('Encryption Utilities', () => {
  it('should generate an encrypted text', async () => {
    const text = 'password';
    const result = await hashText(text);
    expect(result).not.toBeUndefined();
    expect(result).not.toBe(text);
  });

  it('should encrypted text not repeat', async () => {
    const text = 'password';
    const firstHash = await hashText(text);
    const secondHash = await hashText(text);
    expect(firstHash).not.toBeUndefined();
    expect(secondHash).not.toBe(text);
    expect(firstHash).not.toBe(secondHash);
  });

  it('should return true when comparing hash to original text', async () => {
    const text = 'password';
    const hash = await hashText(text);
    const result = await compareHash(text, hash);
    expect(result).toBe(true);
  });

  it('should return false when comparing hash to another text', async () => {
    const text = 'password';
    const wrong = 'wrong';
    const hash = await hashText(text);
    const result = await compareHash(wrong, hash);
    expect(result).toBe(false);
  });
});
