import { EduContentBookInterface } from './EduContentBook.interface';
import { EduContentMetadataInterface } from './EduContentMetadata.interface';
import { LearningPlanInterface } from './LearningPlan.interface';

export interface YearInterface {
  name: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
  learningPlans?: LearningPlanInterface[];
  eduContentBook?: EduContentBookInterface[];
}
