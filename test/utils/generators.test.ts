import { generateCode } from '../../src/utils/generators';

describe('Generators Utilities', () => {
  it('should generate a random number', () => {
    const num = generateCode(5);
    console.log(num);
    expect(num).not.toBeUndefined();
    expect(num).toHaveLength(5);
  });
});