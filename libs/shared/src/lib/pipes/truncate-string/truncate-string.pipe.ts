import { TruncateStringPipe } from './truncate-string.pipe.spec';

describe('HumanDateTimePipe', () => {
  it('create an instance', () => {
    const pipe = new TruncateStringPipe();
    expect(pipe).toBeTruthy();
  });

  it('should show the text for less than a minute', () => {
    const date: Date = new Date();
    const pipe = new TruncateStringPipe();
    const output = pipe.transform(
      'this string will be truncated to three chars',
      '...',
      3
    );
    expect(output).toBe('');
  });
});
