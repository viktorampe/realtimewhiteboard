import { StudentContentStatusInterface } from '../+models';

export class StudentContentStatusFixture
  implements StudentContentStatusInterface {
  // defaults
  id = 1;
  personId = 1;
  unlockedContentId = 1;
  taskEduContentId = 1;
  contentStatusId = 1;

  constructor(props: Partial<StudentContentStatusInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
