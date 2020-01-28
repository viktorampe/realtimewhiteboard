import { EduContent, TaskEduContentInterface } from '@campus/dal';
import { ContentActionInterface } from '@campus/shared';

export interface TaskEduContentWithEduContentInterface
  extends TaskEduContentInterface {
  eduContent?: EduContent;
  actions?: ContentActionInterface[];
}
