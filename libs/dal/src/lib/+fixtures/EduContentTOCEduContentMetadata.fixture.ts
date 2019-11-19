import { EduContentTOCEduContentMetadataInterface } from '../+models/EduContentTOCEduContentMetadata.interface';

export class EduContentTOCFixture
  implements EduContentTOCEduContentMetadataInterface {
  id = 1;
  eduContentMetadataId = 1;
  eduContentTOCId = 1;

  constructor(props: Partial<EduContentTOCEduContentMetadataInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
