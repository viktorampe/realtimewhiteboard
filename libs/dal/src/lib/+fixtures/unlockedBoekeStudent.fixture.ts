import { UnlockedBoekeStudent } from '@diekeure/polpo-api-angular-sdk';
import { UnlockedBoekeStudentInterface } from '../+models';

export class UnlockedBoekeStudentFixture extends UnlockedBoekeStudent {
  // defaults
  index: number = 1;
  exception: boolean = false;
  id: number = 1;
  eduContentId: number = 1;
  teacherId: number = 1;
  bundleId: number = 1;
  userContentId: number = 1;

  constructor(props: Partial<UnlockedBoekeStudentInterface> = {}) {
    super();
    // overwrite defaults
    Object.assign(this, props);
  }
}
