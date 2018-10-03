import { EduNetInterface } from './EduNet.interface';
import { LearningAreaInterface } from './LearningArea.interface';
import { LearningPlanAssignmentInterface } from './LearningPlanAssignment.interface';

export interface LearningPlanInterface {
  name: string;
  code: string;
  link?: string;
  id?: number;
  learningAreaId?: number;
  eduNetId?: number;
  learningArea?: LearningAreaInterface;
  assignments?: LearningPlanAssignmentInterface[];
  eduNet?: EduNetInterface;
}
