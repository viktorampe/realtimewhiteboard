import { ScormStatus } from '../+external-interfaces/scorm-api.interface';
import { Result, ResultInterface } from '../+models';

export class ResultFixture extends Result {
  // defaults
  score = 75;
  time = 10000;
  status = ScormStatus.STATUS_COMPLETED;
  created = new Date(2018, 11 - 1, 20);
  id = 1;
  eduContentId = 1;
  personId = 6;
  taskId = 1;
  learningAreaId = 1;
  assignment = 'foo';
  taskInstanceId = 1;
  personDisplayName = 'bar';
  bundleId = 1;
  unlockedContentId = 2;

  constructor(props: Partial<ResultInterface> = {}) {
    // overwrite defaults
    super();
    Object.assign(this, props);
  }
}
