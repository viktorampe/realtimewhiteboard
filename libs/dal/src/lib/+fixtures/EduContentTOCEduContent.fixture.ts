import { EduContentTOCEduContentInterface } from '../+models/EduContentTOCEduContent.interface';

export class EduContentTOCEduContentFixture
  implements EduContentTOCEduContentInterface {
  id = '1-1';
  eduContentId = 1;
  eduContentTOCId = 1;
  type = 'exercise';

  constructor(props: Partial<EduContentTOCEduContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
