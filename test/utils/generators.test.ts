import { generateCode, generateUuid } from '../../src/utils/generators';
import { validUuid } from '../../src/utils/valid';

describe('Generators Utilities', () => {
  it('should generate a random number', () => {
    const num = generateCode(5);
    expect(num).not.toBeUndefined();
    expect(num).toHaveLength(5);
  });

  it('should generate a uuid', () => {
    const uuid = generateUuid();
    expect(uuid).not.toBeUndefined();
    expect(validUuid(uuid)).toBe(true);
  });
});
