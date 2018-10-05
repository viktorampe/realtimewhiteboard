import { EduContentMetadataInterface } from './EduContentMetadata.interface';
import { LearningAreaInterface } from './LearningArea.interface';

export interface LearningDomainInterface {
  name: string;
  id?: number;
  learningAreaId?: number;
  learningArea?: LearningAreaInterface;
  eduContentMetadata?: EduContentMetadataInterface[];
}
