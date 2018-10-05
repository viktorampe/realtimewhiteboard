import { EduContentMetadataInterface } from './EduContentMetadata.interface';
import { FavoriteInterface } from './Favorite.interface';
import { LearningDomainInterface } from './LearningDomain.interface';
import { MethodInterface } from './Method.interface';

export interface LearningAreaInterface {
  name: string;
  icon?: string;
  color: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
  methods?: MethodInterface[];
  learningDomains?: LearningDomainInterface[];
  favorites?: FavoriteInterface[];
}
