import { PassportUserCredentialInterface } from './../+models/PassportUserCredential.interface';

export class CredentialFixture implements PassportUserCredentialInterface {
  // defaults
  profile = {
    basisrol: 'Leerling',
    avatar: 'lol3',
    name: {
      displayName: 'lol1',
      givenName: 'lol',
      familyName: 'loller'
    }
  };
  provider = 'smartschool';
  id = 1;
  userId = 1;

  constructor(props: Partial<PassportUserCredentialInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
