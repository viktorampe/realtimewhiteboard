import { CredentialFixture } from '@campus/dal';
import { MailToByCredentialPipe } from './mail-to-credential-pipe';

describe('MailToByCredentialPipe', () => {
  it('create an instance', () => {
    const pipe = new MailToByCredentialPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return correct mailto', () => {
    const pipe = new MailToByCredentialPipe();
    const cred1 = new CredentialFixture({
      profile: {
        emails: [
          {
            value: 'lol@lol.lol'
          },
          {
            value: 'lol@lol.lol'
          },
          {
            value: 'lol@lol.lol'
          }
        ]
      }
    });
    expect(pipe.transform(cred1)).toBe('mailto:lol@lol.lol');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(new CredentialFixture({ profile: null }))).toBe('');
    expect(
      pipe.transform(
        new CredentialFixture({
          profile: {
            emails: []
          }
        })
      )
    ).toBe('');
  });
});
