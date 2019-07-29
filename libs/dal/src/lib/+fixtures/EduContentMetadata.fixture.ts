import { EduContentMetadataInterface } from '../+models/EduContentMetadata.interface';
import { DiaboloPhaseFixture } from './DiaboloPhase.fixture';
import { EduContentBookFixture } from './EduContentBook.fixture';
import { EduContentProductTypeFixture } from './EduContentProductType.fixture';
import { EduContentTOCFixture } from './EduContentTOC.fixture';
import { EduNetFixture } from './EduNet.fixture';
import { LearningAreaFixture } from './LearningArea.fixture';
import { MethodFixture } from './Method.fixture';
import { SchoolTypeFixture } from './SchoolType.fixture';
import { YearFixture } from './Year.fixture';

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
  thumbSmall = '';
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
  fileExt = 'oefening';
  fileLabel = 'oefening';
  methods = [
    new MethodFixture({ icon: 'topos', id: 6 }),
    new MethodFixture({ icon: 'nando', id: 5 })
  ];
  eduContentProductType = new EduContentProductTypeFixture({ id: 33 });
  years = [new YearFixture({ name: '5' }), new YearFixture({ name: '6' })];
  eduNets = [
    new EduNetFixture({ code: 'GO' }),
    new EduNetFixture({ code: 'KathOndVla' })
  ];
  schoolTypes = [
    new SchoolTypeFixture({ name: 'TSO' }),
    new SchoolTypeFixture({ name: 'BSO' })
  ];
  eduContentTOC = [
    new EduContentTOCFixture({
      treeId: 1,
      eduContentBook: new EduContentBookFixture({
        id: 1,
        title: 'Shuffle 5'
      }),
      title: "Unit 2 - I'm not an addict",
      depth: 0
    }),
    new EduContentTOCFixture({
      treeId: 1,
      eduContentBook: new EduContentBookFixture({
        id: 1,
        title: 'Shuffle 5'
      }),
      title: 'Focus on',
      depth: 1
    }),
    new EduContentTOCFixture({
      treeId: 2,
      eduContentBook: new EduContentBookFixture({
        id: 2,
        title: 'Another book'
      }),
      title: 'Chapter',
      depth: 0
    }),
    new EduContentTOCFixture({
      treeId: 2,
      eduContentBook: new EduContentBookFixture({
        id: 2,
        title: 'Another book'
      }),
      title: 'Subchapter',
      depth: 1
    })
  ];
  diaboloPhase = new DiaboloPhaseFixture();
  streamable = false;

  constructor(props: Partial<EduContentMetadataInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
