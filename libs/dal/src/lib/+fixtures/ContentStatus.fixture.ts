import { ContentStatusInterface, ContentStatusLabel } from '../+models';

export class ContentStatusFixture implements ContentStatusInterface {
  // defaults
  label = ContentStatusLabel.NEW;
  id = 1;

  constructor(props: Partial<ContentStatusInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
