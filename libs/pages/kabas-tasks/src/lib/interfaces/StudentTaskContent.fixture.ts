import { EduContentFixture, ResultStatus } from '@campus/dal';
import { StudentTaskContentInterface } from './StudentTaskContent.interface';

export class StudentTaskContentFixture implements StudentTaskContentInterface {
  required = true;
  name = 'OverhoringFoo 1';
  description = 'Oefening op delen door nul';
  icon = 'exercise';
  status = ResultStatus.STATUS_INCOMPLETE;
  lastUpdated = new Date(Date.now() - 1 * 24 * 3600 * 1000);
  score = 0;
  eduContentId = 1;
  eduContent = new EduContentFixture();
  actions = [];

  constructor(props: Partial<StudentTaskContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
