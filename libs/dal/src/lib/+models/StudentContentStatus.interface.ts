import { ContentStatusInterface } from './ContentStatus.interface';
import { PersonInterface } from './Person.interface';
import { TaskEduContentInterface } from './TaskEduContent.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';
export interface StudentContentStatusInterface {
  id?: number;
  personId?: number;
  unlockedContentId?: number;
  taskEduContentId?: number;
  contentStatusId?: number;
  person?: PersonInterface;
  unlockedContent?: UnlockedContentInterface;
  taskEduContent?: TaskEduContentInterface;
  contentStatus?: ContentStatusInterface;
}
