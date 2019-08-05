import { EduContentBookInterface } from './EduContentBook.interface';
import { EduContentMetadataInterface } from './EduContentMetadata.interface';
import { LearningPlanGoalInterface } from './LearningPlanGoal.interface';
export interface EduContentTOCInterface {
  treeId: number;
  title: string;
  lft: number;
  rgt: number;
  depth: number;
  id?: number;
  eduContentBook?: EduContentBookInterface;
  eduContentMetadata?: EduContentMetadataInterface[];
  children?: EduContentTOCInterface[];
  learningPlanGoalIds?: number[];
  learningPlanGoals?: LearningPlanGoalInterface[];
}
