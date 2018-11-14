import { UnlockedContentInterface } from '../+models';

export class UnlockedContentFixture implements UnlockedContentInterface {
  // defaults
  index: number = 1;
  exception: boolean = false;
  id: number = 1;
  eduContentId: number = 1;
  teacherId: number = 1;
  bundleId: number = 1;
  userContentId: number = 1;

  constructor(props: Partial<UnlockedContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
