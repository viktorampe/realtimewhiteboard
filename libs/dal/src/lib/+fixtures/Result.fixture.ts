import { ResultInterface } from '@campus/dal';
import { ScormStatus } from './../results/enums/scorm-status.enum';

export class ResultFixture implements ResultInterface {
  // defaults
  score?: number = 75;
  time?: number = 10000;
  status: ScormStatus = ScormStatus.STATUS_COMPLETED;
  created?: Date = new Date(2018, 11 - 1, 20);
  id?: number = 1;

  constructor(props: Partial<ResultInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
