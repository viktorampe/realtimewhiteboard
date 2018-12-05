import { EduContentMetadataInterface } from '../+models/EduContentMetadata.interface';
import { EduContentProductTypeFixture } from './EduContentProductType.fixture';
import { LearningAreaFixture } from './LearningArea.fixture';
import { MethodFixture } from './Method.fixture';

export class EduContentMetadataFixture implements EduContentMetadataInterface {
  // defaults
  version = 1;
  metaVersion = '0.1';
  language = 'nl';
  title = 'foo';
  description = 'foo';
  created = new Date('2018-12-05T13:48:00.719Z');
  published = new Date('2018-12-05T13:48:00.719Z');
  quotable = true;
  taskAllowed = true;
  standalone = false;
  teacherCanUnlock = true;
  fileName = 'foo.ludo.zip';
  file = 'foo';
  checksum = 'foo';
  link = null;
  commitMessage = 'foo';
  previewId = 'foo';
  thumb = 'foo';
  thumbSmall = 'foo';
  showCommitMessage = false;
  locked = false;
  sourceRef = 'foo';
  id = 1;
  publisherId = 1;
  eduContentId = 1;
  editorId = 1;
  learningAreaId = 1;
  learningArea = new LearningAreaFixture({ id: 1 });
  eduContentProductTypeId = 1;
  editorStatusId = 1;
  eduContentSourceId = 1;
  fileExt = 'zip';
  fileLabel = 'oefening';
  methods = [new MethodFixture({ id: 6 })];
  eduContentProductType = new EduContentProductTypeFixture({ id: 33 });

  constructor(props: Partial<EduContentMetadataInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
