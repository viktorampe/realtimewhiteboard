import { ResultStatus } from '@campus/dal';
import { StudentTaskContentInterface } from './StudentTaskContent.interface';

export class StudentTaskContentFixture implements StudentTaskContentInterface {
  required = true;
  name = 'OverhoringFoo 1';
  description = 'Oefening op delen door nul';
  icon = 'exercise';
  status = ResultStatus.STATUS_INCOMPLETE;
  lastUpdated = new Date('2 january 2018');
  score = 0;
  eduContentId = 1;
  actions = [];

  constructor(props: Partial<StudentTaskContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
