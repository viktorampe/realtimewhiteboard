import { EduContent } from '@campus/dal';
import { Bundle, Task } from '@diekeure/polpo-api-angular-sdk';

export interface EduContentSearchResultInterface {
  eduContent: EduContent;
  inTask: boolean;
  currentTask: Task;
  inBundle: boolean;
  currentBundle: Bundle;
  isFavorite: boolean;
}
