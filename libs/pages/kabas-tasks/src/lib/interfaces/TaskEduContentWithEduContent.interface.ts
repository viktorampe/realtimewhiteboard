import {
  EduContent,
  TaskEduContentInterface,
  TaskWithAssigneesInterface
} from '@campus/dal';
import { ContentActionInterface } from '@campus/shared';

export interface TaskEduContentWithEduContentInterface
  extends TaskEduContentInterface {
  eduContent?: EduContent;
  actions?: ContentActionInterface[];
}

export interface TaskWithTaskEduContentInterface
  extends TaskWithAssigneesInterface {
  taskEduContents: TaskEduContentWithEduContentInterface[];
  actions?: { label: string; handler: Function }[];
  hasSolutionFiles?: boolean;
}
