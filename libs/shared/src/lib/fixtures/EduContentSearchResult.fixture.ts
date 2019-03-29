import { EduContentFixture } from '@campus/dal';
import { EduContentSearchResultInterface } from '../interfaces';

export class EduContentSearchResultFixture
  implements EduContentSearchResultInterface {
  eduContent = new EduContentFixture();
  inTask = false;
  currentTask = null;
  inBundle = false;
  currentBundle = null;
  isFavorite = false;

  constructor(props: Partial<EduContentSearchResultInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
