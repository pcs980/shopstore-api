import * as is from '../../src/utils/valid';

describe('Validation Utilities', () => {
  it('should identify valid text', () => {
    expect(is.validText(' text')).toBe(true);
  });

  it('should identify invalid text', () => {
    expect(is.validText('')).toBe(false);
  });

  it('should identify invalid text', () => {
    expect(is.validText('   ')).toBe(false);
  });

  it('should identify a valid e-mail', () => {
    expect(is.validEmail('abc@def.com')).toBe(true);
  });

  it('should identify an invalid e-mail', () => {
    expect(is.validEmail('abc.com')).toBe(false);
  });

  it('should identify an invalid e-mail', () => {
    expect(is.validEmail('  ')).toBe(false);
  });
});
