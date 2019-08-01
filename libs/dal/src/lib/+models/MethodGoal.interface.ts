import {
  EduContentBookInterface,
  EduContentMetadataInterface,
  EduContentTOCInterface,
  FinalTermInterface,
  LearningPlanGoalInterface,
  MethodInterface
} from '.';

export interface MethodGoalInterface {
  name: string;
  domain: string;
  Sortnumber?: number;
  id?: number;
  methodId?: number;
  eduContentBookId?: number;
  finalTerms?: FinalTermInterface[];
  learningPlanGoals?: LearningPlanGoalInterface[];
  method?: MethodInterface;
  eduContentBook?: EduContentBookInterface;
  eduContentTOC?: EduContentTOCInterface[];
  eduContentMetadata?: EduContentMetadataInterface[];
}
