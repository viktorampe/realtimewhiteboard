import {
  EduContentMetadataInterface,
  EduContentProductTypeInterface
} from '../+models';

export class EduContentProductTypeFixture
  implements EduContentProductTypeInterface {
  name = 'correctiesleutel';
  icon = 'polpo-tasks-complete';
  pedagogic?: boolean;
  excludeFromFilter?: boolean;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
  parent?: number;

  constructor(props: Partial<EduContentProductTypeFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
