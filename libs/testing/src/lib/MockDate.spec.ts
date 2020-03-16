import { fakeAsync, tick } from '@angular/core/testing';
import { MockDate } from './MockDate';

describe('MockDate', () => {
  it('should mock new Date()', fakeAsync(() => {
    const mock = new MockDate();

    const dateA = new Date();

    tick(1000);

    const dateB = new Date();

    expect(dateA).toEqual(dateB);
  }));

  it('should mock new Date() with the provided date', () => {
    const defaultDate = new Date(1000);

    const mock = new MockDate(defaultDate);

    const dateA = new Date();

    expect(dateA).toEqual(defaultDate);
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
