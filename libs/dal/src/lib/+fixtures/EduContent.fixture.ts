import { EduContentInterface } from '../+models';

export class EduContentFixture implements EduContentInterface {
  // defaults
  type: string = 'foo';
  id: number = 1;
  publishedEduContentMetadataId: 1;

  constructor(props: Partial<EduContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
