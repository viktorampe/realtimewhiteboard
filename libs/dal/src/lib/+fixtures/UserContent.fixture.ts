import { UserContent, UserContentInterface } from '../+models';

export class UserContentFixture extends UserContent {
  name = 'foo';
  description = 'foo bar';
  type = 'link';
  link = 'foo-bar.com';
  id = 1;

  constructor(props: Partial<UserContentInterface> = {}) {
    super();
    // overwrite defaults
    Object.assign(this, props);
  }
}
