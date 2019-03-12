import { JoinPipe } from './join.pipe';

describe('JoinPipe', () => {
  it('can be created', () => {
    const pipe = new JoinPipe();
    expect(pipe).toBeTruthy();
  });

  it('succesfully transforms using default delimiter', () => {
    const input = ['a', 'b', 'c'];
    const pipe = new JoinPipe();

    expect(pipe.transform(input)).toBe(input.join(', '));
  });

  it('succesfully transforms using custom delimiter', () => {
    const input = ['a', 'b', 'c'];
    const pipe = new JoinPipe();

    expect(pipe.transform(input, ' | ')).toBe(input.join(' | '));
  });
});
