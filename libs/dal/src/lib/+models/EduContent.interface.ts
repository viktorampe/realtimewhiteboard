import { EduContentMetadataInterface } from './EduContentMetadata.interface';
import { EduContentNoteInterface } from './EduContentNote.interface';
import { FavoriteInterface } from './Favorite.interface';
import { ProductContentInterface } from './ProductContent.interface';
import { ResultInterface } from './Result.interface';
import { TaskInterface } from './Task.interface';
import { UnlockedBoekeGroupInterface } from './UnlockedBoekeGroup.interface';
import { UnlockedBoekeStudentInterface } from './UnlockedBoekeStudent.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';

export enum EDU_CONTENT_TYPE {
  BOEKE = 'boek-e',
  LINK = 'link',
  EXERCISE = 'exercise',
  FILE = 'file',
  PAPER_EXERCISE = 'paper-exercise',
  WEB_APP = 'web-app',
  TIMELINE = 'timeline'
}

export interface EduContentInterface {
  type: EDU_CONTENT_TYPE;
  id?: number;
  publishedEduContentMetadataId?: number;
  productContents?: ProductContentInterface[];
  unlockedContents?: UnlockedContentInterface[];
  unlockedBoekeStudents?: UnlockedBoekeStudentInterface[];
  unlockedBoekeGroups?: UnlockedBoekeGroupInterface[];
  tasks?: TaskInterface[];
  results?: ResultInterface[];
  eduContentMetadata?: EduContentMetadataInterface[];
  publishedEduContentMetadata?: EduContentMetadataInterface;
  notes?: EduContentNoteInterface[];
  favorites?: FavoriteInterface[];
  previewImage?: string;
}
