import { MockDate } from './MockDate';

describe('MockDate', () => {
  it('should mock new Date()', () => {
    const mock = new MockDate();

    const dateA = new Date();
    const dateB = new Date();

    expect(dateA).toBe(dateB);
  });

  it('should mock new Date() with the provided date', () => {
    const defaultDate = new Date(1000);

    const mock = new MockDate(defaultDate);

    const dateA = new Date();

    expect(dateA).toBe(defaultDate);
  });

  it('should mock Date.now()', () => {
    const defaultDate = new Date(1000);

    const mock = new MockDate(defaultDate);

    expect(Date.now()).toBe(defaultDate.getTime());
  });

  it('should return the real date', () => {
    const defaultDate = new Date(10000);

    const mock = new MockDate(defaultDate);

    mock.returnRealDate();

    const realDate = new Date();

    expect(realDate).not.toEqual(defaultDate);
  });
});
