import {
  EduContentBookInterface,
  EduContentMetadataInterface,
  LearningAreaInterface,
  MethodInterface,
  ProductContentInterface
} from '../+models';

export class MethodFixture implements MethodInterface {
  name: string;
  icon?: string;
  logoUrl?: string;
  experimental?: boolean;
  id?: number;
  learningAreaId?: number;
  productContents?: ProductContentInterface[];
  eduContentMetadata?: EduContentMetadataInterface[];
  learningArea?: LearningAreaInterface;
  eduContentBooks?: EduContentBookInterface[];

  constructor(props: Partial<MethodFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
