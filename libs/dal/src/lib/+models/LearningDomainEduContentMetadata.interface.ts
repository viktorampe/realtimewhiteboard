import { EduContentMetadataInterface } from './EduContentMetadata.interface';
import { LearningDomainInterface } from './LearningDomain.interface';

export interface LearningDomainEduContentMetadataInterface {
  id?: number;
  learningDomainId?: number;
  eduContentMetadataId?: number;
  learningDomain?: LearningDomainInterface;
  eduContentMetadata?: EduContentMetadataInterface;
}
