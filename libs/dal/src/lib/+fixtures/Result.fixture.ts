import { ScormStatus } from '@campus/scorm';
import { ResultInterface } from '../+models';

export class ResultFixture implements ResultInterface {
  // defaults
  id = 1;
  eduContentId = 1;
  personId = 6;
  taskId = 1;
  status = ScormStatus.STATUS_NOT_ATTEMPTED;

  constructor(props: Partial<ResultInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
