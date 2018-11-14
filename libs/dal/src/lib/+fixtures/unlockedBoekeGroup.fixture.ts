import { UnlockedBoekeGroup, UnlockedBoekeGroupInterface } from '../+models';

export class UnlockedBoekeGroupFixture extends UnlockedBoekeGroup {
  // defaults
  id: number = 1;
  eduContentId: number = 1;
  groupId: number = 1;
  teacherId: number = 1;

  constructor(props: Partial<UnlockedBoekeGroupInterface> = {}) {
    super();
    // overwrite defaults
    Object.assign(this, props);
  }
}
