import { ContentStatusInterface } from '../+models';

export class ContentStatusFixture implements ContentStatusInterface {
  // defaults
  label = 'foo';
  id = 1;

  constructor(props: Partial<ContentStatusInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
