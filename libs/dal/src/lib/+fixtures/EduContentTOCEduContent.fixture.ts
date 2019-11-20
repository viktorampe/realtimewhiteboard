import { EduContentTOCEduContentInterface } from '../+models/EduContentTOCEduContent.interface';

export class EduContentTOCEduContentFixture
  implements EduContentTOCEduContentInterface {
  id = 1;
  eduContentId = 1;
  eduContentTOCId = 1;

  constructor(props: Partial<EduContentTOCEduContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
