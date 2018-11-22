import {
  UnlockedBoekeStudent,
  UnlockedBoekeStudentInterface
} from '../+models';

export class UnlockedBoekeStudentFixture extends UnlockedBoekeStudent {
  // defaults
  index = 1;
  exception = false;
  id = 1;
  eduContentId = 1;
  teacherId = 1;
  bundleId = 1;
  userContentId = 1;

  constructor(props: Partial<UnlockedBoekeStudentInterface> = {}) {
    super();
    // overwrite defaults
    Object.assign(this, props);
  }
}
