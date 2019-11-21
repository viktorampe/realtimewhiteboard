import {
  EduContent,
  EduContentMetadataInterface,
  EDU_CONTENT_TYPE
} from '../+models';
import { EduContentMetadataFixture } from './EduContentMetadata.fixture';

export class EduContentFixture extends EduContent {
  // defaults
  contentType = 'exercise';
  type = EDU_CONTENT_TYPE.LINK;
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
