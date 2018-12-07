import { ContentInterface } from '../+models';

export class ContentFixture implements ContentInterface {
  // defaults
  name = 'foo';
  id = 1;
  productType = 'ludo.zip';
  fileExtension = 'zip';
  fileTypeLabel = 'link';
  description = 'foo bar';

  constructor(props: Partial<ContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
