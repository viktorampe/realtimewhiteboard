import { ResultInterface } from '@campus/dal';
import { ScormStatus } from './../results/enums/scorm-status.enum';

export class ResultFixture implements ResultInterface {
  // defaults
  score = 75;
  time = 10000;
  status = ScormStatus.STATUS_COMPLETED;
  created = new Date(2018, 11 - 1, 20);
  id = 1;

  constructor(props: Partial<ResultInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
