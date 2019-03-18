import { EduContentTOCInterface } from '@diekeure/polpo-api-angular-sdk';

export class EduContentTOCFixture implements EduContentTOCInterface {
  lft = 0;
  rgt = 0;
  treeId = 1;
  title = 'foo';
  depth = 0;
  eduContentBook = null;

  constructor(props: Partial<EduContentTOCInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
