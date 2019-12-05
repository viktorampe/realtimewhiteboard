import { findManyInArray, findOneInArray } from './find.service';

describe('findInArray util', () => {
  const searchableObject = {};

  const array = [
    { id: 1, property1: 1, property2: 'abc', property3: undefined },
    { id: 2, property1: 2, property2: 'abc', property3: undefined },
    { id: 3, property1: 1, property2: 'def', property3: true },
    { id: 4, property1: 2, property2: 'def', property3: true },
    { id: 5, property1: 1, property2: '', property3: searchableObject },
    { id: 6, property1: 2, property2: '', property3: searchableObject }
  ];

  describe('findManyInArray', () => {
    it('should return all objects', () => {
      const results = findManyInArray(array, {});
      expect(results.length).toBe(6);
      expect(results).toEqual(array);
    });

    it('should return the correct objects for property1', () => {
      const results = findManyInArray(array, { property1: 1 });
      expect(results.length).toBe(3);
      expect(results).toEqual([array[0], array[2], array[4]]);
    });

    it('should return the correct objects for property1, no match', () => {
      const results = findManyInArray(array, { property1: 123 });
      expect(results.length).toBe(0);
    });

    it('should return the correct objects for property1 and property2', () => {
      const results = findManyInArray(array, {
        property1: 1,
        property2: 'def'
      });
      expect(results.length).toBe(1);
      expect(results).toEqual([array[2]]);
    });

    it('should return the correct objects for property1 and property2, with falsy value', () => {
      const results = findManyInArray(array, {
        property1: 1,
        property2: ''
      });
      expect(results.length).toBe(3);
      expect(results).toEqual([array[0], array[2], array[4]]);
    });

    it('should return the correct objects when searching by reference', () => {
      const results = findManyInArray(array, {
        property1: 2,
        property3: searchableObject
      });
      expect(results.length).toBe(1);
      expect(results).toEqual([array[5]]);
    });
  });

  describe('findOneInArray', () => {
    it('should return first object', () => {
      const result = findOneInArray(array, {});
      expect(result).toEqual(array[0]);
    });

    it('should return the correct object for property1', () => {
      const result = findOneInArray(array, { property1: 1 });
      expect(result).toEqual(array[0]);
    });

    it('should return undefined for property1, no match', () => {
      const result = findOneInArray(array, { property1: 123 });
      expect(result).toBeUndefined();
    });

    it('should return the correct object for property1 and property2', () => {
      const result = findOneInArray(array, {
        property1: 1,
        property2: 'def'
      });
      expect(result).toEqual(array[2]);
    });

    it('should return the correct object for property1 and property2, with falsy value', () => {
      const result = findOneInArray(array, {
        property1: 2,
        property2: ''
      });
      expect(result).toEqual(array[1]);
    });

    it('should return the correct object when searching by reference', () => {
      const result = findOneInArray(array, {
        property1: 2,
        property3: searchableObject
      });
      expect(result).toEqual(array[5]);
    });
  });
});
