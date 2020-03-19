import { RangePipe } from './range.pipe';

describe('Range', () => {
  it('create an instance', () => {
    const pipe = new RangePipe();
    expect(pipe).toBeTruthy();
  });

  it('returns an array with n indexes as items', () => {
    const pipe = new RangePipe();
    const numbers: number[] = pipe.transform(3);
    expect(numbers).toEqual([0, 1, 2]);
  });
  it('returns an array with n indexes as items starting from offset', () => {
    const pipe = new RangePipe();
    const numbers: number[] = pipe.transform(3, 10);
    expect(numbers).toEqual([10, 11, 12]);
  });
  it('should return empty array if length is undefined', () => {
    const pipe = new RangePipe();
    const numbers: number[] = pipe.transform(undefined);
    expect(numbers).toEqual([]);
  });
  it('should return empty array if length is 0', () => {
    const pipe = new RangePipe();
    const numbers: number[] = pipe.transform(0);
    expect(numbers).toEqual([]);
  });
});
