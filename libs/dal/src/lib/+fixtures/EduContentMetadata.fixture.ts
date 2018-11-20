import { EduContentMetadataInterface } from '../+models';

export class EduContentMetadataFixture implements EduContentMetadataInterface {
  // defaults
  version: number = 1;
  metaVersion: string = '0.1';
  language: string = 'nl';
  title: string = 'foo';
  description: string = 'foo';
  created: Date = new Date();
  published: Date = new Date();
  quotable: boolean = true;
  taskAllowed: boolean = true;
  standalone: boolean = false;
  teacherCanUnlock: boolean = true;
  fileName: string = 'foo.ludo.zip';
  file: string = 'foo';
  checksum: string = 'foo';
  link: string = null;
  commitMessage: string = 'foo';
  previewId: string = 'foo';
  thumb: string = 'foo';
  thumbSmall: string = 'foo';
  showCommitMessage: boolean = false;
  locked: boolean = false;
  sourceRef: string = 'foo';
  id: number = 1;
  publisherId: number = 1;
  eduContentId: number = 1;
  editorId: number = 1;
  learningAreaId: number = 1;
  eduContentProductTypeId: number = 1;
  editorStatusId: number = 1;
  eduContentSourceId: number = 1;
  fileExt: string = 'zip';
  fileLabel: string = 'oefening';

  constructor(props: Partial<EduContentMetadataInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
