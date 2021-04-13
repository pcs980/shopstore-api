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

  it('should identify an valid uuid with case insensitive', () => {
    expect(is.validUuid('A3540CcC-C7bB-4D37-b50E-d0300D2C81A9')).toBe(true);
  });

  it('should identify an invalid uuid', () => {
    expect(is.validUuid('abcd123-xyz-4567-efghijk123')).toBe(false);
  });
});
