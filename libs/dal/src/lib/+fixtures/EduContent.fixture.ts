import { EduContentInterface, EduContentMetadataInterface } from '../+models';
import { EduContentMetadataFixture } from './EduContentMetadata.fixture';

export class EduContentFixture implements EduContentInterface {
  // defaults
  type: string = 'foo';
  id: number = 1;
  publishedEduContentMetadataId: 1;
  publishedEduContentMetadata: EduContentMetadataInterface = new EduContentMetadataFixture(
    { id: this.publishedEduContentMetadataId }
  );

  constructor(
    props: Partial<EduContentInterface> = {},
    metadata: Partial<EduContentMetadataInterface> = {}
  ) {
    // overwrite defaults
    Object.assign(this, props);
    Object.assign(this.publishedEduContentMetadata, metadata);
  }
}
