import { ContentInterface } from '../+models';

export class ContentFixture implements ContentInterface {
  // defaults
  name: string = 'foo';
  id: number = 1;
  productType: string = 'ludo.zip';
  fileExtension: string = 'zip';
  description: string = 'foo bar';

  constructor(props: Partial<ContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
