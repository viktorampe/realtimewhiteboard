import { PersonInitialsPipe } from './person-initials.pipe';

xdescribe('PersonInitialsPipe', () => {
  it('create an instance', () => {
    const pipe = new PersonInitialsPipe();
    expect(pipe).toBeTruthy();
  });
});
