import { UnlockedBoekeGroup, UnlockedBoekeGroupInterface } from '../+models';

export class UnlockedBoekeGroupFixture extends UnlockedBoekeGroup {
  id = 1;
  eduContentId = 1;
  groupId = 1;
  teacherId = 1;

  constructor(props: Partial<UnlockedBoekeGroupInterface> = {}) {
    super();
    // overwrite defaults
    Object.assign(this, props);
  }
}
