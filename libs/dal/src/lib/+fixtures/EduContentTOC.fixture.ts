import { EduContentTOCInterface } from '../+models';

export class EduContentTOCFixture implements EduContentTOCInterface {
  lft = 1;
  rgt = 2;
  treeId = 1;
  id = 1;
  title = 'foo';
  depth = 0;
  eduContentBook = null;

  constructor(props: Partial<EduContentTOCInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
