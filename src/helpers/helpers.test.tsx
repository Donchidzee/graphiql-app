import { isBase64 } from './helpers';
import { describe, it, expect } from 'vitest';
describe('isBase64', () => {
  it('should return true for a valid Base64 string', () => {
    const validBase64 = btoa('hello world');
    expect(isBase64(validBase64)).toBe(true);
  });

  it('return false for an invalid Base64 string', () => {
    const invalidBase64 = 'hello world';
    expect(isBase64(invalidBase64)).toBe(false);
  });

  it('+return false for a malformed Base64 string', () => {
    const malformedBase64 = 'aGVsbG8gd29ybGQ=';
    expect(isBase64(malformedBase64 + '==')).toBe(false);
  });
});
