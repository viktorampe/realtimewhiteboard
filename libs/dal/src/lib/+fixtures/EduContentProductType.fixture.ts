import {
  EduContentMetadataInterface,
  EduContentProductTypeInterface
} from '../+models';

export class EduContentProductTypeFixture
  implements EduContentProductTypeInterface {
  name = 'correctiesleutel';
  icon?: string = 'polpo-tasks-complete';
  pedagogic?: boolean;
  excludeFromFilter?: boolean;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];

  constructor(props: Partial<EduContentProductTypeFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
