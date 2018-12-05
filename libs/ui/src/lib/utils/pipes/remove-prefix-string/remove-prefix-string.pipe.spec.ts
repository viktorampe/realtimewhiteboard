import { RemovePrefixStringPipe } from './remove-prefix-string.pipe';

describe('RemovePrefixString', () => {
  it('create an instance', () => {
    const pipe = new RemovePrefixStringPipe();
    expect(pipe).toBeTruthy();
  });

  it('adds white', () => {
    const pipe = new RemovePrefixStringPipe();
    const color: string = pipe.transform('no-prefix-present', 'polpo-');
    expect(color).toBe('no-prefix-present');
  });

  it('adds black', () => {
    const pipe = new RemovePrefixStringPipe();
    const color: string = pipe.transform('no-prefix-at-start', 'polpo-');
    expect(color).toBe('no-prefix-at-start');
  });

  it('returns with pound', () => {
    const pipe = new RemovePrefixStringPipe();
    const color: string = pipe.transform('polpo-yes-prefix', 'polpo-');
    expect(color).toBe('yes-prefix');
  });
});
