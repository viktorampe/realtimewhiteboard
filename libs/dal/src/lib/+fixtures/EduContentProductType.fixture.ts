import {
  EduContentMetadataInterface,
  EduContentProductTypeInterface
} from '../+models';

export class EduContentProductTypeFixture
  implements EduContentProductTypeInterface {
  name: string;
  icon?: string;
  pedagogic?: boolean;
  excludeFromFilter?: boolean;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];

  constructor(props: Partial<EduContentProductTypeFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
