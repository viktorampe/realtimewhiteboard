import {
  EduContentMetadataInterface,
  FavoriteInterface,
  LearningAreaInterface,
  LearningDomainInterface,
  MethodInterface
} from '../+models';

export class LearningAreaFixture implements LearningAreaInterface {
  name: string;
  icon?: string;
  color: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
  methods?: MethodInterface[];
  learningDomains?: LearningDomainInterface[];
  favorites?: FavoriteInterface[];

  constructor(props: Partial<LearningAreaFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
