import { EduContentBookInterface } from '@diekeure/polpo-api-angular-sdk';

export class EduContentBookFixture implements EduContentBookInterface {
  title = 'foo';
  ISBN = 'isbn-123';
  id = 0;
  methodId = 0;
  years = [];
  method = null;
  eduContentTOC = [];

  constructor(props: Partial<EduContentBookInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
