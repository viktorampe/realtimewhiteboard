import { UnlockedContentInterface } from '../+models';

export class UnlockedContentFixture implements UnlockedContentInterface {
  // defaults
  index = 1;
  exception = false;
  id = 1;
  eduContentId = 1;
  teacherId = 1;
  bundleId = 1;
  userContentId = 1;

  constructor(props: Partial<UnlockedContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
