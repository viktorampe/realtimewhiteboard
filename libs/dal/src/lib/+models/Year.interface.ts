import { EduContentBookInterface } from './EduContentBook.interface';
import { EduContentMetadataInterface } from './EduContentMetadata.interface';
import { LearningPlanInterface } from './LearningPlan.interface';

export interface YearInterface {
  name: string;
  label: string;
  id?: number;
  eduContentMetadata?: EduContentMetadataInterface[];
  learningPlans?: LearningPlanInterface[];
  eduContentBook?: EduContentBookInterface[];
}
