import { EduContentBookInterface } from '@diekeure/polpo-api-angular-sdk';
import { EduContentMetadataInterface } from '../+models/EduContentMetadata.interface';
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
      title: "Unit 2 - I'm not an addict",
      depth: 0,
      eduContentBook: {
        title: 'Shuffle 5',
        eduContentTOC: [
          new EduContentTOCFixture({
            depth: 1,
            title: 'Focus on'
          }),
          new EduContentTOCFixture({
            depth: 2,
            title: 'What are you hooked on?'
          }),
          new EduContentTOCFixture({
            depth: 2,
            title: 'Legalising drugs'
          }),
          new EduContentTOCFixture({
            depth: 1,
            title: 'The basics'
          }),
          new EduContentTOCFixture({
            depth: 2,
            title: 'Comparisons'
          })
        ]
      } as EduContentBookInterface
    })
  ];

  constructor(props: Partial<EduContentMetadataInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
