import { UnlockedFreePracticeInterface } from '../+models';

export class UnlockedFreePracticeFixture
  implements UnlockedFreePracticeInterface {
  // defaults
  id = 1;
  eduContentBookId = 1;
  classGroupId = 1;

  constructor(props: Partial<UnlockedFreePracticeInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
