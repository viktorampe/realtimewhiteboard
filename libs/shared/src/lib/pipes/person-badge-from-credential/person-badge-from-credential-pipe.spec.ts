import { CredentialFixture } from '@campus/dal';
import { PersonBadgeFromCredentialPipe } from './person-badge-from-credential-pipe';

describe('PersonBadgeFromCredentialPipe', () => {
  it('create an instance', () => {
    const pipe = new PersonBadgeFromCredentialPipe();
    expect(pipe).toBeTruthy();
  });

  it('should get the correct badge', () => {
    const cred1 = new CredentialFixture();
    const pipe = new PersonBadgeFromCredentialPipe();
    const expected = {
      avatar: 'lol3',
      displayName: 'lol1',
      firstName: 'lol',
      name: 'loller'
    };

    const expected2 = {
      avatar: '',
      displayName: '',
      firstName: '',
      name: ''
    };
    expect(pipe.transform(cred1)).toEqual(expected);
    expect(pipe.transform(null)).toEqual(expected2);
  });
});
