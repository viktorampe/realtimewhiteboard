import {
  EduContentFixture,
  EduContentInterface,
  ResultStatus
} from '@campus/dal';
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
  eduContent = new EduContentFixture();
  actions = [];

  constructor(
    props: Partial<StudentTaskContentInterface> = {},
    eduContent?: Partial<EduContentInterface>
  ) {
    // overwrite defaults
    Object.assign(this, props, eduContent);
  }
}
