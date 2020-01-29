import { EduContent, TaskEduContentInterface } from '@campus/dal';

export interface TaskEduContentWithEduContentInterface
  extends TaskEduContentInterface {
  eduContent?: EduContent;
}
