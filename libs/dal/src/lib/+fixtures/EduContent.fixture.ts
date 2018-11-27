import { EduContent, EduContentMetadataInterface } from '../+models';
import { EduContentMetadataFixture } from './EduContentMetadata.fixture';

export class EduContentFixture extends EduContent {
  // defaults
  contentType = 'exercise';
  type = 'foo';
  id = 1;
  publishedEduContentMetadataId: 1;
  publishedEduContentMetadata: EduContentMetadataInterface = new EduContentMetadataFixture(
    { id: this.publishedEduContentMetadataId }
  );

  constructor(
    props: Partial<EduContent> = {},
    metadata: Partial<EduContentMetadataInterface> = {}
  ) {
    super();
    // overwrite defaults
    Object.assign(this, props);
    Object.assign(this.publishedEduContentMetadata, metadata);
  }
}
