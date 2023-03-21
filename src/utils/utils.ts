/**
 * General helper to compre two arrays to a set depth of nesting
 * @param {Array} arr1 - first array to compare
 * @param {Array} arr2 - second array to compare
 * @param {number} [depth] - level of nesting (optional)
 * @return {boolean} True if equal, false if not equal
 */
/* eslint-disable */
export function areArraysEqual(arr1: unknown[], arr2: unknown[], depth?: number) {
  if (arr1.length !== arr2.length) return false;
  let intDepth = 1;
  /* eslint-disable */
  if (!!depth) intDepth = depth;
  const check = (arr1: unknown[], arr2: unknown[], depth: number): boolean => {
    /* eslint-enable */
    return arr1.reduce((acc: boolean, curr: unknown, index: number) => {
      if (typeof arr2[index] !== typeof curr) return false;
      if (depth <= 1 && arr2[index] !== curr) return false;
      if (depth > 1 && Array.isArray(arr2[index]) && Array.isArray(curr)) {
        return check(arr2[index] as unknown[], curr as unknown[], depth - 1);
      }
      return acc;
    }, true);
  };

  return check(arr1, arr2, intDepth);
}

/**
 * Encode strings to gibberish
 * @param value The string to encode
 * @return Encoded string
 */
export function encodeString(value: string): string {
  return encodeURIComponent(value).replace(/'/g, '%27').replace(/"/g, '%22');
}

/**
 * Decode strings from gibberish
 * @param value The string to decode
 * @return Decoded string
 */
export function decodeString(value: string) {
  return decodeURIComponent(value.replace(/\+/g, ' '));
}
/* eslint-enable */
